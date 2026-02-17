
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single()

    const isRecruiter = profile?.role === 'recruiter'

    // Fetch Stats based on role
    let stats: { label: string; value: number }[] = []

    if (isRecruiter) {
        const { count: jobCount } = await supabase
            .from('internships')
            .select('*', { count: 'exact', head: true })
            .eq('recruiter_id', user.id)
            .eq('status', 'Open')

        const { count: appCount } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
        // Note: This query counts ALL pending applications for internships where recruiter = me
        // This is simplified. RLS handles visibility.

        stats = [
            { label: 'Active Jobs', value: jobCount || 0 },
            { label: 'Pending Applications', value: appCount || 0 }
        ]
    } else {
        // Student Stats
        const { count: projectCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        const { count: appCount } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', user.id)

        stats = [
            { label: 'Projects Showcase', value: projectCount || 0 },
            { label: 'Applications Sent', value: appCount || 0 }
        ]
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {profile?.full_name?.split(' ')[0]}! 👋
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here is what’s happening with your account today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                        <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                            {stat.label}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                            {stat.value}
                        </dd>
                    </div>
                ))}

                {/* Call to Action Card */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 flex flex-col justify-center items-start">
                    <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
                        {isRecruiter ? 'Find Top Talent' : 'Boost Your Profile'}
                    </h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1 mb-4">
                        {isRecruiter
                            ? 'Post a new internship to reach thousands of skilled students.'
                            : 'Add a new project to showcase your latest skills.'}
                    </p>
                    {/* Note: We use standard anchor here or Next Link */}
                    <a
                        href={isRecruiter ? '/dashboard/post-job' : '/dashboard/projects/create'}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        {isRecruiter ? 'Post Internship' : 'Upload Project'}
                    </a>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Recent Activity
                    </h3>
                </div>
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 py-12">
                    No recent activity to show yet.
                    {isRecruiter ? ' Post a job to get started!' : ' Apply to internships or upload projects!'}
                </div>
            </div>
        </div>
    )
}
