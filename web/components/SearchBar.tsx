
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            if (query) {
                params.set('q', query)
            } else {
                params.delete('q')
            }
            router.push(`/explore?${params.toString()}`)
        })
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto mb-10">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects by skills, title, or tags..."
                    className="w-full pl-5 pr-12 py-3 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:text-white"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    )
}
