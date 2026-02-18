'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function upsertCompany(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter' && profile?.role !== 'company') {
        redirect('/dashboard?error=Only recruiters can manage company profile')
    }

    const company_name = formData.get('company_name') as string
    const official_email = formData.get('official_email') as string
    const website = formData.get('website') as string | null
    const linkedin = formData.get('linkedin') as string | null
    const industry = formData.get('industry') as string | null
    const location = formData.get('location') as string | null
    const company_size = formData.get('company_size') as string | null
    const description = formData.get('description') as string | null

    const { error: upsertError } = await supabase
        .from('companies')
        .upsert(
            {
                id: user.id,
                company_name,
                official_email,
                website,
                linkedin,
                industry,
                location,
                company_size,
                description,
            },
            { onConflict: 'id' }
        )

    if (upsertError) {
        console.error('Company upsert failed:', upsertError)
        redirect('/dashboard/company?error=Failed to save company details')
    }

    revalidatePath('/dashboard/company')
    redirect('/dashboard/company?message=Company profile saved successfully')
}

