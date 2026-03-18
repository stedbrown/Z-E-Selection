import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ItemGrid } from '@/components/item-grid';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase.from('items').select('*').eq('is_sold', false).order('created_at', { ascending: false }),
    supabase.from('categories').select('name, translations').order('name', { ascending: true })
  ]);

  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  const t = getDictionary(lang).home;

  const categoryNames = (categories || []).map((c: { name: string }) => c.name);

  const categoryLabels: Record<string, string> = {};
  if (lang !== 'it') {
    for (const cat of (categories || [])) {
      const translated = (cat as any).translations?.[lang];
      if (translated) categoryLabels[cat.name] = translated;
    }
  }

  const itemCount = (items || []).length;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-antiques.png"
            alt="Antique coins, collectibles and numismatics"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-cream/60 to-cream/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/50 via-transparent to-cream/50" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-600 mb-5 font-medium drop-shadow-sm">
            {lang === 'en' ? 'Curated Pieces' : lang === 'fr' ? 'Pièces Sélectionnées' : lang === 'de' ? 'Ausgewählte Stücke' : 'Pezzi Selezionati'}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-5 leading-tight tracking-tight drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            {t.subtitle}
          </p>
          {itemCount > 0 && (
            <p className="mt-6 text-sm text-gray-500 font-medium">
              {itemCount} {lang === 'en' ? 'items available' : lang === 'fr' ? 'articles disponibles' : lang === 'de' ? 'Artikel verfügbar' : 'articoli disponibili'}
            </p>
          )}
        </div>
        {/* Decorative divider */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gray-400/50" />
      </section>

      {/* ── Catalogue ── */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ItemGrid
          items={items || []}
          categories={categoryNames}
          categoryLabels={categoryLabels}
          lang={lang as 'it' | 'en' | 'fr' | 'de'}
          t={t}
        />
      </section>
    </div>
  );
}
