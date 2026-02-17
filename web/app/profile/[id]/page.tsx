import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !profile) {
        notFound()
    }

    // Fetch user's projects
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-700 mb-8">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full bg-white dark:bg-neutral-700 border-4 border-white dark:border-neutral-800 flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-lg">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    profile.full_name?.[0]?.toUpperCase() || 'U'
                                )}
                            </div>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h1>
                                {profile.headline && (
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">{profile.headline}</p>
                                )}
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 capitalize">
                                            {profile.role}
                                        </span>
                                    </span>
                                    <span>📧 {profile.email}</span>
                                </div>
                            </div>

                            <Link
                                href="/dashboard"
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <div className="mt-8">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</h2>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{profile.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {profile.skills && profile.skills.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill: string) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects?.map((project) => (
                            <div key={project.id} className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                {project.cover_image_url && (
                                    <img
                                        src={project.cover_image_url}
                                        alt={project.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tags?.slice(0, 4).map((tag: string) => (
                                            <span key={tag} className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        {project.demo_link && (
                                            <a
                                                href={project.demo_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                            >
                                                🔗 Live Demo
                                            </a>
                                        )}
                                        {project.github_link && (
                                            <a
                                                href={project.github_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                            >
                                                💻 GitHub
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!projects || projects.length === 0) && (
                            <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
                                No projects to display yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
