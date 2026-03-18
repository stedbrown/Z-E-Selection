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
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-ready styling */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-antiques.png"
            alt="Antique coins, collectibles and numismatics"
            fill
            className="object-cover scale-105"
            priority
            quality={100}
          />
          {/* Multi-layered Gradient Overlays for Cinematic Depth */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FDFBF7]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/20 via-transparent to-[#FDFBF7]/20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-fade-in">
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white font-bold">
              {lang === 'en' ? 'Curated Collections' : lang === 'fr' ? 'Collections Sélectionnées' : lang === 'de' ? 'Auserlesene Sammlungen' : 'Collezioni Selezionate'}
            </p>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-white mb-8 leading-[1.1] tracking-tight animate-slide-up [text-shadow:_0_2px_40px_rgba(0,0,0,0.3)]">
            {t.title.split(' ').map((word: string, i: number) => (
              <span key={i} className={`inline-block mr-4 ${i % 2 === 1 ? 'italic font-light' : ''}`}>
                {word}
              </span>
            ))}
          </h1>
          
          <p className="text-lg sm:text-2xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-slide-up delay-200 [text-shadow:_0_1px_20px_rgba(0,0,0,0.2)]">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-300">
            <a href="#catalogue" className="btn-primary group">
              <span className="flex items-center gap-2">
                {lang === 'en' ? 'Explore Catalogue' : lang === 'fr' ? 'Explorer le Catalogue' : lang === 'de' ? 'Katalog erkunden' : 'Esplora il Catalogo'}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
            
            {itemCount > 0 && (
              <p className="text-sm text-white/80 font-medium tracking-wide backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <span className="text-white font-bold">{itemCount}</span> {lang === 'en' ? 'rare pieces available' : lang === 'fr' ? 'pièces rares disponibles' : lang === 'de' ? 'seltene Stücke verfügbar' : 'pezzi rari disponibili'}
              </p>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
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
