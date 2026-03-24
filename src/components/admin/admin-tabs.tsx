'use client';

import { useState } from 'react';
import { UploadForm } from '@/components/admin/upload-form';
import { AdminItemsList } from '@/components/admin/items-list';
import { CategoryManager } from '@/components/admin/category-manager';
import { LayoutGrid, PlusCircle, Tags } from 'lucide-react';
import { Item } from '@/types/item';
import { AdminDictProvider } from '@/components/admin/admin-dict-context';

interface AdminDashboardTabsProps {
    items: Item[];
    categories: { id: string, name: string }[];
    dict: Record<string, Record<string, string>>;
}

export function AdminDashboardTabs({ items, categories, dict }: AdminDashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<'catalog' | 'new' | 'categories'>('catalog');
    const menu = dict.adminMenu;

    return (
        <AdminDictProvider dict={dict as any}>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar Navigation */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'catalog' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                            {menu.catalog}
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'new' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                        >
                            <PlusCircle className="w-5 h-5" />
                            {menu.newItem}
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
                        >
                            <Tags className="w-5 h-5" />
                            {menu.categories}
                        </button>
                    </nav>
                </aside>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 px-2 pt-2 pb-6 sm:pb-4 flex justify-around items-center shadow-[0_-10px_15px_-3px_rgb(0,0,0,0.05)]">
                    <button
                        onClick={() => setActiveTab('catalog')}
                        className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${activeTab === 'catalog' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid className={`w-6 h-6 ${activeTab === 'catalog' ? 'scale-110 mb-0.5' : ''}`} />
                        <span>{menu.catalog}</span>
                    </button>
                    <div className="relative -top-5">
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex items-center justify-center rounded-full p-4 text-white shadow-xl transition-transform active:scale-95 ${activeTab === 'new' ? 'bg-gray-800 scale-105' : 'bg-gray-900 hover:scale-105'}`}
                        >
                            <PlusCircle className="w-7 h-7" />
                        </button>
                    </div>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-lg text-xs font-medium transition-all active:scale-95 ${activeTab === 'categories' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Tags className={`w-6 h-6 ${activeTab === 'categories' ? 'scale-110 mb-0.5' : ''}`} />
                        <span>{menu.categories}</span>
                    </button>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {activeTab === 'catalog' && (
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
                            <h2 className="text-2xl font-serif font-medium mb-6 text-gray-900">{menu.catalog}</h2>
                            <AdminItemsList initialItems={items} categories={categories} />
                        </div>
                    )}
                    {activeTab === 'new' && (
                        <div className="flex justify-center">
                            <div className="w-full max-w-2xl">
                                <UploadForm categories={categories} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'categories' && (
                        <CategoryManager initialCategories={categories} />
                    )}
                </div>
            </div>
        </AdminDictProvider>
    );
}
