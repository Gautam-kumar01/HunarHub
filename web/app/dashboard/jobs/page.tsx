import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createJob } from './actions'

export default async function DashboardJobsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter' && profile?.role !== 'company') {
        redirect('/dashboard')
    }

    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jobs</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Post new roles and manage openings for your company.
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Post a Job</h2>

                <form action={createJob} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            name="title"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="e.g. Backend Engineer Intern"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            >
                                <option value="internship">Internship</option>
                                <option value="fulltime">Full-time</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <input
                                name="category"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. Software, Design"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Location
                            </label>
                            <input
                                name="location"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. Remote, Bangalore"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Remote Type
                            </label>
                            <input
                                name="remote_type"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="Remote / Hybrid / On-site"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duration
                            </label>
                            <input
                                name="duration"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="3 months, 6 months"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Openings
                            </label>
                            <input
                                type="number"
                                name="openings"
                                min={1}
                                defaultValue={1}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Salary / Stipend
                            </label>
                            <input
                                name="salary"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. ₹15,000/month"
                            />
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <input
                                id="paid"
                                name="paid"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="paid" className="text-sm text-gray-700 dark:text-gray-300">
                                Paid position
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Skills Required
                        </label>
                        <input
                            name="skills_required"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="React, Node.js, SQL (comma separated)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Application Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={5}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="Describe responsibilities, requirements, and what candidates can expect."
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Jobs</h2>
                <div className="space-y-3">
                    {jobs?.map((job) => (
                        <div key={job.id} className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{job.title}</p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {job.type === 'internship' ? 'Internship' : 'Full-time'} • {job.location || 'Remote'}
                                </p>
                            </div>
                        </div>
                    ))}

                    {(!jobs || jobs.length === 0) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No jobs posted yet. Use the form above to create your first job.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

