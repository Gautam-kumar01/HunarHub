'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const full_name = formData.get('full_name') as string
    const headline = formData.get('headline') as string
    const bio = formData.get('bio') as string
    const skillsStr = formData.get('skills') as string
    const avatar_url = formData.get('avatar_url') as string

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean)

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            headline,
            bio,
            skills,
            avatar_url,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile update failed:', error)
        redirect('/dashboard/profile?error=Failed to update profile')
    }

    revalidatePath('/dashboard/profile')
    redirect('/dashboard/profile?message=Profile updated successfully')
}
