'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    text: string;
    url: string;
    label: string;
    copiedLabel: string;
}

export function ShareButton({ title, text, url, label, copiedLabel }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Use Web Share API if available (generally mobile devices and Safari)
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: text || title,
                    url,
                });
            } catch (err) {
                // User may have cancelled or share failed, silently ignore but try clipboard fallback if not abort error
                if ((err as Error).name !== 'AbortError') {
                    copyToClipboard();
                }
            }
        } else {
            // Fallback for desktop browsers without Web Share API
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center p-3 sm:px-4 sm:py-2.5 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium gap-2 sm:gap-2.5 text-sm w-12 h-12 sm:w-auto sm:h-auto"
            title={label}
        >
            {copied ? (
                <>
                    <Check className="w-5 h-5 text-green-600 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline text-green-600">{copiedLabel}</span>
                </>
            ) : (
                <>
                    <Share2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{label}</span>
                </>
            )}
        </button>
    );
}
