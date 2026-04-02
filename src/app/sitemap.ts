import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const baseUrl = 'https://www.zeselection.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Route statiche base
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legal/impressum`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ];

  // Fetch Categorie
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await supabase.from('categories').select('slug');
    if (categories) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Errore fetch categorie per sitemap:", error);
  }

  // Fetch Articoli
  let itemRoutes: MetadataRoute.Sitemap = [];
  try {
    // Si suppone la presenza della tabella items. Se ci sono date di modifica, possiamo usarle.
    const { data: items } = await supabase.from('items').select('id, updated_at, created_at');
    if (items) {
      itemRoutes = items.map((item) => ({
        url: `${baseUrl}/item/${item.id}`,
        lastModified: new Date(item.updated_at || item.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Errore fetch articoli per sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...itemRoutes];
}
