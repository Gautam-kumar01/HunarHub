
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createInternship(formData: FormData) {
    const supabase = await createClient()

    // Authenticate user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ensure user is RECRUITER
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'recruiter') {
        redirect('/dashboard?error=Only recruiters can post jobs')
    }

    // Parse Form Data
    const title = formData.get('title') as string
    const company_name = formData.get('company_name') as string
    const location = formData.get('location') as string
    const salary_range = formData.get('salary_range') as string
    const type_field = formData.get('type') as string // 'Full-time' | 'Part-time' | 'Remote'
    const requirementsStr = formData.get('requirements') as string

    const requirements = requirementsStr.split('\n').map(req => req.trim()).filter(Boolean)

    const { error } = await supabase.from('internships').insert({
        recruiter_id: user.id,
        title,
        company_name,
        location,
        salary_range,
        type: type_field as 'Full-time' | 'Part-time' | 'Remote', // Cast to Enum
        requirements,
        status: 'Open'
    })

    if (error) {
        console.error('Job posting failed:', error)
        redirect('/dashboard?error=Failed to post job')
    }

    revalidatePath('/dashboard')
    redirect('/dashboard?message=Job Posted Successfully')
}
