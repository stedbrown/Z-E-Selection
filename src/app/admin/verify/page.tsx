'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') || 'magiclink';
    const emailFromUrl = searchParams.get('email') || '';

    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState(emailFromUrl);
    const [autoVerifying, setAutoVerifying] = useState(!!tokenHash);

    const handleVerifyHash = useCallback(async () => {
        setRedirecting(true);
        setError('');
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token_hash: tokenHash, type })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Errore di verifica del link.');
            }

            window.location.href = '/admin';
        } catch (err: any) {
            setError(err.message);
            setRedirecting(false);
            setAutoVerifying(false);
        }
    }, [tokenHash, type]);

    // Auto-verifica se è presente il token_hash
    useEffect(() => {
        if (tokenHash && !redirecting && !error) {
            handleVerifyHash();
        }
    }, [tokenHash, handleVerifyHash, redirecting, error]);

    if (autoVerifying || (tokenHash && redirecting)) {
        return (
            <div className="text-center py-8 animate-in fade-in duration-700">
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 bg-black/5 rounded-full animate-ping" />
                    <div className="relative bg-black rounded-full w-20 h-20 flex items-center justify-center shadow-xl">
                        <Loader2 className="text-white w-10 h-10 animate-spin" />
                    </div>
                </div>
                <h1 className="text-2xl font-serif mb-3 text-gray-900">Verifica in corso</h1>
                <p className="text-gray-500 font-light max-w-xs mx-auto">
                    Stiamo convalidando il tuo accesso sicuro. Verrai reindirizzato tra un istante.
                </p>
            </div>
        );
    }

    if (error && tokenHash) {
        return (
            <div className="text-center py-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-red-500 w-8 h-8" />
                </div>
                <h1 className="text-2xl font-serif mb-3 text-gray-900">Link non valido</h1>
                <div className="mb-8 p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-sm">
                    {error}
                </div>
                <Link 
                    href="/admin/login" 
                    className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors shadow-lg shadow-black/5"
                >
                    Torna al Login
                </Link>
            </div>
        );
    }



    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 text-center py-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Mail className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-serif font-medium text-gray-900 mb-4">Controlla l'email</h1>
            <p className="text-gray-500 font-light text-base leading-relaxed max-w-sm mx-auto mb-8">
                Ti abbiamo inviato un link di accesso sicuro all'indirizzo <br />
                <span className="font-medium text-gray-900">{emailFromUrl || 'indicato'}</span>.
            </p>
            
            <p className="text-xs text-gray-400 max-w-xs mx-auto italic mb-10">
                Clicca sul link presente nell'email per accedere automaticamente. Questa pagina si aggiornerà da sola.
            </p>

            <Link href="/admin/login" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Torna indietro
            </Link>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F5E6D3]/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E8D5C4]/20 rounded-full blur-[80px]" />

            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-white relative z-10">
                <Suspense fallback={
                    <div className="text-center py-12">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-400 font-light">Caricamento...</p>
                    </div>
                }>
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}
