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
            // Flusso Magic Link tramite bottone o auto-verifica
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
            return NextResponse.json({ error: 'Dati incompleti per la verifica. Riprova dalla mail.' }, { status: 400 });
        }

        if (authError) {
            console.error('Verify OTP Error:', authError.message);
            // Messaggio più umano in base all'errore
            let friendlyMessage = authError.message;
            if (authError.message.includes('expired')) {
              friendlyMessage = 'Il link o il codice è scaduto. Richiedine uno nuovo.';
            } else if (authError.message.includes('invalid')) {
              friendlyMessage = 'Il codice o il link non sono validi.';
            }

            return NextResponse.json({ error: friendlyMessage }, { status: 401 });
        }

        return NextResponse.json({ success: true, redirect: '/admin' });
    } catch (err: any) {
        return NextResponse.json({ error: 'Errore interno del server. Riprova più tardi.' }, { status: 500 });
    }
}
