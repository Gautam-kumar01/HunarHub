
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ApplyButton({ internshipId, existingApplication }: { internshipId: string, existingApplication: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resumeLink, setResumeLink] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login')
            return
        }

        const { error } = await supabase.from('applications').insert({
            internship_id: internshipId,
            student_id: user.id,
            cover_letter: coverLetter,
            resume_url: resumeLink,
            status: 'pending'
        })

        if (error) {
            alert('Application failed: ' + error.message)
        } else {
            alert('Application submitted successfully!')
            setIsOpen(false)
            router.refresh()
        }
        setLoading(false)
    }

    if (existingApplication) {
        return (
            <button disabled className="px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-lg cursor-not-allowed w-full md:w-auto">
                Already Applied
            </button>
        )
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all w-full md:w-auto"
            >
                Apply Now
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Apply for Position</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Show them why you're the best fit.
                        </p>

                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Resume / Portfolio Link
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={resumeLink}
                                    onChange={(e) => setResumeLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Cover Letter
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Introduce yourself and explain why you're a good fit..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
