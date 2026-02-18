import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import JobStatusSelect from './StatusSelect'

type JobApplicationRow = {
    id: string
    job_id: string
    student_id: string
    status: 'applied' | 'shortlisted' | 'rejected' | 'selected'
    applied_at: string
    job: {
        title: string
        location: string | null
    } | null
    student?: {
        full_name: string | null
        email: string | null
    } | null
}

export default async function JobApplicationsDashboardPage() {
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

    const isCompany = profile?.role === 'recruiter' || profile?.role === 'company'

    let applications: JobApplicationRow[] = []

    if (isCompany) {
        const { data } = await supabase
            .from('job_applications')
            .select(
                `
                *,
                job:job_id (
                    title,
                    location
                ),
                student:student_id (
                    full_name,
                    email
                )
            `
            )
            .order('applied_at', { ascending: false })

        applications = (data as JobApplicationRow[] | null) || []
    } else {
        const { data } = await supabase
            .from('job_applications')
            .select(
                `
                *,
                job:job_id (
                    title,
                    location
                )
            `
            )
            .eq('student_id', user.id)
            .order('applied_at', { ascending: false })

        applications = (data as JobApplicationRow[] | null) || []
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isCompany ? 'Job Applicants' : 'My Job Applications'}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {isCompany
                        ? 'Review candidates who applied to your jobs.'
                        : 'Track your applications to company jobs.'}
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <div className="col-span-4">{isCompany ? 'Candidate' : 'Job'}</div>
                    <div className="col-span-3">{isCompany ? 'Job' : 'Location'}</div>
                    <div className="col-span-2">Applied On</div>
                    <div className="col-span-2">Status</div>
                </div>

                {applications.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No applications yet.
                    </div>
                )}

                {applications.length > 0 && (
                    <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {applications.map((app) => (
                            <div key={app.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm">
                                <div className="col-span-4">
                                    {isCompany ? (
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white">
                                                {app.student?.full_name || 'Unknown candidate'}
                                            </span>
                                            {app.student?.email && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {app.student.email}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-900 dark:text-white">
                                            {app.job?.title}
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-3 text-gray-600 dark:text-gray-300">
                                    {isCompany ? (
                                        <span>{app.job?.title}</span>
                                    ) : (
                                        <span>📍 {app.job?.location || 'Remote'}</span>
                                    )}
                                </div>
                                <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(app.applied_at).toLocaleDateString()}
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    {isCompany ? (
                                        <JobStatusSelect id={app.id} currentStatus={app.status} />
                                    ) : (
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 capitalize">
                                            {app.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
