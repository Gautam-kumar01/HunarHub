
import { createInternship } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PostJobPage() {
    const supabase = await createClient()

    // Verify Role
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter') {
        return (
            <div className="p-8 text-center bg-white dark:bg-neutral-800 rounded-xl m-8 border border-red-200 dark:border-red-900">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Access Denied</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Only Recruiters can post internship opportunities.</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="md:grid md:grid-cols-3 md:gap-6 mb-8">
                <div className="md:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post an Internship</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Find the perfect candidate by describing the role clearly.
                    </p>
                </div>
            </div>

            <form action={createInternship} className="space-y-8 divide-y divide-gray-200 dark:divide-neutral-700 bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="space-y-6 sm:space-y-5">
                    {/* Job Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Role Title
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. Junior Frontend Developer"
                            />
                        </div>
                    </div>

                    {/* Company Name */}
                    <div>
                        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="company_name"
                                id="company_name"
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. Acme Inc."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Location
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                    placeholder="e.g. Bangalore, India"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Job Type
                            </label>
                            <div className="mt-1">
                                <select
                                    id="type"
                                    name="type"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Salary */}
                    <div>
                        <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Stipend / Salary
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="salary_range"
                                id="salary_range"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="e.g. ₹15,000 - ₹25,000 / month"
                            />
                        </div>
                    </div>

                    {/* Requirements - simple textarea for now */}
                    <div>
                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Key Requirements & Responsibilities
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="requirements"
                                name="requirements"
                                rows={6}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                                placeholder="- Must know React.&#10;- Experience with Supabase is a plus.&#10;- Good communication skills."
                            />
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Put each requirement on a new line.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Post Internship
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
