import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NotificationsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch notifications
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Stay updated with your latest activity
                    </p>
                </div>
                {notifications && notifications.length > 0 && (
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm divide-y divide-gray-200 dark:divide-neutral-700">
                {notifications && notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-6 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors ${!notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'application' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                        notif.type === 'message' ? 'bg-green-100 dark:bg-green-900/30' :
                                            'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                    {notif.type === 'application' ? '📝' :
                                        notif.type === 'message' ? '💬' :
                                            notif.type === 'system' ? '🔔' : '📢'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notif.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {notif.message}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                        {new Date(notif.created_at).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {!notif.read && (
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">🔔</div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            We'll notify you when something important happens
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <Link
                    href="/dashboard"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
