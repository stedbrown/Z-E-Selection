import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { ItemGrid } from '@/components/item-grid';

// Force dynamic since we pull from DB realtime
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

  // Build label map from the stored translations column in the categories table
  const categoryLabels: Record<string, string> = {};
  if (lang !== 'it') {
    for (const cat of (categories || [])) {
      const translated = (cat as any).translations?.[lang];
      if (translated) categoryLabels[cat.name] = translated;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">{t.title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <ItemGrid
        items={items || []}
        categories={categoryNames}
        categoryLabels={categoryLabels}
        lang={lang as 'it' | 'en' | 'fr' | 'de'}
        t={t}
      />
    </div>
  );
}
