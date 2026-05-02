'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const routeMap: Record<string, string> = {
  doi_tac:             '/dashboard/doi-tac',
  chu_so_huu:          '/dashboard/chu-so-huu',
  nguoi_mua:           '/dashboard/nguoi-mua',
  nhan_vien_ngan_hang: '/dashboard/ngan-hang',
}

export async function signIn(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
  if (authError) return { error: 'Email hoặc mật khẩu không đúng.' }

  const userRes = await supabase
    .from('users')
    .select('vai_tro')
    .eq('email', email)
    .single()
  const userRecord = userRes.data as { vai_tro: string } | null

  redirect(routeMap[userRecord?.vai_tro ?? ''] ?? '/')
}
