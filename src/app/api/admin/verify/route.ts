import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EmailOtpType } from '@supabase/supabase-js';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { token_hash, type = 'magiclink', email, token } = body;

        const supabase = await createClient();

        let authError;

        if (token_hash) {
            // Flusso Magic Link tramite bottone
            const { error } = await supabase.auth.verifyOtp({
                token_hash,
                type: type as EmailOtpType,
            });
            authError = error;
        } else if (email && token) {
            // Flusso con codice a 6 cifre
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });
            authError = error;
        } else {
            return NextResponse.json({ error: 'Dati mancanti per la verifica.' }, { status: 400 });
        }

        if (authError) {
            console.error('Verify OTP Error:', authError.message);
            return NextResponse.json({ error: authError.message }, { status: 401 });
        }

        return NextResponse.json({ success: true, redirect: '/admin' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Errore interno' }, { status: 500 });
    }
}
