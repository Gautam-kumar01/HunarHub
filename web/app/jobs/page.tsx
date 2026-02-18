import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function JobsPage() {
    const supabase = await createClient()

    const { data: jobs } = await supabase
        .from('jobs')
        .select('*, companies ( company_name, location )')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Latest <span className="text-indigo-600">Jobs</span>
                    </h1>
                    <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Browse internships and full-time roles posted by verified companies.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs?.map((job) => (
                        <div key={job.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-5 flex flex-col justify-between">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {job.title}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {job.companies?.company_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    📍 {job.location || job.companies?.location || 'Remote'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {job.type === 'internship' ? 'Internship' : 'Full-time'} • {job.remote_type || 'On-site'}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-sm">
                                <span className="text-gray-700 dark:text-gray-300">
                                    {job.paid ? job.salary || 'Paid' : 'Unpaid'}
                                </span>
                                <Link
                                    href={`/internships/${job.id}`}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium"
                                >
                                    View & Apply
                                </Link>
                            </div>
                        </div>
                    ))}

                    {(!jobs || jobs.length === 0) && (
                        <div className="col-span-3 text-center py-20 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                            <div className="text-6xl mb-4">🧭</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs posted yet</h3>
                            <p className="text-gray-500 dark:text-gray-400">Check back soon for new opportunities.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

