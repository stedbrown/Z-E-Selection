'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, LayoutGrid, Loader2, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';

interface Category {
    name: string;
    slug: string;
    translations?: Record<string, any>;
}

interface HeaderProps {
    lang: string;
    categories: Category[];
    t: {
        search: string;
        categories: string;
        allCategories: string;
        about: string;
    };
    categoryLabels: Record<string, string>;
}

export function Header({ lang, categories, t, categoryLabels }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const categoriesRef = useRef<HTMLDivElement>(null);
    
    const isAdmin = pathname?.startsWith('/admin');

    // Initial search value from URL
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) setSearchValue(query);
        else setSearchValue('');
    }, [searchParams]);

    // Debounced URL Update for Instant Search
    useEffect(() => {
        if (!searchValue && !searchParams.get('q')) return;

        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const currentQuery = params.get('q') || '';
            
            if (searchValue !== currentQuery) {
                if (searchValue) params.set('q', searchValue);
                else params.delete('q');
                
                // If not on home, redirect to home with the search param
                const target = `/?${params.toString()}`;
                router.push(target);
                setIsSearching(true);
                // Reset searching state after a short delay
                setTimeout(() => setIsSearching(false), 800);
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [searchValue]);

    // Close menus on resize to desktop to avoid stuck scrolling or ghost overlays
    // Using matchMedia for perfect sync with Tailwind 'lg' (1024px)
    useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)');
        const handleMatchChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setIsMenuOpen(false);
                setIsSearchOpen(false);
            }
        };
        
        // Initial check
        handleMatchChange(mql);
        
        mql.addEventListener('change', handleMatchChange);
        return () => mql.removeEventListener('change', handleMatchChange);
    }, []);

    // Toggle body scroll when menu is open — with scrollbar-width compensation to prevent layout shift on desktop
    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarW}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isMenuOpen, isSearchOpen]);

    // Close categories dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
                setIsCategoriesOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isAdmin) {
        return (
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm flex items-center select-none">
                <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <Link href="/admin" className="hover:opacity-80 transition-opacity">
                        <Logo className="text-2xl sm:text-3xl text-gray-900" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/" 
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Torna al Catalogo</span>
                            <span className="sm:hidden">Catalogo</span>
                        </Link>
                        <form action="/api/admin/logout" method="POST">
                            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-full transition-colors active:scale-95">
                                Esci
                            </button>
                        </form>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="glass-header sticky top-0 z-50 select-none cursor-default">
            <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer select-none">
                    <Logo className="text-2xl sm:text-3xl" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center flex-1 justify-center gap-6">
                    {/* Browse Categories Dropdown */}
                    <div className="relative" ref={categoriesRef}>
                        <button
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer select-none ${
                                isCategoriesOpen ? 'bg-gold text-white' : 'hover:bg-gold/10 text-gray-700'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            {t.categories}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoriesOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 gap-1">
                                    <Link
                                        href="/"
                                        onClick={() => setIsCategoriesOpen(false)}
                                        className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gold/10 hover:text-gold transition-all duration-300 cursor-pointer select-none"
                                    >
                                        {t.allCategories}
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={`/category/${cat.slug}`}
                                            onClick={() => setIsCategoriesOpen(false)}
                                            className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gold/10 hover:text-gold transition-all duration-300 capitalize cursor-pointer select-none"
                                        >
                                            {categoryLabels[cat.name] || cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Bar Desktop */}
                    <form onSubmit={(e) => e.preventDefault()} className="relative flex-1 max-w-md group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchValue ? 'text-gold' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t.search}
                            className="w-full pl-11 pr-10 py-2.5 bg-gray-100/50 border border-transparent rounded-full text-sm focus:bg-white focus:border-gold/30 focus:ring-4 focus:ring-gold/5 outline-none transition-all cursor-text"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isSearching ? (
                                <Loader2 className="w-4 h-4 text-gold animate-spin" />
                            ) : searchValue && (
                                <button 
                                    type="button"
                                    onClick={() => setSearchValue('')}
                                    className="p-1 text-gray-400 hover:text-gold transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <Link 
                        href="/about" 
                        className="hidden lg:block nav-link text-sm font-medium text-gray-600 hover:text-gold"
                    >
                        {t.about}
                    </Link>
                    <div className="hidden lg:block h-4 w-px bg-gray-200" />
                    <LanguageSwitcher currentLang={lang} />
                    
                    {/* Mobile Search & Menu Toggles */}
                    <div className="flex lg:hidden items-center gap-2">
                        <button 
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                setIsMenuOpen(false);
                            }}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative cursor-pointer"
                        >
                            <Search className="w-5 h-5" />
                            {searchValue && <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border-2 border-white" />}
                        </button>
                        <button 
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen);
                                setIsSearchOpen(false);
                            }}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="lg:hidden fixed inset-x-0 top-0 h-20 bg-white z-[60] flex items-center px-4 shadow-lg border-b border-gray-100">
                    <form onSubmit={(e) => e.preventDefault()} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                        <input
                            autoFocus
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t.search}
                            className="w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-xl text-base focus:ring-0 outline-none cursor-text"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            {isSearching && <Loader2 className="w-5 h-5 text-gold animate-spin" />}
                            {searchValue && !isSearching && (
                                <button 
                                    type="button"
                                    onClick={() => setSearchValue('')}
                                    className="p-1 text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="p-1 text-gray-400 border-l border-gray-200 pl-3"
                            >
                                {lang === 'it' ? 'Chiudi' : 'Close'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden fixed top-20 left-0 right-0 h-[calc(100vh-80px)] bg-white z-[55] border-t border-gray-100 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-4">{t.categories}</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 text-gray-800 font-medium"
                                >
                                    <LayoutGrid className="w-5 h-5 text-gold" />
                                    {t.allCategories}
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href={`/category/${cat.slug}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 text-gray-800 font-medium capitalize cursor-pointer select-none active:scale-95 transition-transform"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-gold" />
                                        {categoryLabels[cat.name] || cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gold mb-4">Navigazione</h3>
                            <Link
                                href="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 text-gray-700 font-medium"
                            >
                                {t.about}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
