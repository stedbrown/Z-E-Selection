'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [active, setActive] = useState(0);

    if (images.length === 0) return null;

    const prev = () => setActive(i => (i - 1 + images.length) % images.length);
    const next = () => setActive(i => (i + 1) % images.length);

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F3EFE6]/60 shadow-sm">
                <Image
                    key={images[active]}
                    src={images[active]}
                    alt={title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                    unoptimized
                />
                {/* Prev/Next arrows — only when multiple images */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow transition"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow transition"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                        {/* Dot indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-white w-4' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail strip — only when multiple images */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {images.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-gray-900 shadow' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <Image src={url} alt={`${title} ${i + 1}`} fill className="object-cover" unoptimized />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
