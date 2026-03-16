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
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z&E Selection | Mercatino dell'usato & Antichità",
  description: "Galleria d'antiquariato e mercatino dell'usato. Scopri pezzi unici e vintage.",
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
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <header className="py-3 border-b border-cream-dark/20 sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" aria-label="Z&E Selection — Home">
              <Logo className="h-12 md:h-14 w-auto" />
            </Link>
            <nav>
              <LanguageSwitcher currentLang={lang} />
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="py-8 mt-12 border-t border-cream-dark/20 text-center text-sm text-gray-500">
          <Logo className="h-8 w-auto mx-auto mb-3 opacity-60" />
          <p>&copy; {new Date().getFullYear()} Z&amp;E Selection. {t.footer}</p>
        </footer>
      </body>
    </html>
  );
}
