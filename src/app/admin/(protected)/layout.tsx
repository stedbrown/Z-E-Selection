import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/admin/login');
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 sm:p-6">
                {children}
            </main>
        </div>
    );
}
