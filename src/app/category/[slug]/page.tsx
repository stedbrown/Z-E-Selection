import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ItemGrid } from '@/components/item-grid';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from('categories').select('name, translations').eq('slug', slug).single();

  if (!category) return {};

  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  
  let translatedName = category.name;
  if (lang !== 'it' && category.translations && category.translations[lang]) {
    translatedName = category.translations[lang];
  }

  const title = `${translatedName} | Z&E Selection`;
  const description = `Scopri la nostra selezione di articoli per la categoria ${translatedName}. Antiquariato e usato di qualità.`;
  const url = `https://www.zeselection.com/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Z&E Selection',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('name, translations')
    .eq('slug', slug)
    .single();

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-32 text-center text-gray-500">
        <h1 className="text-2xl font-serif">Category not found</h1>
        <Link href="/" className="mt-4 text-gold hover:underline">Return to Home</Link>
      </div>
    );
  }

  const [
    { data: items }, 
    { data: categories }
  ] = await Promise.all([
    supabase.from('items').select('*').eq('is_sold', false).ilike('category', category.name).order('created_at', { ascending: false }).range(0, 11),
    supabase.from('categories').select('name, translations, slug').order('name', { ascending: true })
  ]);

  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  const dict = getDictionary(lang);
  const t = dict.home;

  const categoryNames = (categories || []).map((c: { name: string }) => c.name);
  const categorySlugs: Record<string, string> = {};
  for (const cat of (categories || [])) {
    categorySlugs[cat.name] = (cat as any).slug;
  }
  const categoryLabels: Record<string, string> = {};
  if (lang !== 'it') {
    for (const cat of (categories || [])) {
      const translated = (cat as any).translations?.[lang];
      if (translated) categoryLabels[cat.name] = translated;
    }
  }

  const currentCategoryLabel = categoryLabels[category.name] || category.name;

  return (
    <div>
      {/* ── Category Hero ── */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-gray-900">
        <Image
          src="/hero-antiques.png"
          alt={currentCategoryLabel}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/20" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white/70 hover:text-gold mb-6 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium uppercase tracking-widest">{dict.itemDetails.back}</span>
          </Link>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-4 leading-tight capitalize">
            {currentCategoryLabel}
          </h1>
          
          <div className="w-24 h-1 bg-gold rounded-full" />
        </div>
      </section>

      {/* ── Catalogue ── */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ItemGrid
          items={items || []}
          categories={categoryNames}
          categoryLabels={categoryLabels}
          categorySlugs={categorySlugs}
          lang={lang as 'it' | 'en' | 'fr' | 'de'}
          pinnedCategory={category.name}
          t={t}
        />
      </section>
    </div>
  );
}
