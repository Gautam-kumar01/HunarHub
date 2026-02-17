
import SearchBar from '@/components/SearchBar'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams
    const query = params.q
    const supabase = await createClient()

    let projectsQuery = supabase
        .from('projects')
        .select(`
      *,
      profiles (
        full_name,
        avatar_url,
        role
      )
    `)
        .order('created_at', { ascending: false })

    if (query) {
        // Only searching title and description for MVP stability
        projectsQuery = projectsQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data: projects, error } = await projectsQuery

    if (error) {
        console.error('Error fetching projects:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Explore <span className="text-indigo-600">Hunar</span>
                    </h1>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Discover cutting-edge projects built by top student talent.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-16">
                    <Suspense fallback={<div>Loading search...</div>}>
                        <SearchBar />
                    </Suspense>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                    {projects?.map((project) => (
                        <div key={project.id} className="group relative bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                            {/* Image */}
                            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200 dark:bg-neutral-700 group-hover:opacity-75 h-48 relative">
                                {project.cover_image_url ? (
                                    <img
                                        src={project.cover_image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-neutral-800">
                                        <span className="text-4xl">🚀</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                    ❤️ {project.likes_count || 0}
                                </div>
                            </div>

                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                                            <Link href={project.demo_link || project.github_link || '#'}>
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {project.title}
                                            </Link>
                                        </h3>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.tags?.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                {tag}
                                            </span>
                                        ))}
                                        {project.tags?.length > 3 && (
                                            <span className="text-xs text-gray-500 self-center">+{project.tags.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Author Info */}
                                <div className="mt-6 flex items-center border-t border-gray-100 dark:border-neutral-700 pt-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                                            {(project.profiles as any)?.full_name?.[0] || 'U'}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <Link href={`/profile/${project.user_id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                                            {(project.profiles as any)?.full_name || 'Unknown Student'}
                                        </Link>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                            {(project.profiles as any)?.role || 'Student'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {(!projects || projects.length === 0) && (
                    <div className="text-center py-20">
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {query ? `No match for "${query}"` : 'Be the first to upload a project!'}
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/projects/create"
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Upload Project
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
