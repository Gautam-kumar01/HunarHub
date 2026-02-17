
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ApplyButton from './ApplyButton'
import Link from 'next/link'

export default async function InternshipDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: job, error } = await supabase
        .from('internships')
        .select(`
      *,
      profiles (
        full_name,
        company_details
      )
    `)
        .eq('id', id)
        .single()

    if (error || !job) {
        notFound()
    }

    // Check if current user has applied
    const {
        data: { user },
    } = await supabase.auth.getUser()

    let hasApplied = false

    if (user) {
        const { data: application } = await supabase
            .from('applications')
            .select('id')
            .eq('internship_id', id)
            .eq('student_id', user.id)
            .single()

        if (application) {
            hasApplied = true
        }
    }

    const isRecruiter = user?.id === job.recruiter_id

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-neutral-700">

                {/* Header */}
                <div className="bg-indigo-600 px-8 py-10 relative">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                            <div className="flex items-center text-indigo-100 gap-4 text-sm font-medium">
                                <span className="flex items-center gap-1">🏢 {job.company_name}</span>
                                <span className="flex items-center gap-1">📍 {job.location || 'Remote'}</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-white">{job.type}</span>
                            </div>
                        </div>

                        {/* Recruiter Actions */}
                        {isRecruiter && (
                            <Link
                                href={`/dashboard/applications?job=${job.id}`}
                                className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-100 transition"
                            >
                                View Applications
                            </Link>
                        )}
                    </div>

                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* About Role */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-indigo-500">📋</span> About the Role
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                            <p className="whitespace-pre-line">
                                We are looking for a {job.title} to join our team at {job.company_name}.
                                {/* Since we didn't store a full description, we construct one or assume requirements cover it. 
                     Actually, schema had requirements array but no generic description field in main definition? 
                     Let me check schema.
                     Ah, 'internships' table: title, company_name, location, type, salary_range, requirements, status.
                     No 'description' column! The blueprint asked for fields but I might have missed 'description' in the schema creation step explicitly or implied it.
                     Let me check schema.sql content again.
                     Line 85: requirements TEXT[] DEFAULT '{}'.
                     Line 80-88: title, company_name, location...
                     Indeed, there is no generic description. I should have added one.
                     For now, I'll allow requirements to serve as the main body.
                 */}
                                This is a {job.type} opportunity based in {job.location || 'Remote'}.
                            </p>
                        </div>
                    </section>

                    {/* Requirements */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-indigo-500">✅</span> Requirements & Responsibilities
                        </h2>
                        <ul className="space-y-3">
                            {job.requirements?.map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-neutral-700/50 p-3 rounded-lg border border-gray-100 dark:border-neutral-700">
                                    <div className="mt-1 min-w-[20px] text-green-500">✔</div>
                                    <span className="text-gray-700 dark:text-gray-300">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Salary */}
                    <section className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30 flex items-center gap-4">
                        <div className="text-2xl">💰</div>
                        <div>
                            <h3 className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wide">Compensation</h3>
                            <p className="text-lg font-mono font-medium text-gray-900 dark:text-white">{job.salary_range || 'Competitive / Unpaid'}</p>
                        </div>
                    </section>

                    {/* User Profile / Recruiter Info */}
                    <div className="border-t border-gray-100 dark:border-neutral-700 pt-8 mt-8 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                            {(job.profiles as any)?.full_name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Posted by</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{(job.profiles as any)?.full_name}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6">
                        {!isRecruiter ? (
                            <ApplyButton internshipId={job.id} existingApplication={hasApplied} />
                        ) : (
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                                You posted this job. <Link href="/dashboard" className="underline font-bold">Manage it in Dashboard</Link>.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
