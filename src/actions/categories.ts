'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { translateText } from './translate';

export async function addCategory(name: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const trimmedName = name.trim().toLowerCase();
    if (!trimmedName) {
        throw new Error('Name cannot be empty');
    }

    // Translate into the 3 supported non-Italian languages
    const [en, fr, de] = await Promise.all([
        translateText(trimmedName, 'en-US'),
        translateText(trimmedName, 'fr'),
        translateText(trimmedName, 'de'),
    ]);

    const { data, error } = await supabase
        .from('categories')
        .insert({ name: trimmedName, translations: { en, fr, de } })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw new Error('Questa categoria esiste già');
        }
        throw new Error(error.message);
    }

    revalidatePath('/admin');
    return data;
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin');
    return true;
}
