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
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 hidden sm:block truncate max-w-[200px]">{user.email}</span>
                    <form action="/api/admin/logout" method="POST">
                        <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors active:scale-95">
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
