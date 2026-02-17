
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateApplicationStatus(id: string, newStatus: string) {
    const supabase = await createClient()

    // Verify permission is implicit via RLS: Only recruiter of internship can update
    const { error } = await supabase
        .from('applications')
        .update({ status: newStatus as any })
        .eq('id', id)

    if (error) {
        console.error('Failed to update status:', error)
        return { error: 'Failed to update status' }
    }

    revalidatePath('/dashboard/applications')
    return { success: true }
}
