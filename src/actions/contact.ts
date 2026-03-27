'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient();

    const itemId = formData.get('itemId') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const country = formData.get('country') as string;

    if (!name || !itemId) {
        return { error: 'Name and Item ID are required' };
    }

    const { error } = await supabase
        .from('contacts')
        .insert({
            item_id: itemId,
            name,
            phone,
            address,
            country,
            status: 'pending'
        });

    if (error) {
        console.error('Error submitting contact form:', error);
        return { error: error.message };
    }

    revalidatePath(`/item/${itemId}`);
    return { success: true };
}
