g'use client'

import { createClient } from '@/utils/supabase/client'

export function SocialAuthButtons() {
    const supabase = createClient()

    async function signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })
        if (error) {
            console.error('Google login error', error)
        }
    }

    async function signInWithGitHub() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })
        if (error) {
            console.error('GitHub login error', error)
        }
    }

    return (
        <div className="mt-6 space-y-2">
            <button
                type="button"
                onClick={signInWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm font-semibold leading-6 text-neutral-900 dark:text-white shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded bg-white">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 48 48"
                        className="h-4 w-4"
                    >
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6 1.54 7.38 2.84l5.42-5.42C33.64 3.5 29.3 1.5 24 1.5 14.82 1.5 7.07 6.98 3.9 14.64l6.74 5.23C12.14 14.31 17.41 9.5 24 9.5Z"
                        />
                        <path
                            fill="#34A853"
                            d="M46.5 24.5c0-1.57-.14-3.09-.41-4.56H24v9.13h12.7c-.55 2.86-2.22 5.28-4.73 6.9l7.35 5.7C43.72 37.85 46.5 31.7 46.5 24.5Z"
                        />
                        <path
                            fill="#4A90E2"
                            d="M10.64 28.39A14.47 14.47 0 0 1 9.5 24c0-1.53.26-3.01.73-4.39l-6.74-5.23A22.42 22.42 0 0 0 1.5 24c0 3.63.86 7.06 2.39 10.09l6.75-5.7Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M24 46.5c5.85 0 10.77-1.93 14.36-5.24l-7.35-5.7C29.38 36.74 26.92 37.5 24 37.5c-6.59 0-12.16-4.47-14.14-10.56l-6.75 5.7C7.07 41.02 14.82 46.5 24 46.5Z"
                        />
                        <path
                            fill="none"
                            d="M1.5 1.5h45v45h-45Z"
                        />
                    </svg>
                </span>
                <span>Continue with Google</span>
            </button>
            <button
                type="button"
                onClick={signInWithGitHub}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 text-sm font-semibold leading-6 text-neutral-900 dark:text-white shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className="h-4 w-4"
                    >
                        <path
                            fill="currentColor"
                            d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38
                            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.53 7.53 0 0 1 8 3.5c.68 0 1.36.09 2 .26
                            1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
                            3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                        />
                    </svg>
                </span>
                <span>Continue with GitHub</span>
            </button>
        </div>
    )
}

