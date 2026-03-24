import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }
    try {
        const supabase = await createClient();

        // Simple query to avoid Supabase pause
        const { count, error } = await supabase
            .from('items')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Keep-alive error:', error);
            return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'ok',
            message: 'Keep-alive ping successful',
            timestamp: new Date().toISOString(),
            item_count: count
        });
    } catch (err: any) {
        return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
    }
}
