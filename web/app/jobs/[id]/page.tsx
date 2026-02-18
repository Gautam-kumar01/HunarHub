import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ApplyButton from './ApplyButton'

type JobPageProps = {
    params: {
        id: string
    }
}

export default async function JobDetailPage({ params }: JobPageProps) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { data: job } = await supabase
        .from('jobs')
        .select(
            `
            *,
            companies:company_id (
                company_name,
                location
            )
        `
        )
        .eq('id', params.id)
        .single()

    if (!job) {
        redirect('/jobs')
    }

    let existingApplication = false

    if (user) {
        const { data: existing } = await supabase
            .from('job_applications')
            .select('id')
            .eq('job_id', params.id)
            .eq('student_id', user.id)
            .maybeSingle()

        existingApplication = !!existing
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {job.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">{job.companies?.company_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                📍 {job.location || job.companies?.location || 'Remote'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {job.type === 'internship' ? 'Internship' : 'Full-time'} • {job.remote_type || 'On-site'}
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-3">
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Compensation</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {job.paid ? job.salary || 'Paid' : 'Unpaid'}
                                </p>
                            </div>
                            <ApplyButton jobId={job.id} existingApplication={existingApplication} />
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-neutral-700 pt-6 text-sm">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Category</p>
                            <p className="text-gray-900 dark:text-white">{job.category || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                            <p className="text-gray-900 dark:text-white">{job.duration || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Openings</p>
                            <p className="text-gray-900 dark:text-white">{job.openings || 1}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {(job.skills_required || []).length > 0 ? (
                                job.skills_required.map((skill: string) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No specific skills listed.</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Job Description</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {job.description || 'No description provided.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

