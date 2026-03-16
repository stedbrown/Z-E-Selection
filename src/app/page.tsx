import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ItemGrid } from '@/components/item-grid';

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
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-5 font-medium">
            {lang === 'en' ? 'Curated Pieces' : lang === 'fr' ? 'Pièces Sélectionnées' : lang === 'de' ? 'Ausgewählte Stücke' : 'Pezzi Selezionati'}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-5 leading-tight tracking-tight">
            {t.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
          {itemCount > 0 && (
            <p className="mt-6 text-sm text-gray-400">
              {itemCount} {lang === 'en' ? 'items available' : lang === 'fr' ? 'articles disponibles' : lang === 'de' ? 'Artikel verfügbar' : 'articoli disponibili'}
            </p>
          )}
        </div>
        {/* Decorative divider */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gray-300" />
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
