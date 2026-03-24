'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function VerifyContent() {
    const searchParams = useSearchParams();
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') || 'magiclink';
    const emailFromUrl = searchParams.get('email') || '';

    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState(emailFromUrl);

    // Se c'è un token_hash, mostriamo il pulsante di accesso automatico
    if (tokenHash) {
        const handleVerifyHash = async () => {
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
                    throw new Error(data.error || 'Errore di verifica del link salvato.');
                }

                window.location.href = '/admin';
            } catch (err: any) {
                setError(err.message);
                setRedirecting(false);
            }
        };

        return (
            <div className="text-center">
                <h1 className="text-2xl font-serif mb-6 text-gray-900">Accesso Sicuro</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                <p className="mb-6 text-gray-600 text-sm">
                    Clicca sul pulsante sottostante per completare l'accesso in modo sicuro.
                </p>
                <Button onClick={handleVerifyHash} className="w-full h-12 text-base rounded-xl" disabled={redirecting}>
                    {redirecting ? 'Accesso in corso...' : 'Completa l\'Accesso'}
                </Button>
            </div>
        );
    }

    // Altrimenti, mostriamo l'inserimento manuale del PIN a 6 cifre
    const handleVerifyPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setRedirecting(true);
        setError('');
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Codice non valido o scaduto.');
            }

            window.location.href = '/admin';
        } catch (err: any) {
            setError(err.message);
            setRedirecting(false);
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-2xl font-serif mb-2 text-gray-900">Inserisci il Codice</h1>
            <p className="mb-6 text-gray-600 text-sm">
                Ti abbiamo inviato un codice a 6 cifre via email all'indirizzo {emailFromUrl ? <strong>{emailFromUrl}</strong> : 'indicato'}.
            </p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
                {!emailFromUrl && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="h-12 text-base rounded-lg"
                        />
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Codice di 6 cifre</label>
                    <Input
                        type="text"
                        required
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        placeholder="123456"
                        className="h-14 text-2xl text-center tracking-[0.5em] font-mono rounded-lg"
                        maxLength={6}
                    />
                </div>
                <Button type="submit" className="w-full h-12 text-base rounded-xl mt-2" disabled={redirecting}>
                    {redirecting ? 'Verifica in corso...' : 'Verifica Autenticazione'}
                </Button>
            </form>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
                <Suspense fallback={<div className="text-center text-gray-500 py-8">Caricamento...</div>}>
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}
