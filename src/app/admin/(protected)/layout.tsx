import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n/dictionaries';

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

    const cookieStore = await cookies();
    const lang = cookieStore.get('NEXT_LOCALE')?.value || 'it';
    const t = getDictionary(lang).adminMenu;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h1 className="text-xl font-semibold">{t.title}</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">{user.email}</span>
                    <form action="/api/admin/logout" method="POST">
                        <button type="submit" className="text-sm text-red-600 hover:underline">
                            {t.logout}
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6">
                {children}
            </main>
        </div>
    );
}
