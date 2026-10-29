// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key';

  return createBrowserClient(
    url,
    key,
    {
      isSingleton: true,
      auth: {
        lock: async (_name, _acquireTimeout, fn) => {
          return await fn();
        },
      },
    }
  );
}
