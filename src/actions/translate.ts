'use server'

import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_AUTH_KEY || '';
const translator = authKey && authKey !== 'your_deepl_auth_key_here' ? new deepl.Translator(authKey) : null;

export async function translateText(text: string, targetLang: deepl.TargetLanguageCode) {
    if (!translator) {
        console.warn('DeepL Auth Key not configured. Returning original text.');
        return text;
    }

    try {
        const result = await translator.translateText(text, null, targetLang);
        return result.text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original
    }
}

export async function generateTranslations(title: string, description: string, category: string) {
    const [enTitle, frTitle, deTitle] = await Promise.all([
        translateText(title, 'en-US'),
        translateText(title, 'fr'),
        translateText(title, 'de')
    ]);

    const [enDesc, frDesc, deDesc] = await Promise.all([
        translateText(description, 'en-US'),
        translateText(description, 'fr'),
        translateText(description, 'de')
    ]);
    
    // We also translate the category now
    const [enCat, frCat, deCat] = await Promise.all([
        translateText(category, 'en-US'),
        translateText(category, 'fr'),
        translateText(category, 'de')
    ]);

    return {
        en: { title: enTitle, description: enDesc, category: enCat },
        fr: { title: frTitle, description: frDesc, category: frCat },
        de: { title: deTitle, description: deDesc, category: deCat }
    };
}
