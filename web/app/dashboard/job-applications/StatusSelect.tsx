'use client'

import { useRouter } from 'next/navigation'
import { updateJobApplicationStatus, JobApplicationStatus } from './actions'

export default function JobStatusSelect({ id, currentStatus }: { id: string; currentStatus: JobApplicationStatus }) {
    const router = useRouter()

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as JobApplicationStatus
        await updateJobApplicationStatus(id, newStatus)
        router.refresh()
    }

    return (
        <select
            value={currentStatus}
            onChange={handleChange}
            className={`text-xs px-2 py-1 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500
            ${currentStatus === 'applied' ? 'bg-yellow-50 text-yellow-800' : ''}
            ${currentStatus === 'shortlisted' ? 'bg-blue-50 text-blue-800' : ''}
            ${currentStatus === 'selected' ? 'bg-green-50 text-green-800' : ''}
            ${currentStatus === 'rejected' ? 'bg-red-50 text-red-800' : ''}
        `}
        >
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
        </select>
    )
}

