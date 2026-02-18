import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { upsertCompany } from './actions'

export default async function CompanyPage({
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
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter') {
        redirect('/dashboard')
    }

    const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Profile</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Tell students about your company. These details appear on job listings.
                </p>
            </div>

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

            <form
                action={upsertCompany}
                className="space-y-6 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company Name
                        </label>
                        <input
                            name="company_name"
                            defaultValue={company?.company_name ?? ''}
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="e.g. HunarHub Labs Pvt. Ltd."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Industry
                        </label>
                        <input
                            name="industry"
                            defaultValue={company?.industry ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="e.g. SaaS, EdTech"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Website
                        </label>
                        <input
                            name="website"
                            defaultValue={company?.website ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="https://yourcompany.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            LinkedIn
                        </label>
                        <input
                            name="linkedin"
                            defaultValue={company?.linkedin ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="https://linkedin.com/company/yourcompany"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                        </label>
                        <input
                            name="location"
                            defaultValue={company?.location ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="e.g. Bangalore, India"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Official Email
                        </label>
                        <input
                            name="official_email"
                            type="email"
                            required
                            defaultValue={company?.official_email ?? user.email ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="hr@yourcompany.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Company Size
                        </label>
                        <input
                            name="company_size"
                            defaultValue={company?.company_size ?? ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                            placeholder="1-10, 11-50, 51-200..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Description
                    </label>
                    <textarea
                        name="description"
                        rows={5}
                        defaultValue={company?.description ?? ''}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-neutral-900 dark:border-neutral-600 dark:text-white p-2 border"
                        placeholder="Describe your mission, culture, and the kind of talent you are looking for."
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Save Company Profile
                    </button>
                </div>
            </form>
        </div>
    )
}
