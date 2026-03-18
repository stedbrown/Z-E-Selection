import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/logo";
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
  title: "Z&E Selection | Antiquariato & Usato di Qualità",
  description: "Galleria d'antiquariato e mercatino dell'usato. Scopri pezzi unici e vintage selezionati con cura da Zuhad & Ema.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  const t = getDictionary(lang).site;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex flex-col min-h-screen overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* ── Header ── */}
        <header className="glass-header">
          <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link href="/" aria-label="Z&E Selection — Home" className="hover:opacity-80 transition-opacity">
              <Logo className="text-2xl sm:text-3xl" />
            </Link>
            <nav className="flex items-center gap-8">
              <Link 
                href="/about" 
                className="nav-link"
              >
                {lang === 'it' ? 'Chi Siamo' : lang === 'en' ? 'About Us' : lang === 'fr' ? 'À Propos' : 'Über Uns'}
              </Link>
              <div className="h-4 w-px bg-gray-200 hidden sm:block" />
              <LanguageSwitcher currentLang={lang} />
            </nav>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 animate-fade-in">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="mt-20 border-t border-gray-100 bg-white/60">
          <div className="container mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <Logo className="text-base" />
            <p>&copy; {new Date().getFullYear()} Z&amp;E Selection. {t.footer}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
