import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') ?? '/admin';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${requestUrl.origin}${next}`);
        }
        console.error('Session exchange error:', error.message);
        return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=${encodeURIComponent(error.message)}`);
    }

    return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=Nessun_codice_fornito`);
}
