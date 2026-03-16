interface LogoProps {
    className?: string;
    showSlogan?: boolean;
    inverted?: boolean;
}

export function Logo({ className = 'h-14', showSlogan = false, inverted = false }: LogoProps) {
    const gold = inverted ? '#D4A017' : '#B8860B';
    const dark = inverted ? '#FFFFFF' : '#1A1A1A';
    const sloganColor = inverted ? 'rgba(255,255,255,0.65)' : 'rgba(26,26,26,0.5)';

    return (
        <svg
            viewBox="0 0 220 90"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Z&E Selection"
            fill="none"
        >
            <defs>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400&display=swap');
                `}</style>
            </defs>

            {/* ── Monogram Group (left side) ── */}
            <g transform="translate(44, 45)">

                {/* Partial circle arc — heritage feel */}
                <path
                    d="M -26,10 A 28,28 0 1,1 26,10"
                    stroke={gold}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                />

                {/* Left olive branch (stylised) */}
                <g opacity="0.75" stroke={gold} strokeWidth="0.6" fill="none">
                    <path d="M -26,10 Q -32,16 -24,20" />
                    <ellipse cx="-28" cy="13" rx="3" ry="1.6" transform="rotate(-40,-28,13)" fill={gold} stroke="none" opacity="0.6"/>
                    <ellipse cx="-32" cy="16" rx="2.5" ry="1.4" transform="rotate(-55,-32,16)" fill={gold} stroke="none" opacity="0.5"/>
                </g>

                {/* Right olive branch (mirrored) */}
                <g opacity="0.75" stroke={gold} strokeWidth="0.6" fill="none">
                    <path d="M 26,10 Q 32,16 24,20" />
                    <ellipse cx="28" cy="13" rx="3" ry="1.6" transform="rotate(40,28,13)" fill={gold} stroke="none" opacity="0.6"/>
                    <ellipse cx="32" cy="16" rx="2.5" ry="1.4" transform="rotate(55,32,16)" fill={gold} stroke="none" opacity="0.5"/>
                </g>

                {/* Monogram: Z */}
                <text
                    x="-9"
                    y="8"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="22"
                    fontWeight="400"
                    fill={gold}
                    letterSpacing="-1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >Z</text>

                {/* Ampersand divider — thin gold line */}
                <line x1="0" y1="-8" x2="0" y2="8" stroke={gold} strokeWidth="0.6" opacity="0.5"/>

                {/* Monogram: E */}
                <text
                    x="9"
                    y="8"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="22"
                    fontWeight="400"
                    fill={gold}
                    letterSpacing="-1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >E</text>

                {/* Small decorative dot at bottom */}
                <circle cx="0" cy="22" r="1.2" fill={gold} opacity="0.6" />
            </g>

            {/* ── Text Group (right side) ── */}
            <g transform="translate(95, 28)">

                {/* "Z&E" in Playfair Display */}
                <text
                    x="0"
                    y="0"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fontSize="22"
                    fontWeight="700"
                    fill={dark}
                    letterSpacing="1"
                >Z&amp;E</text>

                {/* Thin gold rule between Z&E and SELECTION */}
                <line x1="0" y1="7" x2="98" y2="7" stroke={gold} strokeWidth="0.5" opacity="0.6"/>

                {/* "SELECTION" in Inter / sans-serif */}
                <text
                    x="1"
                    y="20"
                    fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                    fontSize="9.5"
                    fontWeight="300"
                    fill={dark}
                    letterSpacing="5"
                >SELECTION</text>

                {/* Optional slogan */}
                {showSlogan && (
                    <text
                        x="0"
                        y="36"
                        fontFamily="'Playfair Display', Georgia, serif"
                        fontSize="7.5"
                        fontStyle="italic"
                        fill={sloganColor}
                        letterSpacing="0.5"
                    >Selected by Zuhad &amp; Ema</text>
                )}
            </g>
        </svg>
    );
}
