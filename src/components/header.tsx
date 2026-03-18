'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Menu, X, ChevronDown, LayoutGrid } from 'lucide-react';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';

interface Category {
    name: string;
    translations?: Record<string, any>;
}

interface HeaderProps {
    lang: string;
    categories: Category[];
    t: {
        search: string;
        categories: string;
        about: string;
    };
    categoryLabels: Record<string, string>;
}

export function Header({ lang, categories, t, categoryLabels }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoriesRef = useRef<HTMLDivElement>(null);

    // Initial search value from URL
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) setSearchValue(query);
    }, [searchParams]);

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set('q', searchValue);
        } else {
            params.delete('q');
        }
        router.push(`/?${params.toString()}`);
        setIsSearchOpen(false);
    };

    return (
        <header className="glass-header sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
                    <Logo className="text-2xl sm:text-3xl" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center flex-1 justify-center gap-6">
                    {/* Browse Categories Dropdown */}
                    <div className="relative" ref={categoriesRef}>
                        <button
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
                                        className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gold/10 hover:text-gold transition-colors"
                                    >
                                        {lang === 'it' ? 'Tutte le categorie' : 'All Categories'}
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.name}
                                            href={`/?cat=${encodeURIComponent(cat.name)}`}
                                            onClick={() => setIsCategoriesOpen(false)}
                                            className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gold/10 hover:text-gold transition-colors capitalize"
                                        >
                                            {categoryLabels[cat.name] || cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search Bar Desktop */}
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t.search}
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 border border-transparent rounded-full text-sm focus:bg-white focus:border-gold/30 focus:ring-4 focus:ring-gold/5 outline-none transition-all"
                        />
                    </form>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <Link 
                        href="/about" 
                        className="hidden md:block nav-link text-sm font-medium text-gray-600 hover:text-gold"
                    >
                        {t.about}
                    </Link>
                    <div className="hidden md:block h-4 w-px bg-gray-200" />
                    <LanguageSwitcher currentLang={lang} />
                    
                    {/* Mobile Search & Menu Toggles */}
                    <div className="flex lg:hidden items-center gap-2">
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="lg:hidden absolute inset-x-0 top-0 h-20 bg-white z-50 flex items-center px-4 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t.search}
                            className="w-full pl-12 pr-10 py-3 bg-gray-100 border-none rounded-xl text-base focus:ring-0 outline-none"
                        />
                        <button 
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-lg z-40 border-t border-gray-100 animate-in slide-in-from-right duration-300 flex flex-col">
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
                                    {lang === 'it' ? 'Tutte le categorie' : 'All Categories'}
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.name}
                                        href={`/?cat=${encodeURIComponent(cat.name)}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-4 rounded-2xl border border-gray-100 text-gray-700 capitalize flex items-center justify-between"
                                    >
                                        {categoryLabels[cat.name] || cat.name}
                                        <ChevronDown className="-rotate-90 w-4 h-4 text-gray-300" />
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
