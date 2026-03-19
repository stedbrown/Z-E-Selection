'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { ItemCard } from '@/components/item-card';
import { Item } from '@/types/item';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

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
        loadMore: string;
    };
}

const PAGE_SIZE = 12;

export function ItemGrid({ items: initialItems, categories, categoryLabels, lang, t }: ItemGridProps) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialItems.length >= PAGE_SIZE);
    const [offset, setOffset] = useState(0);

    const supabase = createClient();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Reset items when initialItems change (prop sync)
    useEffect(() => {
        setItems(initialItems);
        setOffset(0);
        setHasMore(initialItems.length >= PAGE_SIZE);
    }, [initialItems]);

    // Handle URL param changes (Search and Category)
    useEffect(() => {
        const query = searchParams.get('q') || '';
        const cat = searchParams.get('cat') || '';
        
        if (query !== search || cat !== activeCategory) {
            setSearch(query);
            setActiveCategory(cat);
            performFullSearch(query, cat);
        }
    }, [searchParams]);

    const performFullSearch = async (q: string, cat: string) => {
        setLoading(true);
        setOffset(0);

        try {
            let query = supabase
                .from('items')
                .select('*')
                .eq('is_sold', false)
                .order('created_at', { ascending: false })
                .range(0, PAGE_SIZE - 1);
            
            if (cat) {
                // Use case-insensitive match for category to avoid "Pietra" vs "pietra" issues
                query = query.ilike('category', cat);
            }

            if (q) {
                // Search in title/description (simplified)
                query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
            }

            const { data } = await query;
            if (data) {
                setItems(data);
                setHasMore(data.length >= PAGE_SIZE);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat: string) => {
        const newCat = cat === activeCategory ? '' : cat;
        const params = new URLSearchParams(searchParams.toString());
        if (newCat) {
            params.set('cat', newCat);
        } else {
            params.delete('cat');
        }
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextOffset = offset + PAGE_SIZE;

        try {
            let query = supabase
                .from('items')
                .select('*')
                .eq('is_sold', false)
                .order('created_at', { ascending: false })
                .range(nextOffset, nextOffset + PAGE_SIZE - 1);
            
            if (activeCategory) {
                query = query.ilike('category', activeCategory);
            }

            if (search) {
                query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
            }

            const { data } = await query;
            if (data && data.length > 0) {
                setItems(prev => [...prev, ...data]);
                setOffset(nextOffset);
                setHasMore(data.length >= PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const filtered = items;

    if (initialItems.length === 0 && !activeCategory) {
        return (
            <div className="text-center py-24 text-gray-500">
                <p className="text-xl font-serif">{t.empty}</p>
            </div>
        );
    }

    return (
        <div>

            {/* Category Pills — horizontal scroll strip */}
            <div className="relative mb-10">
                <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent pointer-events-none z-10" />
                <div
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <button
                        onClick={() => handleCategoryChange('')}
                        disabled={loading}
                        className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all border ${!activeCategory
                            ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gold/50'
                        } disabled:opacity-50`}
                    >
                        {t.allCategories}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            disabled={loading}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium capitalize transition-all border ${activeCategory === cat
                                ? 'bg-gold text-white border-gold shadow-lg shadow-gold/20'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gold/50'
                            } disabled:opacity-50`}
                        >
                            {categoryLabels[cat] || cat}
                        </button>
                    ))}
                    <div className="flex-shrink-0 w-8" />
                </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    {loading ? (
                        <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-gold/40" />
                    ) : (
                        <Search className="w-10 h-10 mx-auto mb-4 opacity-40" />
                    )}
                    <p className="text-lg font-serif">{loading ? '...' : t.noResults}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {filtered.map(item => (
                            <ItemCard key={item.id} item={item} lang={lang} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="mt-20 flex justify-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-10 py-3 border border-gold/30 text-gold-dark rounded-full font-medium hover:bg-gold/5 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {t.loadMore}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
