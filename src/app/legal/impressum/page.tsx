import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Note Legali / Impressum | Z&E Selection",
  description: "Note legali e informazioni di contatto di Z&E Selection.",
};

const content = {
  it: {
    title: "Note Legali (Impressum)",
    back: "Torna alla Home",
    provider: "Fornitore dei servizi e responsabile del sito:",
    name: "Emanuele Novara",
    address: "Via Croce 2\n6710 Biasca\nTicino, Svizzera",
    contact: "Contatti",
    email: "info@zeselection.com",
    disclaimer_title: "Natura dell'attività",
    disclaimer_text: "Questo sito web è gestito a titolo privato. Non sussiste alcuna iscrizione al Registro di Commercio svizzero in quanto l'attività non costituisce impresa o società commerciale secondo il diritto svizzero (vendita privata di articoli).",
    copyright_title: "Diritto d'autore",
    copyright_text: "I contenuti e le opere pubblicate in queste pagine web sono soggetti alla legge svizzera sul diritto d'autore. La duplicazione, l'elaborazione, la distribuzione e qualsiasi forma di sfruttamento al di fuori di quanto consentito dalla legge sul diritto d'autore richiedono il consenso scritto dell'autore o dell'ideatore."
  },
  en: {
    title: "Legal Notice (Impressum)",
    back: "Back to Home",
    provider: "Service provider and website owner:",
    name: "Emanuele Novara",
    address: "Via Croce 2\n6710 Biasca\nTicino, Switzerland",
    contact: "Contact",
    email: "info@zeselection.com",
    disclaimer_title: "Nature of Business",
    disclaimer_text: "This website is operated privately. There is no registration in the Swiss Commercial Register as the activity does not constitute a commercial enterprise or company under Swiss law (private sale of items).",
    copyright_title: "Copyright",
    copyright_text: "The content and works published on these webpages are subject to Swiss copyright law. The duplication, processing, distribution, or any form of commercialization of such material beyond the scope of the copyright law shall require the prior written consent of its respective author or creator."
  },
  de: {
    title: "Impressum",
    back: "Zurück zur Startseite",
    provider: "Dienstanbieter und Website-Betreiber:",
    name: "Emanuele Novara",
    address: "Via Croce 2\n6710 Biasca\nTicino, Schweiz",
    contact: "Kontakt",
    email: "info@zeselection.com",
    disclaimer_title: "Art der Tätigkeit",
    disclaimer_text: "Diese Website wird privat betrieben. Es besteht keine Eintragung im Schweizerischen Handelsregister, da es sich bei der Tätigkeit nicht um ein kaufmännisches Unternehmen oder eine Gesellschaft nach Schweizer Recht handelt (Privatverkauf von Artikeln).",
    copyright_title: "Urheberrecht",
    copyright_text: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Schweizer Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
  },
  fr: {
    title: "Mentions Légales (Impressum)",
    back: "Retour à l'accueil",
    provider: "Fournisseur de services et propriétaire du site :",
    name: "Emanuele Novara",
    address: "Via Croce 2\n6710 Biasca\nTicino, Suisse",
    contact: "Contact",
    email: "info@zeselection.com",
    disclaimer_title: "Nature de l'activité",
    disclaimer_text: "Ce site web est géré à titre privé. Il n'y a pas d'inscription au Registre du Commerce Suisse car l'activité ne constitue pas une entreprise commerciale ou une société selon le droit suisse (vente privée d'articles).",
    copyright_title: "Droit d'auteur",
    copyright_text: "Le contenu et les œuvres publiés sur ces pages web sont soumis à la loi suisse sur le droit d'auteur. La reproduction, le traitement, la distribution et toute forme de commercialisation d'un tel matériel en dehors du champ d'application de la loi sur le droit d'auteur nécessitent le consentement écrit préalable de l'auteur ou du créateur."
  }
};

export default async function ImpressumPage() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('NEXT_LOCALE')?.value || 'it';
  const lang = (Object.keys(content).includes(langCookie) ? langCookie : 'it') as keyof typeof content;
  const t = content[lang];

  return (
    <div className="container mx-auto px-4 py-24 sm:py-32 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" />
        {t.back}
      </Link>

      <h1 className="text-4xl font-serif text-gray-900 mb-12">{t.title}</h1>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">{t.provider}</h2>
          <p className="font-medium text-gray-900">{t.name}</p>
          <p className="whitespace-pre-line">{t.address}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">{t.contact}</h2>
          <p>Email: <a href={`mailto:${t.email}`} className="text-black hover:underline">{t.email}</a></p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">{t.disclaimer_title}</h2>
          <p>{t.disclaimer_text}</p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-gray-900 mb-4">{t.copyright_title}</h2>
          <p>{t.copyright_text}</p>
        </section>
      </div>
    </div>
  );
}
