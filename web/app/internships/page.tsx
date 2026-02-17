
import SearchBar from '@/components/SearchBar'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function InternshipsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams
    const query = params.q
    const supabase = await createClient()

    let jobsQuery = supabase
        .from('internships')
        .select('*')
        .eq('status', 'Open')
        .order('created_at', { ascending: false })

    if (query) {
        jobsQuery = jobsQuery.or(`title.ilike.%${query}%,company_name.ilike.%${query}%,location.ilike.%${query}%`)
    }

    const { data: jobs, error } = await jobsQuery

    if (error) {
        console.error('Error fetching jobs:', error)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Find Your <span className="text-indigo-600">Dream Role</span>
                    </h1>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Apply to top internships posted by verified startups.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-10">
                    <Suspense fallback={<div>Loading search...</div>}>
                        <SearchBar />
                    </Suspense>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {jobs?.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {job.title}
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.type === 'Remote'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {job.type}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex flex-wrap gap-x-6 gap-y-2">
                                    <span className="flex items-center gap-1">
                                        🏢 {job.company_name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        📍 {job.location || 'Remote'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        💰 {job.salary_range || 'Unpaid'}
                                    </span>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {job.requirements?.slice(0, 3).map((req: string, i: number) => (
                                        <span key={i} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded">
                                            {req.length > 30 ? req.substring(0, 30) + '...' : req}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Link
                                href={`/internships/${job.id}`}
                                className="w-full sm:w-auto text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                            >
                                View & Apply
                            </Link>
                        </div>
                    ))}

                    {(!jobs || jobs.length === 0) && (
                        <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
