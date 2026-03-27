'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [active, setActive] = useState(0);
    const [startX, setStartX] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

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
                        <div 
                            key={i} 
                            className="relative w-full h-full flex-shrink-0 cursor-zoom-in"
                            onClick={() => setIsFullscreen(true)}
                        >
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

            {/* Fullscreen Lightbox Overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center select-none backdrop-blur-md">
                    {/* Header / Actions */}
                    <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50">
                        <span className="text-white/70 text-sm font-medium tracking-[0.2em] uppercase pl-2">
                            {active + 1} <span className="text-white/40 mx-1">/</span> {images.length}
                        </span>
                        <button 
                            onClick={() => setIsFullscreen(false)}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Fullscreen Image Area */}
                    <div 
                        className="relative w-full h-[75vh] sm:h-[80vh] flex items-center justify-center"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={images[active]}
                            alt={`${title} - fullscreen view ${active + 1}`}
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />

                        {/* Desktop Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prev(); }}
                                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 md:p-4 transition-colors hidden sm:block"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); next(); }}
                                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 md:p-4 transition-colors hidden sm:block"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Thumbnails on Fullscreen */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 md:bottom-8 max-w-full px-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {images.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden transition-all duration-300 ${i === active ? 'ring-2 ring-white opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    <Image src={url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" unoptimized />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
