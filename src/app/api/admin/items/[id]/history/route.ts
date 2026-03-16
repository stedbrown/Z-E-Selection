import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const supabase = await createClient();

        // Server-side auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('item_edits')
            .select('*')
            .eq('item_id', id)
            .order('edited_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Fetch History Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
