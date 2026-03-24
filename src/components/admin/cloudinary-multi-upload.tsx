'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, Plus } from 'lucide-react';
import Image from 'next/image';

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

    return (
        <div className="space-y-4">
            {/* Primary image */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Foto principale *</p>
                <div className="flex flex-wrap gap-3 items-start">
                    {primaryUrl && (
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <Image src={primaryUrl} alt="Principale" fill className="object-cover" unoptimized />
                        </div>
                    )}
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{ maxFiles: 1, resourceType: 'image', clientAllowedFormats: ['jpeg', 'png', 'webp'] }}
                        onSuccess={(result: any) => { if (result.event === 'success') onPrimaryChange(result.info.secure_url); }}
                    >
                        {({ open }) => (
                            <Button type="button" variant="outline" onClick={() => open()} className="h-28 w-28 flex-col gap-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-500">
                                <UploadCloud className="w-5 h-5" />
                                <span className="text-xs text-center leading-tight">{primaryUrl ? changeLabel : uploadLabel}</span>
                            </Button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>

            {/* Extra images */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Foto aggiuntive</p>
                <div className="flex flex-wrap gap-3 items-start">
                    {extraUrls.map((url, idx) => (
                        <div key={idx} className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                            <Image src={url} alt={`Extra ${idx + 1}`} fill className="object-cover" unoptimized />
                            <button
                                type="button"
                                onClick={() => removeExtra(idx)}
                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        options={{ maxFiles: 10, resourceType: 'image', clientAllowedFormats: ['jpeg', 'png', 'webp'], multiple: true }}
                        onSuccess={(result: any) => { if (result.event === 'success') addExtra(result.info.secure_url); }}
                    >
                        {({ open }) => (
                            <Button type="button" variant="outline" onClick={() => open()} className="h-28 w-28 flex-col gap-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-500">
                                <Plus className="w-5 h-5" />
                                <span className="text-xs text-center leading-tight">{addLabel}</span>
                            </Button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>
        </div>
    );
}
