'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function VerifyContent() {
    const [redirecting, setRedirecting] = useState(false);
    const [fullLink, setFullLink] = useState<string | null>(null);

    useEffect(() => {
        // Estraiamo in modo sicuro tutta la parte dell'URL dopo "link=" per evitare 
        // che i parametri & del Magic Link vengano separati da URLSearchParams.
        const search = window.location.search;
        const match = search.match(/link=(.*)/);
        if (match && match[1]) {
            setFullLink(match[1]);
        }
    }, []);

    if (!fullLink) {
        return (
            <div className="text-center">
                <h1 className="text-xl font-bold mb-4">Link non trovato o non valido</h1>
                <p className="text-sm text-gray-600">Assicurati di aver cliccato l'intero link ricevuto via email.</p>
            </div>
        );
    }

    const handleVerify = () => {
        setRedirecting(true);
        window.location.href = fullLink;
    };

    return (
        <div className="text-center">
            <h1 className="text-2xl font-serif mb-6">Verifica Sicura Auth</h1>
            <p className="mb-6 text-gray-600 text-sm">
                Per motivi di sicurezza (ed evitare che gli antivirus email scolleghino il token),
                clicca sul pulsante sottostante per completare l'accesso "Magic Link" automatico.
            </p>
            <Button onClick={handleVerify} className="w-full" disabled={redirecting}>
                {redirecting ? 'Accesso in corso...' : 'Completa l\'Accesso'}
            </Button>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
                <Suspense fallback={<div className="text-center">Caricamento...</div>}>
                    <VerifyContent />
                </Suspense>
            </div>
        </div>
    );
}
