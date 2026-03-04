'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getAuthenticatedClient() {
  const supabase = createServerSupabaseClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not authenticated');

  return supabase;
}

export async function addProject(formData: FormData) {
  const supabase = await getAuthenticatedClient();

  const payload = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    url: (formData.get('url') as string) || null,
    github_url: (formData.get('github_url') as string) || null,
    status: (formData.get('status') as string) || 'healthy',
    color_hex: (formData.get('color_hex') as string) || null,
    supabase_account_email: (formData.get('supabase_account_email') as string) || null,
    supabase_project_url: (formData.get('supabase_project_url') as string) || null,
    supabase_anon_key: (formData.get('supabase_anon_key') as string) || null,
    supabase_service_key: (formData.get('supabase_service_key') as string) || null,
    notes: (formData.get('notes') as string) || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  };

  const { error } = await supabase.from('deployed_projects').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/projects-dashboard');
}

export async function updateProject(formData: FormData) {
  const supabase = await getAuthenticatedClient();

  const id = formData.get('id') as string;
  const payload = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    url: (formData.get('url') as string) || null,
    github_url: (formData.get('github_url') as string) || null,
    status: (formData.get('status') as string) || 'healthy',
    color_hex: (formData.get('color_hex') as string) || null,
    supabase_account_email: (formData.get('supabase_account_email') as string) || null,
    supabase_project_url: (formData.get('supabase_project_url') as string) || null,
    supabase_anon_key: (formData.get('supabase_anon_key') as string) || null,
    supabase_service_key: (formData.get('supabase_service_key') as string) || null,
    notes: (formData.get('notes') as string) || null,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('deployed_projects').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/projects-dashboard');
}

export async function deleteProject(formData: FormData) {
  const supabase = await getAuthenticatedClient();

  const id = formData.get('id') as string;
  const { error } = await supabase.from('deployed_projects').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/projects-dashboard');
}
