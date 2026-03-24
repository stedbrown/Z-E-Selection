import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Item } from '@/types/item';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ImageGallery } from '@/components/image-gallery';
import { ShareButton } from '@/components/share-button';
import { ItemCard } from '@/components/item-card';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const id = (await params).id;
    const supabase = await createClient();
    const { data: item } = await supabase.from('items').select('*').eq('id', id).single();

    if (!item) return {};

    const desc = item.description?.substring(0, 160) || `${item.title} — Z&E Selection`;
    const ogImages = [
        { url: item.image_url, width: 1200, height: 630, alt: item.title },
        ...(item.extra_images || []).slice(0, 3).map((url: string) => ({ url, width: 1200, height: 630 })),
    ];

    return {
        title: `${item.title} | Z&E Selection`,
        description: desc,
        openGraph: {
            title: `${item.title} | Z&E Selection`,
            description: desc,
            images: ogImages,
            type: 'website',
            siteName: 'Z&E Selection',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${item.title} | Z&E Selection`,
            description: desc,
            images: [item.image_url],
        },
    };
}

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const supabase = await createClient();

    const { data: item } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

    if (!item) notFound();

    // Increment views (fire and forget on the server)
    supabase.rpc('increment_item_views', { item_id: id }).then();

    const typedItem = item as Item;

    const cookieStore = await cookies();
    const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'it') as 'it' | 'en' | 'fr' | 'de';
    const t = getDictionary(lang).itemDetails;

    const title = lang === 'it' ? typedItem.title : (typedItem.translations?.[lang]?.title || typedItem.title);
    const description = lang === 'it' ? typedItem.description : (typedItem.translations?.[lang]?.description || typedItem.description);
    const category = lang === 'it' ? typedItem.category : (typedItem.translations?.[lang]?.category || typedItem.category);
    const priceFormatted = new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang, { style: 'currency', currency: 'CHF' }).format(typedItem.price);

    const allImages = [typedItem.image_url, ...(typedItem.extra_images || [])].filter(Boolean);

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    let msgStart = "Salve, sono interessato all'articolo";
    if (lang === 'en') msgStart = 'Hi, I am interested in the item';
    if (lang === 'fr') msgStart = "Bonjour, je suis intéressé par l'article";
    if (lang === 'de') msgStart = 'Hallo, ich bin an dem Artikel interessiert';
    const whatsappMessage = encodeURIComponent(`${msgStart} "${typedItem.title}"`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // Fetch related items (same category, excluding current item)
    const { data: relatedItemsData } = await supabase
        .from('items')
        .select('*')
        .eq('category', typedItem.category)
        .neq('id', typedItem.id)
        .limit(4);
    const relatedItems = (relatedItemsData as Item[]) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t.back}
            </Link>

            {/* Title and Category Header (Moved to Top) */}
            <div className="mb-8">
                <span className="text-xs tracking-widest text-gray-400 uppercase mb-3 block">{category}</span>
                <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 leading-tight">
                    {title}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Image Gallery */}
                <ImageGallery images={allImages} title={title} />

                {/* Details Section */}
                <div className="flex flex-col md:sticky md:top-28 self-start">

                    {/* Price */}
                    <p className="text-2xl font-semibold text-gray-900 mb-6">
                        {priceFormatted}
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mb-6" />

                    {/* Description */}
                    {description && (
                        <div className="mb-8">
                            <p className="whitespace-pre-wrap text-gray-600 leading-relaxed text-base">
                                {description}
                            </p>
                        </div>
                    )}

                    {/* Sold banner or WhatsApp CTA */}
                    {typedItem.is_sold ? (
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 text-center py-4 bg-gray-100 text-gray-500 font-medium rounded-xl border border-gray-200 text-sm tracking-wide uppercase">
                                {t.soldOutMessage}
                            </div>
                            <ShareButton 
                                title={title}
                                text={description}
                                url={`https://www.zeselection.ch/item/${typedItem.id}`}
                                label={t.share}
                                copiedLabel={t.copied}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 w-full">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center py-4 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl transition-colors shadow-md gap-3 text-base"
                            >
                                <MessageCircle className="w-5 h-5" />
                                {t.whatsapp}
                            </a>
                            <ShareButton 
                                title={title}
                                text={description}
                                url={`https://www.zeselection.ch/item/${typedItem.id}`}
                                label={t.share}
                                copiedLabel={t.copied}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Related Items Section */}
            {relatedItems.length > 0 && (
                <div className="mt-24 border-t border-gray-100 pt-16">
                    <h2 className="text-2xl font-serif font-medium text-gray-900 mb-8">
                        {lang === 'it' ? 'Potrebbe interessarti anche' : lang === 'en' ? 'You might also like' : lang === 'fr' ? 'Vous aimerez peut-être aussi' : 'Das könnte dir auch gefallen'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                        {relatedItems.map((relatedItem) => (
                            <ItemCard key={relatedItem.id} item={relatedItem} lang={lang} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
