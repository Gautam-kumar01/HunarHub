'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type JobApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'selected'

export async function updateJobApplicationStatus(id: string, newStatus: JobApplicationStatus) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        console.error('Failed to update job application status:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/dashboard/job-applications')
    return { success: true }
}

