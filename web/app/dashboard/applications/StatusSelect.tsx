
'use client'

import { updateApplicationStatus } from './actions'
import { useRouter } from 'next/navigation'

export default function StatusSelect({ id, currentStatus }: { id: string, currentStatus: string }) {
    const router = useRouter()

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        await updateApplicationStatus(id, newStatus)
        router.refresh()
    }

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            className={`text-xs px-2 py-1 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
        ${currentStatus === 'pending' ? 'bg-yellow-50 text-yellow-800' : ''}
        ${currentStatus === 'accepted' ? 'bg-green-50 text-green-800' : ''}
        ${currentStatus === 'rejected' ? 'bg-red-50 text-red-800' : ''}
        ${currentStatus === 'interviewing' ? 'bg-blue-50 text-blue-800' : ''}
      `}
        >
            <option value="pending">Pending</option>
            <option value="interviewing">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
        </select>
    )
}
