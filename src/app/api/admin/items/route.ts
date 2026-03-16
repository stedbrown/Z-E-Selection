import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateTranslations, translateText } from '@/actions/translate';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Server-side auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string || '';
        const price = parseFloat(formData.get('price') as string);
        const category = formData.get('category') as string;
        const imageUrl = formData.get('imageUrl') as string;
        const extraImages: string[] = JSON.parse((formData.get('extraImages') as string) || '[]');

        if (!title || !price || !category || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Generate Translations
        const translations = await generateTranslations(title, description, category);

        // 2. Insert into Supabase
        const { data, error } = await supabase
            .from('items')
            .insert({
                title,
                description,
                price,
                category,
                image_url: imageUrl,
                extra_images: extraImages,
                translations,
                created_by: user.id,
                creator_email: user.email
            })
            .select()
            .single();

        if (error) throw error;

        // 3. Auto-save category to the categories table with translations
        const normalizedCategory = category.trim().toLowerCase();
        if (normalizedCategory) {
            // Check if already exists (to avoid unnecessary DeepL calls)
            const { data: existing } = await supabase
                .from('categories')
                .select('id')
                .eq('name', normalizedCategory)
                .maybeSingle();

            if (!existing) {
                const [en, fr, de] = await Promise.all([
                    translateText(normalizedCategory, 'en-US'),
                    translateText(normalizedCategory, 'fr'),
                    translateText(normalizedCategory, 'de'),
                ]);
                await supabase
                    .from('categories')
                    .upsert({ name: normalizedCategory, translations: { en, fr, de } }, { onConflict: 'name', ignoreDuplicates: true });
            }
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating item:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
