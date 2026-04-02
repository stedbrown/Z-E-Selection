import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/logo";
import { Header } from "@/components/header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zeselection.com'),
  title: "Z&E Selection | Antiquariato & Usato di Qualità",
  description: "Galleria d'antiquariato e mercatino dell'usato. Scopri pezzi unici e vintage selezionati con cura da Zuhad & Ema.",
  openGraph: {
    title: "Z&E Selection | Antiquariato & Usato di Qualità",
    description: "Esposizione privata di articoli antichi, rari e modernariato. Scopri pezzi unici e vintage selezionati con cura.",
    url: 'https://www.zeselection.com',
    siteName: 'Z&E Selection',
    locale: 'it_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Z&E Selection | Antiquariato & Usato di Qualità",
    description: "Esposizione privata di articoli antichi, rari e modernariato.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  const t = getDictionary(lang).site;

  const { data: categories } = await supabase
    .from('categories')
    .select('name, translations, slug')
    .order('name', { ascending: true });

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* ── Header ── */}
        <Header 
          lang={lang} 
          categories={categories || []} 
          t={{
            search: t.search || 'Cerca...',
            categories: t.categories || 'Categorie',
            allCategories: t.allCategories || 'Tutte le categorie',
            about: lang === 'it' ? 'Chi Siamo' : lang === 'en' ? 'About Us' : lang === 'fr' ? 'À Propos' : 'Über Uns'
          }}
          categoryLabels={(()=>{
            const labels: Record<string, string> = {};
            if (lang !== 'it') {
              for (const cat of (categories || [])) {
                const translated = (cat as any).translations?.[lang];
                if (translated) labels[cat.name] = translated;
              }
            }
            return labels;
          })()}
        />

        {/* ── Main ── */}
        <main className="flex-1 animate-fade-in">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="mt-20 border-t border-gray-100 bg-white/60 pt-16 pb-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-12">
              {/* Column 1: Brand */}
              <div className="space-y-4">
                <Logo className="text-2xl" />
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  {lang === 'it' ? "Galleria d'antiquariato e mercatino dell'usato selezionato con cura da Zuhad & Ema." : 
                   lang === 'en' ? "Antique gallery and flea market curated with care by Zuhad & Ema." :
                   lang === 'fr' ? "Galerie d'antiquités et marché aux puces sélectionnés avec soin par Zuhad & Ema." :
                   "Antiquitätengalerie und Flohmarkt, mit Sorgfalt kuratiert von Zuhad & Ema."}
                </p>
              </div>

              {/* Column 2: Contacts */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#B49E78]">{lang === 'it' ? 'Contatti' : lang === 'en' ? 'Contact' : lang === 'fr' ? 'Contact' : 'Kontakt'}</h3>
                <ul className="text-sm text-gray-500 space-y-2.5">
                  <li>
                    <a href="mailto:info@zeselection.com" className="hover:text-[#B49E78] transition-colors">info@zeselection.com</a>
                  </li>
                  <li className="text-gray-400">
                    Biasca (Ticino), Svizzera
                  </li>
                </ul>
              </div>

              {/* Column 3: Quick Links */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#B49E78]">{lang === 'it' ? 'Link Utili' : 'Links'}</h3>
                <ul className="text-sm text-gray-500 space-y-2.5">
                  <li>
                    <Link href="/about" className="hover:text-[#B49E78] transition-colors">{lang === 'it' ? 'Chi Siamo' : lang === 'en' ? 'About Us' : lang === 'fr' ? 'À Propos' : 'Über Uns'}</Link>
                  </li>
                  <li>
                    <Link href="/legal/impressum" className="hover:text-[#B49E78] transition-colors block text-left">{t.legal?.impressum || 'Note Legali / Impressum'}</Link>
                  </li>
                  <li>
                    <Link href="/legal/privacy" className="hover:text-[#B49E78] transition-colors block text-left">{t.legal?.privacy || 'Privacy Policy'}</Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="hover:text-[#B49E78] transition-colors block text-left">{t.legal?.terms || 'Termini e Condizioni'}</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-medium tracking-wide">
              <p>&copy; {new Date().getFullYear()} Z&amp;E Selection. {t.footer}</p>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                  Svizzera / Switzerland
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
