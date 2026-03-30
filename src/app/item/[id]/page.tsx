import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Facebook, Instagram, Truck } from 'lucide-react';
import { Item } from '@/types/item';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ImageGallery } from '@/components/image-gallery';
import { ShareButton } from '@/components/share-button';
import { ItemCard } from '@/components/item-card';
import { ContactForm } from '@/components/contact-form';

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zeselection.ch';

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
        <div className="min-h-screen bg-white md:bg-[#faf9f7] pb-24">
            {/* Desktop split layout */}
            <div className="max-w-7xl mx-auto lg:px-8 py-0 md:py-12">
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 bg-white overflow-hidden md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
                    
                    {/* Image Gallery Column (Mobile Full Bleed) */}
                    <div className="w-full lg:sticky lg:top-0 lg:self-start bg-[#f8f7f5] relative">
                        {/* Mobile back button overlay */}
                        <div className="absolute top-4 left-4 z-20 md:hidden">
                            <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-md rounded-full text-gray-900 shadow-md">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </div>
                        <ImageGallery images={allImages} title={title} />
                    </div>

                    {/* Content Column (Mobile Padded) */}
                    <div className="px-5 py-8 md:px-10 lg:px-12 md:py-12 flex flex-col justify-center">
                        
                        {/* Desktop Back Button */}
                        <Link href="/" className="hidden md:inline-flex items-center text-gray-400 hover:text-gray-900 mb-8 transition-colors text-xs font-semibold tracking-widest uppercase gap-2 self-start">
                            <ArrowLeft className="w-4 h-4" />
                            {t.back}
                        </Link>

                        {/* Title & Category & Price */}
                        <div className="mb-8">
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mb-4">
                                <span className="text-[11px] tracking-[0.2em] text-gray-400 uppercase font-medium">{category}</span>
                                <span className="hidden sm:block text-[11px] text-gray-300">•</span>
                                <span className="text-[11px] tracking-[0.2em] text-gray-400 uppercase font-medium">
                                    {t.reference} ZE-{typedItem.id.slice(0, 6).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 leading-[1.15] mb-4">
                                {title}
                            </h1>
                            <p className="text-2xl font-light text-gray-900 tracking-wide">
                                {priceFormatted}
                            </p>
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="prose prose-gray max-w-none">
                                <p className="whitespace-pre-wrap text-gray-600 leading-relaxed text-[15px] sm:text-base font-light">
                                    {description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Contact & Shipping Notes Section (Full Width on Desktop) */}
                    <div className="lg:col-span-2 px-5 py-10 md:px-10 lg:px-16 md:py-16 bg-[#faf9f7]/50 border-t border-gray-100">
                        <div className="max-w-3xl mx-auto">
                            {/* Call to Action Pre-text */}
                            {!typedItem.is_sold && (
                                <div className="mb-8 text-center">
                                    <h3 className="text-lg font-serif font-medium text-gray-900 tracking-wide mb-3">
                                        {lang === 'it' ? 'Ti interessa questo articolo?' : lang === 'en' ? 'Interested in this item?' : lang === 'fr' ? 'Cet article vous intéresse ?' : 'Interessiert an diesem Artikel?'}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-xl mx-auto">
                                        {lang === 'it' ? 'Contattaci senza impegno per maggiori informazioni o per procedere all\'acquisto.' : lang === 'en' ? 'Contact us without obligation for more information or to proceed with the purchase.' : lang === 'fr' ? 'Contactez-nous sans engagement pour plus d\'informations ou pour procéder à l\'achat.' : 'Kontaktieren Sie uns unverbindlich für weitere Informationen oder um mit dem Kauf fortzufahren.'}
                                    </p>
                                </div>
                            )}

                            {/* Sold banner or CTA Actions */}
                            {typedItem.is_sold ? (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="text-center py-5 bg-gray-100 text-gray-500 font-medium rounded-xl border border-gray-200 text-sm tracking-wide uppercase">
                                        {t.soldOutMessage}
                                    </div>
                                    {/* Social Share Row */}
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/item/${typedItem.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-[54px] bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium gap-2 text-sm">
                                            <Facebook className="w-4 h-4 text-[#1877F2] shrink-0" />
                                            <span className="hidden sm:inline">Facebook</span>
                                        </a>
                                        <a href="https://instagram.com/zeselection" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-[54px] bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium gap-2 text-sm">
                                            <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                                            <span className="hidden sm:inline">Instagram</span>
                                        </a>
                                        <div className="[&>button]:!w-full [&>button]:!h-[54px] [&>button]:!px-2 [&>button]:!py-0">
                                            <ShareButton 
                                                title={title}
                                                text={description}
                                                url={`${baseUrl}/item/${typedItem.id}`}
                                                label={t.share}
                                                copiedLabel=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-8 w-full">
                                    {/* Primary WhatsApp Contact */}
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center h-[60px] px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 gap-3 text-lg"
                                    >
                                        <MessageCircle className="w-6 h-6 text-white shrink-0" />
                                        <span>{t.whatsapp}</span>
                                    </a>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-100"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-300 font-medium">
                                            <span className="bg-[#faf9f7] px-4">{lang === 'it' ? 'Oppure scrivici' : lang === 'en' ? 'Or write to us' : lang === 'fr' ? 'Ou écrivez-nous' : 'Oder schreiben Sie uns'}</span>
                                        </div>
                                    </div>

                                    {/* Detailed Email Contact Form */}
                                    <ContactForm itemId={typedItem.id} t={t} />
                                    
                                    {/* Social Share Row */}
                                    <div className="grid grid-cols-3 gap-3 w-full">
                                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/item/${typedItem.id}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-[54px] bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium gap-2 text-sm">
                                            <Facebook className="w-4 h-4 text-[#1877F2] shrink-0" />
                                            <span className="hidden sm:inline">Facebook</span>
                                        </a>
                                        <a href="https://instagram.com/zeselection" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-[54px] bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-xl transition-all shadow-sm font-medium gap-2 text-sm">
                                            <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                                            <span className="hidden sm:inline">Instagram</span>
                                        </a>
                                        <div className="[&>button]:!w-full [&>button]:!h-[54px] [&>button]:!px-2 [&>button]:!py-0">
                                            <ShareButton 
                                                title={title}
                                                text={description}
                                                url={`${baseUrl}/item/${typedItem.id}`}
                                                label={t.share}
                                                copiedLabel=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Note (at the bottom) */}
                            <div className="mt-12 flex items-start gap-4 p-5 bg-white border border-amber-100 rounded-2xl shadow-sm">
                                <Truck className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                                <p className="text-sm sm:text-base font-normal text-amber-900/80 leading-relaxed text-center w-full">
                                    {t.shippingNote}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Items Section */}
            {relatedItems.length > 0 && (
                <div className="mt-20 md:mt-24 px-5 md:px-0">
                    <div className="border-t border-gray-200 pt-16 max-w-7xl mx-auto px-8">
                        <h2 className="text-2xl font-serif font-medium text-gray-900 mb-8">
                            {lang === 'it' ? 'Potrebbe interessarti anche' : lang === 'en' ? 'You might also like' : lang === 'fr' ? 'Vous aimerez peut-être aussi' : 'Das könnte dir auch gefallen'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                            {relatedItems.map((relatedItem) => (
                                <ItemCard key={relatedItem.id} item={relatedItem} lang={lang} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
