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
    const [startX, setStartX] = useState<number | null>(null);

    if (images.length === 0) return null;

    const prev = () => setActive(i => (i - 1 + images.length) % images.length);
    const next = () => setActive(i => (i + 1) % images.length);

    const handleTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (startX === null) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
        setStartX(null);
    };

    return (
        <div className="w-full flex flex-col gap-3 lg:gap-4 select-none">
            {/* Main Image Slider */}
            <div 
                className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-[#f8f7f5] overflow-hidden md:rounded-2xl shadow-sm"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Images Container */}
                <div 
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${active * 100}%)` }}
                >
                    {images.map((url, i) => (
                        <div key={i} className="relative w-full h-full flex-shrink-0">
                            <Image
                                src={url}
                                alt={`${title} - view ${i + 1}`}
                                fill
                                className="object-cover"
                                priority={i === 0}
                                unoptimized
                            />
                        </div>
                    ))}
                </div>

                {/* Prev/Next Desktop Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full p-3 shadow-md transition-transform active:scale-95 hidden md:flex"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md rounded-full p-3 shadow-md transition-transform active:scale-95 hidden md:flex"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                        </button>
                        
                        {/* Mobile & Desktop Dots inside the image */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'bg-white w-6 opacity-100' : 'bg-white/60 w-1.5 hover:bg-white/80'}`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Desktop Thumbnail Strip */}
            {images.length > 1 && (
                <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {images.map((url, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden transition-all duration-300 ${i === active ? 'ring-2 ring-gray-900 shadow-md opacity-100' : 'opacity-50 hover:opacity-100 ring-1 ring-gray-200'}`}
                        >
                            <Image 
                                src={url} 
                                alt={`Thumbnail ${i + 1}`} 
                                fill 
                                className="object-cover" 
                                unoptimized 
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
