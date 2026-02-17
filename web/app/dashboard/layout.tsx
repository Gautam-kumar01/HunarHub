
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile to get role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    const isRecruiter = profile?.role === 'recruiter'

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                            H
                        </div>
                        <span className="text-xl font-bold tracking-tight dark:text-white">
                            HunarHub
                        </span>
                    </Link>
                    <div className="mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {profile?.role} Account
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/dashboard" label="Overview" icon="📊" />

                    {isRecruiter ? (
                        <>
                            <NavLink href="/dashboard/post-job" label="Post New Job" icon="✍️" />
                            <NavLink href="/dashboard/applications" label="Applications" icon="box" />
                            <NavLink href="/dashboard/company" label="Company Profile" icon="🏢" />
                        </>
                    ) : (
                        <>
                            <NavLink href="/dashboard/profile" label="My Portfolio" icon="👤" />
                            <NavLink href="/dashboard/projects/create" label="Upload Project" icon="🚀" />
                            <NavLink href="/dashboard/applications" label="My Applications" icon="📝" />
                        </>
                    )}

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-neutral-700">
                        <NavLink href="/dashboard/messages" label="Messages" icon="💬" />
                        <NavLink href="/dashboard/settings" label="Settings" icon="⚙️" />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {profile?.full_name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {profile?.full_name}
                            </p>
                            <form action="/auth/signout" method="post">
                                <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition duration-150"
        >
            <span className="text-lg">{icon}</span>
            {label}
        </Link>
    )
}
