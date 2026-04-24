import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { createStaticParentRendieAction } from './actions';

export default async function AdminToolsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return redirect('/');

  async function runCreate(formData: FormData) {
    'use server'
    await createStaticParentRendieAction(null as any, formData);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin Tools</h1>
      <p className="text-sm text-muted-foreground">Buat akun portal orang tua statis untuk pengujian.</p>
  <form action={runCreate} className="space-y-2">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Buat Akun Orang Tua (Rendie)</button>
      </form>
      <p className="text-xs text-muted-foreground">Default email: orangtua.rendie@example.com, password: RendieTest123! (atau set ENV PARENT_TEST_EMAIL/PARENT_TEST_PASSWORD)</p>
    </div>
  );
}
