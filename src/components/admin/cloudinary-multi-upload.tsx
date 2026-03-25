'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Plus } from 'lucide-react';
import Image from 'next/image';

type CldSource = 'local' | 'camera' | 'url' | 'dropbox' | 'google_drive';
const WIDGET_SOURCES: CldSource[] = ['local', 'camera'];

// Re-enable body scroll whenever the widget closes (with or without upload)
const restoreScroll = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
};

interface CloudinaryMultiUploadProps {
    /** Primary image URL */
    primaryUrl: string;
    onPrimaryChange: (url: string) => void;
    /** Extra images */
    extraUrls: string[];
    onExtraChange: (urls: string[]) => void;
    uploadLabel?: string;
    changeLabel?: string;
    addLabel?: string;
}

export function CloudinaryMultiUpload({
    primaryUrl,
    onPrimaryChange,
    extraUrls,
    onExtraChange,
    uploadLabel = 'Tocca per caricare (Principale)',
    changeLabel = 'Cambia foto',
    addLabel = 'Tocca per aggiungere',
}: CloudinaryMultiUploadProps) {
    const addExtra = (url: string) => {
        onExtraChange([...extraUrls, url]);
    };

    const removeExtra = (idx: number) => {
        onExtraChange(extraUrls.filter((_, i) => i !== idx));
    };

    const primaryOptions = {
        maxFiles: 1,
        resourceType: 'image' as const,
        clientAllowedFormats: ['jpeg', 'png', 'webp', 'heic'],
        sources: WIDGET_SOURCES,
    };

    const extraOptions = {
        maxFiles: 10,
        resourceType: 'image' as const,
        clientAllowedFormats: ['jpeg', 'png', 'webp', 'heic'],
        multiple: true,
        sources: WIDGET_SOURCES,
    };

    return (
        <div className="space-y-6">
            {/* Primary image */}
            <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-800 tracking-wide">Foto Principale *</p>
                <div className="w-full">
                    {primaryUrl ? (
                        <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                            <Image src={primaryUrl} alt="Principale" fill className="object-cover" unoptimized />
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={primaryOptions}
                                onSuccess={(result: any) => {
                                    if (result.event === 'success') {
                                        restoreScroll();
                                        onPrimaryChange(result.info.secure_url);
                                    }
                                }}
                                onClose={restoreScroll}
                            >
                                {({ open }) => (
                                    <div className="absolute inset-0 bg-black/40 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button type="button" variant="outline" onClick={() => open()} className="gap-2 h-12 px-6 rounded-full font-medium shadow-xl">
                                            <UploadCloud className="w-5 h-5" />
                                            {changeLabel}
                                        </Button>
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>
                    ) : (
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            options={primaryOptions}
                            onSuccess={(result: any) => {
                                if (result.event === 'success') {
                                    restoreScroll();
                                    onPrimaryChange(result.info.secure_url);
                                }
                            }}
                            onClose={restoreScroll}
                        >
                            {({ open }) => (
                                <button type="button" onClick={() => open()} className="w-full h-72 sm:h-96 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors active:scale-[0.98]">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                        <UploadCloud className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-base font-medium text-gray-700">{uploadLabel}</p>
                                        <p className="text-sm text-gray-500 mt-1">Immagine copertina (obbligatoria)</p>
                                    </div>
                                </button>
                            )}
                        </CldUploadWidget>
                    )}
                </div>
            </div>

            {/* Extra images */}
            <div className="flex flex-col gap-3 pt-2">
                <p className="text-sm font-semibold text-gray-800 tracking-wide">Dettagli Aggiuntivi</p>
                <div className="flex items-start gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {extraUrls.map((url, idx) => (
                        <div key={idx} className="relative flex-shrink-0 w-32 h-32 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm group snap-start">
                            <Image src={url} alt={`Extra ${idx + 1}`} fill className="object-cover" unoptimized />
                            <button
                                type="button"
                                onClick={() => removeExtra(idx)}
                                className="absolute top-2 right-2 sm:top-1 sm:right-1 bg-black/60 text-white rounded-full p-1.5 sm:p-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                            >
                                <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    ))}
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={extraOptions}
                        onSuccess={(result: any) => {
                            if (result.event === 'success') {
                                restoreScroll();
                                addExtra(result.info.secure_url);
                            }
                        }}
                        onClose={restoreScroll}
                    >
                        {({ open }) => (
                            <button type="button" onClick={() => open()} className="flex-shrink-0 w-32 h-32 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-700 transition-colors snap-start active:scale-95">
                                <Plus className="w-6 h-6" />
                                <span className="text-xs font-medium px-2 text-center">{addLabel}</span>
                            </button>
                        )}
                    </CldUploadWidget>
                </div>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}
