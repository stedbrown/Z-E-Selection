'use client';

import { useRouter } from 'next/navigation';

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const router = useRouter();

    const changeLanguage = (lang: string) => {
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
        router.refresh();
    };

    return (
        <select 
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
        >
            <option value="it">IT</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
        </select>
    );
}
