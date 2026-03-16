'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const supabase = createClient();

    // Leggi l'errore dall'URL se presente (iniettato dalla callback)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlError = params.get('error');
        if (urlError) setError(urlError);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/admin/callback`,
                },
            });

            if (error) throw error;
            setMessage('Controlla la tua email per il Magic Link!');
        } catch (err: any) {
            setError(err.message || 'Errore durante il login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-serif mb-6 text-center">Accesso Area Riservata</h1>
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
                {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">{message}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@zeselection.com"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Invio in corso...' : 'Invia Magic Link'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
