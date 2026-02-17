
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in a real app, you might want to validate this with Zod
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/login?error=Invalid Credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in a real app, you might want to validate this with Zod
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        full_name: formData.get('full_name') as string,
        role: formData.get('role') as string, // 'student' or 'recruiter'
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.full_name,
                role: data.role || 'student',
            },
        }
    })

    // if success, update profile? 
    // No, we have a trigger for that in schema.sql: handle_new_user()

    if (error) {
        console.error('Signup error:', error)
        redirect(`/signup?error=${encodeURIComponent(error.message || 'Could not create user')}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard?message=Check email to continue sign in process')
}
