import Image from 'next/image';
import Link from 'next/link';
import { Item } from '@/types/item';

interface ItemCardProps {
    item: Item;
    lang: 'it' | 'en' | 'fr' | 'de';
}

export function ItemCard({ item, lang }: ItemCardProps) {
    const title = lang === 'it' ? item.title : (item.translations?.[lang]?.title || item.title);
    const category = lang === 'it' ? item.category : (item.translations?.[lang]?.category || item.category);
    const priceFormatted = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: 'CHF' }).format(item.price);
    const soldLabel = lang === 'en' ? 'Sold' : lang === 'fr' ? 'Vendu' : lang === 'de' ? 'Verkauft' : 'Venduto';

    return (
        <Link href={`/item/${item.id}`} className="group block">
            {/* Image Container */}
            <div className={`relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-xl bg-[#F3EFE6]/60 ${item.is_sold ? 'opacity-60' : ''}`}>
                <Image
                    src={item.image_url}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full capitalize shadow-sm">
                    {category}
                </span>

                {/* Sold Overlay */}
                {item.is_sold && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <span className="bg-[#8b0000]/90 text-white px-5 py-2 font-bold tracking-widest text-xs rounded-full uppercase shadow-lg">
                            {soldLabel}
                        </span>
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="mt-3 px-1">
                <h3 className="text-sm sm:text-base font-serif font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gray-800">{priceFormatted}</p>
            </div>
        </Link>
    );
}
