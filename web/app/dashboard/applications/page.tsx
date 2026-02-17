
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatusSelect from './StatusSelect'

export default async function ApplicationsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get User Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isRecruiter = profile?.role === 'recruiter'

    // Fetch Logic
    let applications: any[] = []

    if (isRecruiter) {
        // Recruiter: Show applications for MY owned internships
        // We rely on RLS to filter to open internships owned by me
        // But we need to be explicit to join profiles
        const { data, error } = await supabase
            .from('applications')
            .select(`
        *,
        student:student_id (
          full_name,
          email,
          skills,
          avatar_url
        ),
        internship:internship_id (
          title
        )
      `)
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        applications = data || []
    } else {
        // Student: Show MY applications
        const { data, error } = await supabase
            .from('applications')
            .select(`
        *,
        internship:internship_id (
          title,
          company_name,
          location
        )
      `)
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        applications = data || []
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isRecruiter ? 'Candidates' : 'My Applications'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isRecruiter
                            ? 'Manage applicants for your posted internships.'
                            : 'Track the status of your submitted applications.'}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <div className="col-span-4">{isRecruiter ? 'Candidate' : 'Role / Company'}</div>
                    <div className="col-span-3">{isRecruiter ? 'Applied For' : 'Location'}</div>
                    <div className="col-span-2">Applied On</div>
                    <div className="col-span-3 text-right">Status</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {applications.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            No applications found.
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition duration-150">

                                {/* User/Role Column */}
                                <div className="col-span-4">
                                    {isRecruiter ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                                {app.student?.full_name?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{app.student?.full_name}</p>
                                                <a href={`mailto:${app.student?.email}`} className="text-xs text-indigo-500 hover:underline block truncate max-w-[150px]">
                                                    {app.student?.email}
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <Link href={`/internships/${app.internship_id}`} className="text-sm font-semibold text-indigo-600 hover:underline block truncate">
                                                {app.internship?.title}
                                            </Link>
                                            <p className="text-xs text-gray-500">{app.internship?.company_name}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Job/Location Column */}
                                <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">
                                    {isRecruiter ? (
                                        <span className="truncate block" title={app.internship?.title}>
                                            {app.internship?.title}
                                        </span>
                                    ) : (
                                        <span>📍 {app.internship?.location || 'Remote'}</span>
                                    )}
                                </div>

                                {/* Date Column */}
                                <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </div>

                                {/* Status Column */}
                                <div className="col-span-3 flex justify-end items-center gap-2">
                                    {isRecruiter ? (
                                        <>
                                            {/* Recruiter Controls */}
                                            <StatusSelect id={app.id} currentStatus={app.status} />
                                            {app.resume_url && (
                                                <a
                                                    href={app.resume_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-indigo-600"
                                                    title="View Resume"
                                                >
                                                    📄
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        /* Student Status Badge */
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                      ${app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                      ${app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
                      ${app.status === 'interviewing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                    `}>
                                            {app.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
