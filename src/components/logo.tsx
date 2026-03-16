interface LogoProps {
    className?: string;
    showSlogan?: boolean;
    inverted?: boolean;
}

export function Logo({ className = '', showSlogan = false, inverted = false }: LogoProps) {
    const textColor = inverted ? 'text-white' : 'text-gray-900';
    const subColor = inverted ? 'text-white/60' : 'text-gray-400';
    const dividerColor = inverted ? 'bg-white/30' : 'bg-gray-300';

    return (
        <div className={`flex flex-col items-start select-none ${className}`}>
            <div className="flex items-baseline gap-0.5">
                <span className={`font-serif font-bold tracking-tight leading-none ${textColor}`}
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    Z<span className="font-normal opacity-70">&amp;</span>E
                </span>
                <div className={`w-px h-4 mx-2 ${dividerColor}`} />
                <span className={`font-sans text-[10px] tracking-[0.3em] uppercase font-medium ${subColor}`}
                    style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.3em' }}>
                    Selection
                </span>
            </div>
            {showSlogan && (
                <span className={`text-[9px] italic font-serif mt-0.5 ${subColor}`}
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif', letterSpacing: '0.05em' }}>
                    Selected by Zuhad &amp; Ema
                </span>
            )}
        </div>
    );
}
