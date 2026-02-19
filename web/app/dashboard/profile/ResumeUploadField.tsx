'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function ResumeUploadField({ initialUrl }: { initialUrl?: string }) {
    const [resumeUrl, setResumeUrl] = useState(initialUrl || '')
    const [uploading, setUploading] = useState(false)

    const supabase = createClient()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            setUploading(false)
            return
        }

        const fileExt = file.name.split('.').pop()
        const filePath = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file)

        if (uploadError) {
            setUploading(false)
            alert('Failed to upload resume: ' + uploadError.message)
            return
        }

        const { data } = supabase.storage.from('resumes').getPublicUrl(filePath)

        if (data?.publicUrl) {
            setResumeUrl(data.publicUrl)
        }

        setUploading(false)
    }

    return (
        <div className="space-y-2">
            <div>
                <label htmlFor="resume_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resume Upload
                </label>
                <input
                    id="resume_file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    disabled={uploading}
                />
                {uploading && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Uploading...</p>
                )}
            </div>

            <div>
                <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resume URL
                </label>
                <input
                    type="url"
                    name="resume_url"
                    id="resume_url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                />
            </div>
        </div>
    )
}

