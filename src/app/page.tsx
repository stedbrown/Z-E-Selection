import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ItemGrid } from '@/components/item-grid';
import Image from 'next/image';
import { Logo } from '@/components/logo';

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with optimized overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-antiques.png"
            alt="Antique coins, collectibles and numismatics"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          {/* Subtle overlays for a cleaner, high-end look */}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-black/10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="mb-12 animate-fade-in opacity-80 hover:opacity-100 transition-opacity">
            <Logo inverted className="scale-110 sm:scale-125" showSlogan />
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-serif text-white mb-10 leading-[1] tracking-tight animate-slide-up [text-shadow:_0_4px_30px_rgba(0,0,0,0.25)]">
            {t.title}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-14 leading-relaxed font-light animate-slide-up delay-200">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up delay-300">
            <a href="#catalogue" className="btn-primary group">
              <span>
                {lang === 'en' ? 'Explore Catalogue' : lang === 'fr' ? 'Explorer le Catalogue' : lang === 'de' ? 'Katalog erkunden' : 'Esplora il Catalogo'}
              </span>
              <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            
            {itemCount > 0 && (
              <div className="flex items-center gap-3 text-white/60 text-sm tracking-widest uppercase font-medium">
                <span className="w-8 h-px bg-white/30" />
                <span>{itemCount} {lang === 'en' ? 'Items' : lang === 'fr' ? 'Articles' : lang === 'de' ? 'Artikel' : 'Annunci'}</span>
                <span className="w-8 h-px bg-white/30" />
              </div>
            )}
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-float opacity-50">
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── Catalogue Anchor ── */}
      <div id="catalogue" className="scroll-mt-24" />

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
