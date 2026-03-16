import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

import { generateTranslations } from '@/actions/translate';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await request.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch current item to save as history
        const { data: currentItem, error: fetchError } = await supabase
            .from('items')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !currentItem) throw fetchError || new Error('Item not found');

        let translations = currentItem.translations;

        // If title, description or category changed, regenerate translations
        if ((body.title && body.title !== currentItem.title) || 
            (body.description !== undefined && body.description !== currentItem.description) ||
            (body.category && body.category !== currentItem.category)) {
            const newTitle = body.title || currentItem.title;
            const newDesc = body.description !== undefined ? body.description : currentItem.description;
            const newCat = body.category || currentItem.category;
            translations = await generateTranslations(newTitle, newDesc, newCat);
        }

        const updateData: any = {};
        const fields = ['title', 'description', 'price', 'category', 'image_url', 'extra_images', 'is_sold'];
        fields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        if (updateData.title || updateData.description !== undefined) {
            updateData.translations = translations;
        }

        if (Object.keys(updateData).length === 0) {
             return NextResponse.json(currentItem);
        }

        // Update item
        const { data, error } = await supabase
            .from('items')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Insert into item_edits
        await supabase.from('item_edits').insert({
            item_id: id,
            edited_by: user.id,
            editor_email: user.email,
            changes: { previous: currentItem, new: updateData }
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('PATCH Item Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
