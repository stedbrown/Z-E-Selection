'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { ItemCard } from '@/components/item-card';
import { Item } from '@/types/item';

interface ItemGridProps {
    items: Item[];
    categories: string[];
    /** Map from original (IT) category name → translated label for the current lang */
    categoryLabels: Record<string, string>;
    lang: 'it' | 'en' | 'fr' | 'de';
    t: {
        searchPlaceholder: string;
        allCategories: string;
        noResults: string;
        empty: string;
    };
}

export function ItemGrid({ items, categories, categoryLabels, lang, t }: ItemGridProps) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');

    const filtered = useMemo(() => {
        return items.filter(item => {
            const title = lang === 'it' ? item.title : (item.translations?.[lang]?.title || item.title);
            const cat = lang === 'it' ? item.category : (item.translations?.[lang]?.category || item.category);
            const matchesSearch = !search || title.toLowerCase().includes(search.toLowerCase());
            const matchesCat = !activeCategory || item.category === activeCategory;
            return matchesSearch && matchesCat;
        });
    }, [items, search, activeCategory, lang]);

    if (items.length === 0) {
        return (
            <div className="text-center py-24 text-gray-500">
                <p className="text-xl font-serif">{t.empty}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition shadow-sm"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Pills — horizontal scroll strip */}
            <div className="relative mb-10">
                {/* Fade-out gradient on the right to hint at scrollability */}
                <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent pointer-events-none z-10" />
                <div
                    className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <button
                        onClick={() => setActiveCategory('')}
                        className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all border ${!activeCategory
                            ? 'bg-gray-900 text-white border-gray-900 shadow'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        {t.allCategories}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium capitalize transition-all border ${activeCategory === cat
                                ? 'bg-gray-900 text-white border-gray-900 shadow'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            {categoryLabels[cat] || cat}
                        </button>
                    ))}
                    {/* Right spacer so last pill clears the fade */}
                    <div className="flex-shrink-0 w-8" />
                </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    <Search className="w-10 h-10 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-serif">{t.noResults}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {filtered.map(item => (
                        <ItemCard key={item.id} item={item} lang={lang} />
                    ))}
                </div>
            )}
        </div>
    );
}
