import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Z&E Selection",
  description: "Informativa sulla privacy di Z&E Selection.",
};

const content = {
  it: {
    title: "Privacy Policy",
    back: "Torna alla Home",
    last_updated: "Ultimo aggiornamento: Aprile 2026",
    sections: [
      {
        title: "1. Titolare del Trattamento",
        text: "Il Titolare del trattamento dei dati raccolti tramite questo sito web è Emanuele Novara, residente in Via Croce 2, 6710 Biasca, Ticino (Svizzera). Per qualsiasi richiesta relativa alla privacy è possibile scrivere all'indirizzo email: info@zeselection.com."
      },
      {
        title: "2. Dati Raccolti e Finalità",
        text: "Questo sito web raccoglie dati personali esclusivamente quando un utente decide volontariamente di compilare il modulo di contatto per richiedere informazioni su un articolo. I dati richiesti includono Nome, Indirizzo Email e il contenuto del messaggio. Questi dati vengono utilizzati al solo scopo di poter ricontattare l'utente e rispondere alla sua specifica richiesta."
      },
      {
        title: "3. Conservazione e Condivisione dei Dati",
        text: "I dati inviati tramite modulo di contatto vengono salvati in modo sicuro tramite il provider di database Supabase (la cui infrastruttura rispetta gli standard di sicurezza globali). Il sito è ospitato su Vercel. I dati non verranno mai ceduti, venduti o utilizzati per scopi di marketing (no newsletter) senza ulteriore ed esplicito consenso. Vengono conservati solo per il tempo necessario a gestire la richiesta dell'utente."
      },
      {
        title: "4. Cookie e Tracciamento Analitico",
        text: "Il sito utilizza cookie tecnici strettamente necessari al suo funzionamento e alla gestione della lingua scelta. Inoltre, ci avvaliamo di Google Search Console per collezionare dati statistici puramente aggregati, resi anonimi dal provider, al solo fine di comprendere il posizionamento del sito sui motori di ricerca. Non sono presenti cookie di profilazione per invio di pubblicità mirata."
      },
      {
        title: "5. Diritti dell'Utente",
        text: "Secondo le normative vigenti sulla protezione dei dati (LPD in Svizzera ed eventuale GDPR per cittadini europei), l'utente ha sempre il diritto di richiedere l'accesso, la rettifica, o la cancellazione definitiva dei propri dati personali. Basta inviare una semplice richiesta via email a info@zeselection.com."
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    back: "Back to Home",
    last_updated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Data Controller",
        text: "The Controller of the data collected through this website is Emanuele Novara, residing at Via Croce 2, 6710 Biasca, Ticino (Switzerland). For privacy-related inquiries, you can write to the email address: info@zeselection.com."
      },
      {
        title: "2. Data Collected and Purposes",
        text: "This website collects personal data exclusively when a user voluntarily decides to fill out the contact form to request information about an item. The requested data includes Name, Email Address, and the content of the message. This data is used solely to contact the user back and respond to their specific inquiry."
      },
      {
        title: "3. Data Storage and Sharing",
        text: "Data submitted via the contact form is securely stored through the database provider Supabase (whose infrastructure complies with global security standards). The site is hosted on Vercel. Data will never be transferred, sold, or used for marketing purposes (no newsletters) without further explicit consent. It is kept only as long as necessary to handle the user's request."
      },
      {
        title: "4. Cookies and Analytics",
        text: "The site uses technical cookies strictly necessary for its operation and language preference management. Additionally, we use Google Search Console to collect purely aggregated statistical data, anonymized by the provider, solely to understand the site's search engine ranking. There are no profiling cookies for targeted advertising."
      },
      {
        title: "5. User Rights",
        text: "According to applicable data protection laws (FADP in Switzerland and GDPR for European citizens), the user always has the right to request access, rectification, or permanent deletion of their personal data. Simply send a request via email to info@zeselection.com."
      }
    ]
  },
  de: {
    title: "Datenschutzerklärung",
    back: "Zurück zur Startseite",
    last_updated: "Letzte Aktualisierung: April 2026",
    sections: [
      {
        title: "1. Verantwortlicher für die Datenverarbeitung",
        text: "Der Verantwortliche für die über diese Website erhobenen Daten ist Emanuele Novara, wohnhaft in Via Croce 2, 6710 Biasca, Tessin (Schweiz). Bei datenschutzrechtlichen Fragen können Sie uns unter folgender E-Mail-Adresse kontaktieren: info@zeselection.com."
      },
      {
        title: "2. Erhobene Daten und Zwecke",
        text: "Diese Website erhebt personenbezogene Daten ausschliesslich dann, wenn ein Benutzer freiwillig das Kontaktformular ausfüllt, um Informationen zu einem Artikel anzufordern. Die abgefragten Daten umfassen den Namen, die E-Mail-Adresse und den Inhalt der Nachricht. Diese Daten werden ausschliesslich dazu verwendet, den Benutzer zu kontaktieren und auf seine spezifische Anfrage zu antworten."
      },
      {
        title: "3. Datenspeicherung und -weitergabe",
        text: "Die über das Kontaktformular übermittelten Daten werden sicher über den Datenbankanbieter Supabase gespeichert (dessen Infrastruktur den weltweiten Sicherheitsstandards entspricht). Die Website wird bei Vercel gehostet. Daten werden ohne ausdrückliche Zustimmung niemals weitergegeben, verkauft oder für Marketingzwecke (keine Newsletter) verwendet. Sie werden nur so lange aufbewahrt, wie es für die Bearbeitung der Anfrage erforderlich ist."
      },
      {
        title: "4. Cookies und Analysen",
        text: "Die Website verwendet technische Cookies, die für den Betrieb und die Verwaltung der Sprachpräferenzen unbedingt erforderlich sind. Darüber hinaus nutzen wir die Google Search Console, um rein aggregierte, vom Anbieter anonymisierte Statistikdaten zu erfassen, um das Suchmaschinen-Ranking der Website zu verstehen. Es gibt keine Profiling-Cookies für zielgerichtete Werbung."
      },
      {
        title: "5. Rechte des Benutzers",
        text: "Gemäss den geltenden Datenschutzgesetzen (DSG in der Schweiz und evtl. DSGVO für europäische Bürger) hat der Benutzer jederzeit das Recht, Auskunft, Berichtigung oder dauerhafte Löschung seiner personenbezogenen Daten zu verlangen. Senden Sie dazu einfach eine E-Mail an info@zeselection.com."
      }
    ]
  },
  fr: {
    title: "Politique de Confidentialité",
    back: "Retour à l'accueil",
    last_updated: "Dernière mise à jour : Avril 2026",
    sections: [
      {
        title: "1. Responsable du Traitement",
        text: "Le Responsable du traitement des données collectées via ce site web est Emanuele Novara, résidant à Via Croce 2, 6710 Biasca, Tessin (Suisse). Pour toute demande liée à la confidentialité, vous pouvez écrire à l'adresse email : info@zeselection.com."
      },
      {
        title: "2. Données Collectées et Finalités",
        text: "Ce site web collecte des données personnelles exclusivement lorsqu'un utilisateur décide volontairement de remplir le formulaire de contact pour demander des informations sur un article. Les données demandées comprennent le Nom, l'Adresse Email et le contenu du message. Ces données sont utilisées uniquement pour recontacter l'utilisateur et répondre à sa demande spécifique."
      },
      {
        title: "3. Conservation et Partage des Données",
        text: "Les données soumises via le formulaire de contact sont stockées de manière sécurisée par l'intermédiaire du fournisseur de base de données Supabase (dont l'infrastructure respecte les normes mondiales de sécurité). Le site est hébergé sur Vercel. Les données ne seront jamais cédées, vendues ou utilisées à des fins de marketing (pas de newsletter) sans consentement explicite. Elles ne sont conservées que le temps nécessaire pour traiter la demande."
      },
      {
        title: "4. Cookies et Analyses",
        text: "Le site utilise des cookies techniques strictement nécessaires à son fonctionnement et à la gestion des préférences linguistiques. De plus, nous utilisons Google Search Console pour collecter des données statistiques purement agrégées, anonymisées par le fournisseur, uniquement pour comprendre le classement du site sur les moteurs de recherche. Il n'y a pas de cookies de profilage pour la publicité ciblée."
      },
      {
        title: "5. Droits de l'Utilisateur",
        text: "Conformément aux lois applicables sur la protection des données (LPD en Suisse et RGPD pour les citoyens européens), l'utilisateur a toujours le droit de demander l'accès, la rectification ou la suppression définitive de ses données personnelles. Il suffit d'envoyer une demande par email à info@zeselection.com."
      }
    ]
  }
};

export default async function PrivacyPage() {
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

      <div className="mb-12">
        <h1 className="text-4xl font-serif text-gray-900 mb-4">{t.title}</h1>
        <p className="text-sm text-gray-400">{t.last_updated}</p>
      </div>

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
