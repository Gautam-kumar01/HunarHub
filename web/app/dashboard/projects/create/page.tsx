
'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateProjectPage() {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [coverUrl, setCoverUrl] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('project-assets')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('project-assets')
                .getPublicUrl(filePath)

            setCoverUrl(data.publicUrl)
        } catch (error) {
            alert('Error uploading image!')
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const demo_link = formData.get('demo_link') as string
        const github_link = formData.get('github_link') as string
        const tagsStr = formData.get('tags') as string

        // Parse tags: split by comma, trim whitespace
        const tags = tagsStr.split(',').map(tag => tag.trim()).filter(Boolean)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('You must be logged in')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('projects').insert({
            user_id: user.id,
            title,
            description,
            demo_link,
            github_link,
            tags,
            cover_image_url: coverUrl,
        })

        if (error) {
            alert('Error creating project')
            console.error(error)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6 mb-8">
                <div className="md:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Project</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Share your best work with the world. Include details and images to make it stand out.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 dark:divide-neutral-700 bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="space-y-6 sm:space-y-5">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. AI Content Generator"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="Briefly describe what your project does..."
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cover Image
                        </label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-neutral-600 px-6 pt-5 pb-6 hover:border-indigo-500 transition-colors">
                            <div className="space-y-1 text-center">
                                {coverUrl ? (
                                    <img src={coverUrl} alt="Cover Preview" className="mx-auto h-48 object-cover rounded-md" />
                                ) : (
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}

                                <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white dark:bg-neutral-800 font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>{uploading ? 'Uploading...' : 'Upload a file'}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 2MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="demo_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Live Demo URL
                            </label>
                            <div className="mt-1">
                                <input
                                    type="url"
                                    name="demo_link"
                                    id="demo_link"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                    placeholder="https://my-app.vercel.app"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="github_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                GitHub Repository
                            </label>
                            <div className="mt-1">
                                <input
                                    type="url"
                                    name="github_link"
                                    id="github_link"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                    placeholder="https://github.com/user/repo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tags
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="React, Next.js, OpenAI (comma separated)"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Publishing...' : 'Publish Project'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
