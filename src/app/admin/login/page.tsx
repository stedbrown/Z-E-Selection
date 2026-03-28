'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const supabase = createClient();

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
                    // Reindirizza al callback per gestire lo scambio del codice PKCE
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
                }
            });

            if (error) throw error;
            
            // Reindirizza l'utente alla pagina di verifica per mostrare lo stato di attesa
            window.location.href = `/admin/verify?email=${encodeURIComponent(email)}`;
        } catch (err: any) {
            setError(err.message || 'Errore durante l\'invio del link.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] p-6 relative overflow-hidden">
            {/* Elementi decorativi di sfondo per un look premium */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F5E6D3]/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E8D5C4]/20 rounded-full blur-[80px]" />

            <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-white relative z-10 transition-all duration-500">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif font-medium text-gray-900 mb-2">Area Riservata</h1>
                    <p className="text-gray-500 font-light">Accedi in modo sicuro al pannello di gestione</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50/50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="mt-0.5">●</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
                            La tua Email
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors duration-300 w-5 h-5" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@zeselection.com"
                                className="pl-12 h-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-black focus:border-black transition-all duration-300 text-base"
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group" 
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Invio link...</span>
                            </div>
                        ) : (
                            <>
                                <span>Invia Magic Link</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-xs text-gray-400 font-light uppercase tracking-[0.2em]">Zuhad e Ema Selection</p>
                </div>
            </div>
        </div>
    );
}
