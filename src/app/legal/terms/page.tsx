import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini e Condizioni | Z&E Selection",
  description: "Termini e Condizioni d'uso di Z&E Selection.",
};

const content = {
  it: {
    title: "Termini e Condizioni",
    back: "Torna alla Home",
    sections: [
      {
        title: "1. Natura del Servizio",
        text: "Z&E Selection è una piattaforma online che funge esclusivamente da vetrina espositiva per articoli di antiquariato, modernariato e usato di pregio provenienti da collezione privata. Il sito non supporta la vendita diretta con carrello o checkout automatizzato. Ogni interesse all'acquisto deve essere manifestato contattando direttamente il gestore tramite le modalità previste dal sito."
      },
      {
        title: "2. Vendita tra Privati (Visto e Piaciuto)",
        text: "Ogni eventuale compravendita scaturita a seguito di un contatto tramite questo sito si intende esclusivamente come vendita tra soggetti privati. Di conseguenza, i beni vengono venduti con la formula \"visto e piaciuto\" nello stato in cui si trovano. Si esclude esplicitamente qualsiasi forma di garanzia legale o commerciale, così come il diritto di recesso o di reso, salvo accordi differenti presi in forma scritta."
      },
      {
        title: "3. Descrizione e Stato degli Articoli",
        text: "Tutti gli articoli esposti sono usati o d'epoca. Segni di usura, imperfezioni o difetti dovuti al tempo fanno parte della natura stessa dei beni e verranno indicati, ove possibile, nelle descrizioni e documentati fotograficamente. Le immagini hanno valore illustrativo."
      },
      {
        title: "4. Prezzi, Pagamenti e Spedizioni",
        text: "I prezzi, qualora indicati, non sono vincolanti e rappresentano una richiesta base. Eventuali costi di spedizione o imballaggio verranno calcolati separatamente a seguito di contatto. La spedizione della merce avviene solo ad avvenuto incasso dell'intero importo pattuito (tipicamente a mezzo bonifico bancario o altro metodo concordato)."
      },
      {
        title: "5. Dogana, Tasse e Dazi (Acquirenti Esteri)",
        text: "Tutte le spedizioni partono dal Canton Ticino (Svizzera). Per gli acquirenti residenti al di fuori della Svizzera (inclusa l'Unione Europea), il ricevente è l'importatore ufficiale. Qualsiasi costo legato a sdoganamento, dazi doganali, IVA all'importazione o trattenute amministrative poste in essere dal Paese di destinazione è esclusivamente a carico dell'acquirente."
      },
      {
        title: "6. Diritto Applicabile e Foro Competente",
        text: "Per qualsiasi controversia o pretesa derivante o connessa all'utilizzo del sito e ad eventuali trattative conseguenti, si applica esclusivamente il diritto materiale svizzero. Il foro competente esclusivo è stabilito nel Cantone Ticino, Svizzera."
      }
    ]
  },
  en: {
    title: "Terms and Conditions",
    back: "Back to Home",
    sections: [
      {
        title: "1. Nature of the Service",
        text: "Z&E Selection is an online platform that serves exclusively as a showcase for antiques, modern vintage, and high-quality second-hand items from a private collection. The site does not support direct sales via an automated shopping cart or checkout. Any purchase interest must be expressed by contacting the operator directly through the methods provided on the site."
      },
      {
        title: "2. Private Sale (Sold As-Is)",
        text: "Any sale resulting from contact made through this site is strictly considered a private sale between individuals. Consequently, goods are sold under the \"sold as-is\" formula in their current condition. Any form of legal or commercial warranty, as well as the right of withdrawal or return, is expressly excluded, unless otherwise agreed in writing."
      },
      {
        title: "3. Description and Condition of Items",
        text: "All showcased items are used or vintage. Signs of wear, imperfections, or age-related defects are inherent to the nature of the goods and will be noted in descriptions and documented photographically wherever possible. Images are for illustrative purposes."
      },
      {
        title: "4. Pricing, Payments, and Shipping",
        text: "Prices, if indicated, are non-binding and represent a base request. Any shipping or packaging costs will be calculated separately upon contact. Goods are shipped only upon receipt of the full agreed amount (typically via bank transfer or another agreed method)."
      },
      {
        title: "5. Customs, Taxes, and Duties (International Buyers)",
        text: "All shipments originate from Canton Ticino (Switzerland). For buyers residing outside Switzerland (including the European Union), the recipient is the official importer. Any costs related to customs clearance, import duties, import VAT, or administrative fees imposed by the destination country are solely the responsibility of the buyer."
      },
      {
        title: "6. Governing Law and Jurisdiction",
        text: "For any dispute or claim arising out of or in connection with the use of the site and any resulting negotiations, Swiss substantive law shall apply exclusively. The exclusive place of jurisdiction is Canton Ticino, Switzerland."
      }
    ]
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    back: "Zurück zur Startseite",
    sections: [
      {
        title: "1. Art der Dienstleistung",
        text: "Z&E Selection ist eine Online-Plattform, die ausschliesslich als Schaufenster für Antiquitäten, Modernes und hochwertige Gebrauchtwaren aus einer Privatsammlung dient. Die Seite bietet keinen direkten Verkauf über einen automatisierten Warenkorb an. Jegliches Kaufinteresse muss durch direkte Kontaktaufnahme mit dem Betreiber geäussert werden."
      },
      {
        title: "2. Privatverkauf (Gekauft wie gesehen)",
        text: "Jeder Verkauf, der durch einen Kontakt über diese Website zustande kommt, gilt ausschliesslich als Privatverkauf. Folglich werden die Waren nach dem Prinzip \"gekauft wie gesehen\" in ihrem aktuellen Zustand verkauft. Jede Form von gesetzlicher Garantie sowie das Widerrufs- oder Rückgaberecht ist ausdrücklich ausgeschlossen, sofern nicht schriftlich etwas anderes vereinbart wurde."
      },
      {
        title: "3. Beschreibung und Zustand der Artikel",
        text: "Alle ausgestellten Artikel sind gebraucht oder vintage. Gebrauchsspuren, Unvollkommenheiten oder altersbedingte Mängel liegen in der Natur der Sache und werden nach Möglichkeit in den Beschreibungen erwähnt und fotografisch dokumentiert. Die Bilder dienen der Veranschaulichung."
      },
      {
        title: "4. Preise, Zahlungen und Versand",
        text: "Preise, falls angegeben, sind unverbindlich und stellen eine Basis-Forderung dar. Etwaige Versand- oder Verpackungskosten werden bei Kontaktaufnahme separat berechnet. Der Versand der Ware erfolgt erst nach Eingang des gesamten vereinbarten Betrags (in der Regel per Banküberweisung)."
      },
      {
        title: "5. Zoll, Steuern und Abgaben (Ausländische Käufer)",
        text: "Alle Sendungen erfolgen aus dem Kanton Tessin (Schweiz). Für Käufer mit Wohnsitz ausserhalb der Schweiz (einschliesslich der Europäischen Union) ist der Empfänger der offizielle Importeur. Jegliche Kosten im Zusammenhang mit Zollabfertigung, Einfuhrzöllen, Einfuhrumsatzsteuer oder Verwaltungsgebühren des Bestimmungslandes gehen ausschliesslich zu Lasten des Käufers."
      },
      {
        title: "6. Anwendbares Recht und Gerichtsstand",
        text: "Für Streitigkeiten im Zusammenhang mit der Nutzung der Website und daraus resultierenden Verhandlungen gilt ausschliesslich materielles Schweizer Recht. Ausschliesslicher Gerichtsstand ist der Kanton Tessin, Schweiz."
      }
    ]
  },
  fr: {
    title: "Conditions Générales",
    back: "Retour à l'accueil",
    sections: [
      {
        title: "1. Nature du Service",
        text: "Z&E Selection est une plateforme en ligne servant exclusivement de vitrine pour des antiquités, objets vintage et articles d'occasion de qualité issus d'une collection privée. Le site ne propose pas de vente directe via un panier automatisé. Tout intérêt d'achat doit être manifesté en contactant directement l'opérateur via les méthodes fournies sur le site."
      },
      {
        title: "2. Vente Privée (Vendu en l'état)",
        text: "Toute vente résultant d'un contact via ce site est strictement considérée comme une vente privée entre particuliers. Par conséquent, les marchandises sont vendues selon la formule \"vendu en l'état\" dans leur condition actuelle. Toute forme de garantie légale ou commerciale, ainsi que le droit de rétractation ou de retour, sont expressément exclus, sauf accord contraire par écrit."
      },
      {
        title: "3. Description et État des Articles",
        text: "Tous les articles présentés sont d'occasion ou vintage. Les signes d'usure, imperfections ou défauts dus au temps sont inhérents à la nature des biens et seront notés, dans la mesure du possible, dans les descriptions et photographiés. Les images ont une valeur illustrative."
      },
      {
        title: "4. Prix, Paiements et Expédition",
        text: "Les prix, le cas échéant, sont non contraignants et représentent une demande de base. Les éventuels frais d'expédition ou d'emballage seront calculés séparément. L'expédition des marchandises n'a lieu qu'après réception de la totalité du montant convenu (généralement par virement bancaire)."
      },
      {
        title: "5. Douanes, Taxes et Droits (Acheteurs Internationaux)",
        text: "Toutes les expéditions partent du Canton du Tessin (Suisse). Pour les acheteurs résidant hors de Suisse (y compris l'Union Européenne), le destinataire est l'importateur officiel. Tous les coûts liés au dédouanement, droits de douane, TVA à l'importation ou frais administratifs imposés par le pays de destination sont à la charge exclusive de l'acheteur."
      },
      {
        title: "6. Droit Applicable et For",
        text: "Pour tout litige découlant de l'utilisation du site et de toute négociation qui en résulte, le droit matériel suisse s'applique exclusivement. Le for exclusif est le Canton du Tessin, en Suisse."
      }
    ]
  }
};

export default async function TermsPage() {
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

      <div className="prose prose-gray max-w-none space-y-10 text-gray-600 leading-relaxed">
        {t.sections.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-xl font-medium text-gray-900 mb-4">{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
