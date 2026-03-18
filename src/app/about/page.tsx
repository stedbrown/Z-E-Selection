import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import Image from 'next/image';

export default async function AboutPage() {
    const cookieStore = await cookies();
    const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
    const t = getDictionary(lang).about;

    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/hero-antiques.png"
                        alt="About Us Background"
                        fill
                        className="object-cover opacity-30 grayscale-[0.5]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 to-[#FDFBF7]" />
                </div>
                
                <div className="relative text-center px-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-4 tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto italic">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg prose-slate prose-serif">
                        <p className="text-gray-700 leading-relaxed mb-8 text-xl sm:text-2xl font-serif">
                            {t.content1}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16 items-center">
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed">
                                    {t.content2}
                                </p>
                                <p className="text-gray-900 font-semibold border-l-4 border-gray-900 pl-4 py-2">
                                    {t.contact}
                                </p>
                                <div className="pt-4">
                                    <Link 
                                        href="/" 
                                        className="inline-flex items-center text-sm font-semibold tracking-widest uppercase text-gray-900 hover:text-gray-600 transition-colors group"
                                    >
                                        <span className="border-b border-gray-900 group-hover:border-gray-600 pb-1">
                                            {lang === 'it' ? 'Torna alla collezione' : lang === 'en' ? 'Back to collection' : lang === 'fr' ? 'Retour alla collection' : 'Zurück zur Kollektion'}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="/hero-antiques.png"
                                    alt="Detail"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote of authenticity */}
            <section className="bg-white/50 py-20 border-y border-gray-100 italic">
                <div className="container mx-auto px-4 text-center">
                    <Logo className="text-3xl sm:text-4xl opacity-20 mb-8 mx-auto" />
                    <p className="text-2xl sm:text-3xl font-serif text-gray-400 max-w-4xl mx-auto leading-snug">
                        &quot;{lang === 'it' ? 'Ogni pezzo ha una storia, noi siamo qui per aiutarvi a trovarla.' : lang === 'en' ? 'Every piece has a story, we are here to help you find it.' : lang === 'fr' ? 'Chaque pièce a une histoire, nous sommes là pour vous aider à la trouver.' : 'Jedes Stück hat eine Geschichte, wir sind hier, um Ihnen zu helfen, sie zu finden.'}&quot;
                    </p>
                </div>
            </section>
        </div>
    );
}
