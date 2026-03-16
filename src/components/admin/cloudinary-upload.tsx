'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';

interface CloudinaryUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export function CloudinaryUpload({ value, onChange }: CloudinaryUploadProps) {
    const onUpload = (result: any) => {
        if (result.event === 'success') {
            onChange(result.info.secure_url);
        }
    };

    return (
        <div className="flex flex-col items-start gap-4">
            {value && (
                <div className="relative w-full max-w-[12rem] aspect-square rounded-md overflow-hidden border border-gray-200">
                    <Image
                        src={value}
                        alt="Upload"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            )}
            <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{
                    maxFiles: 1,
                    resourceType: 'image',
                    clientAllowedFormats: ['jpeg', 'png', 'webp'],
                    cropping: true,
                    showSkipCropButton: false,
                    croppingAspectRatio: 1 // Force square aspect ratio
                }}
                onSuccess={onUpload}
            >
                {({ open }) => (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="flex items-center gap-2"
                    >
                        <UploadCloud className="w-5 h-5" />
                        {value ? 'Cambia Immagine' : 'Carica Immagine'}
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    );
}
