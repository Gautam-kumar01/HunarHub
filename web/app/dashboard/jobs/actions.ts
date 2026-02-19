'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createJob(formData: FormData) {
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
        redirect('/dashboard?error=Only companies can post jobs')
    }

    const { data: subscription } = await supabase
        .from('company_subscriptions')
        .select(
            `
            status,
            plan:plan_id (
                slug,
                max_jobs_per_month
            )
        `
        )
        .eq('company_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

    const maxJobsPerMonth = subscription?.plan?.max_jobs_per_month ?? 1

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()

    const { count: jobsThisMonth } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', user.id)
        .gte('created_at', monthStart)
        .lt('created_at', monthEnd)

    if (maxJobsPerMonth !== null && typeof jobsThisMonth === 'number' && jobsThisMonth >= maxJobsPerMonth) {
        redirect('/dashboard/jobs?error=Job+posting+limit+reached.+Upgrade+to+Premium+for+unlimited+posts.')
    }

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const skillsStr = formData.get('skills_required') as string
    const location = formData.get('location') as string
    const remote_type = formData.get('remote_type') as string
    const duration = formData.get('duration') as string
    const salary = formData.get('salary') as string
    const paid = formData.get('paid') === 'on'
    const openings = Number(formData.get('openings') || 0)
    const deadlineStr = formData.get('deadline') as string
    const description = formData.get('description') as string

    const skills_required = skillsStr.split(',').map(s => s.trim()).filter(Boolean)
    const deadline = deadlineStr ? new Date(deadlineStr).toISOString().slice(0, 10) : null

    const { error } = await supabase.from('jobs').insert({
        company_id: user.id,
        title,
        type,
        category,
        skills_required,
        location,
        remote_type,
        duration,
        salary,
        paid,
        openings,
        deadline,
        description,
    })

    if (error) {
        console.error('Job creation failed:', error)
        redirect('/dashboard?error=Failed to post job')
    }

    revalidatePath('/jobs')
    revalidatePath('/dashboard')
    redirect('/dashboard?message=Job posted successfully')
}
