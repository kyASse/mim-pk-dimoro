// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    // Ikuti pola resmi: gunakan getAll/setAll agar cookie Supabase sinkron di Edge
    let response = NextResponse.next({ request });

    // Guard env
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[middleware] Supabase env missing; skipping auth cookie sync.');
        }
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        },
    );

    // Penting: jangan selipkan logika di antara createServerClient & getUser
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // 1) Proteksi login
    if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/portal'))) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    // 2) Redirect berdasarkan role (setelah login)
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = profile?.role;
        if (role === 'orang_tua' && !pathname.startsWith('/portal') && !pathname.startsWith('/api')) {
            const url = request.nextUrl.clone();
            url.pathname = '/portal';
            return NextResponse.redirect(url);
        }
    }

    // Penting: kembalikan response yang berisi setAll cookies
    return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}