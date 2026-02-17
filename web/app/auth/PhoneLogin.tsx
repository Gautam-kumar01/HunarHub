'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function PhoneLogin() {
    const supabase = createClient()
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [step, setStep] = useState<'phone' | 'code'>('phone')
    const [loading, setLoading] = useState(false)

    async function sendCode(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ phone })
        setLoading(false)
        if (error) {
            alert('Error sending code: ' + error.message)
            return
        }
        setStep('code')
    }

    async function verifyCode(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.verifyOtp({
            phone,
            token: code,
            type: 'sms',
        })
        setLoading(false)
        if (error) {
            alert('Invalid code: ' + error.message)
            return
        }
        window.location.href = '/dashboard'
    }

    if (step === 'phone') {
        return (
            <form onSubmit={sendCode} className="mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium leading-6 text-neutral-900 dark:text-gray-200">
                        Phone number
                    </label>
                    <div className="mt-2">
                        <input
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+91XXXXXXXXXX"
                            className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {loading ? 'Sending code...' : 'Send code'}
                </button>
            </form>
        )
    }

    return (
        <form onSubmit={verifyCode} className="mt-6 space-y-4">
            <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900 dark:text-gray-200">
                    Verification code
                </label>
                <div className="mt-2">
                    <input
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        placeholder="Enter SMS code"
                        className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                {loading ? 'Verifying...' : 'Verify and sign in'}
            </button>
        </form>
    )
}

