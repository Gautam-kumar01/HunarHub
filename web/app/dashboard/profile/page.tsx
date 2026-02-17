import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from './actions'
import Link from 'next/link'

export default async function ProfilePage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const params = await searchParams
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Success/Error Messages */}
            {params.message && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg border border-green-100 dark:border-green-800">
                    {params.message}
                </div>
            )}
            {params.error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-100 dark:border-red-800">
                    {params.error}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Portfolio</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your profile and showcase your work.
                </p>
            </div>

            {/* Profile Edit Form */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                <form action={updateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                id="full_name"
                                defaultValue={profile?.full_name || ''}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            />
                        </div>

                        <div>
                            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Headline
                            </label>
                            <input
                                type="text"
                                name="headline"
                                id="headline"
                                defaultValue={profile?.headline || ''}
                                placeholder="e.g. Full Stack Developer | AI Enthusiast"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            defaultValue={profile?.bio || ''}
                            placeholder="Tell us about yourself..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                        />
                    </div>

                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Skills
                        </label>
                        <input
                            type="text"
                            name="skills"
                            id="skills"
                            defaultValue={profile?.skills?.join(', ') || ''}
                            placeholder="React, Node.js, Python, Machine Learning (comma separated)"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                        />
                    </div>

                    <input type="hidden" name="avatar_url" value={profile?.avatar_url || ''} />

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-sm font-medium border border-gray-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Projects Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Projects</h2>
                    <Link
                        href="/dashboard/projects/create"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                    >
                        + Add Project
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects?.map((project) => (
                        <div key={project.id} className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                            {project.cover_image_url && (
                                <img
                                    src={project.cover_image_url}
                                    alt={project.title}
                                    className="w-full h-32 object-cover rounded-md mb-3"
                                />
                            )}
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                {project.description}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {project.tags?.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}

                    {(!projects || projects.length === 0) && (
                        <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
                            No projects yet. Upload your first project to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
