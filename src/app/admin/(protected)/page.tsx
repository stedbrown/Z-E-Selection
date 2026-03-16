import { createClient } from '@/lib/supabase/server';
import { AdminDashboardTabs } from '@/components/admin/admin-tabs';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch items
    const { data: items } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
        
    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    const cookieStore = await cookies();
    const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
    const fullDict = getDictionary(lang);
    const dict = {
        adminMenu: fullDict.adminMenu,
        adminForm: fullDict.adminForm,
        adminItems: fullDict.adminItems,
        adminHistory: fullDict.adminHistory,
        adminCategories: fullDict.adminCategories,
    };

    return (
        <div className="container mx-auto">
            <AdminDashboardTabs 
                items={items || []} 
                categories={categories || []}
                dict={dict}
            />
        </div>
    );
}
