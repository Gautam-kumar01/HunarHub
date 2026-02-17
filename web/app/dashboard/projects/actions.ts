
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
    'use server'

    const supabase = await createClient()

    // Authenticate user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Handle Form Data
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const demo_link = formData.get('demo_link') as string
    const github_link = formData.get('github_link') as string
    const tagsStr = formData.get('tags') as string

    const tags = tagsStr.split(',').map(tag => tag.trim()).filter(Boolean)

    // NOTE: Image handling usually requires client-side upload or sending the file to an API route due to Server Action limits with huge payloads sometimes, 
    // but for small images, we can try. However, direct upload from client to Supabase Storage is often better.
    // For this MVP, let's assume the client uploads the image first and sends us the URL, OR we handle it if it's small enough.
    // A better pattern for Next.js is "Upload to Storage Client Side -> Get URL -> Submit Form with URL".
    // Let's implement that pattern in the client component. 
    // So this action will just take the URL.

    const cover_image_url = formData.get('cover_image_url') as string

    const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        title,
        description,
        demo_link,
        github_link,
        tags,
        cover_image_url,
    })

    if (error) {
        console.error('Project creation failed:', error)
        return { error: 'Failed to create project.' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard?message=Project Created Successfully')
}
