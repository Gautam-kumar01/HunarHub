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
    const college = formData.get('college') as string
    const education = formData.get('education') as string
    const experience = formData.get('experience') as string
    const resume_url = formData.get('resume_url') as string

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean)

    const { error: profileError } = await supabase
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

    if (profileError) {
        console.error('Profile update failed:', profileError)
        redirect('/dashboard/profile?error=Failed to update profile')
    }

    const { error: studentError } = await supabase
        .from('students')
        .upsert(
            {
                id: user.id,
                full_name,
                email: user.email,
                college,
                education,
                skills,
                experience,
                resume_url,
            },
            { onConflict: 'id' }
        )

    if (studentError) {
        console.error('Student details update failed:', studentError)
        redirect('/dashboard/profile?error=Failed to update student details')
    }

    revalidatePath('/dashboard/profile')
    redirect('/dashboard/profile?message=Profile updated successfully')
}
