'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Trash2, Search, Filter } from 'lucide-react';
import { Item } from '@/types/item';
import { EditItemDialog } from './edit-item-dialog';
import { ItemHistoryDialog } from './item-history-dialog';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function AdminItemsList({ initialItems, categories }: { initialItems: Item[], categories: { id: string, name: string }[] }) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [historyItemId, setHistoryItemId] = useState<string | null>(null);
    
    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold'>('all');

    const router = useRouter();
    const { adminItems: t } = useAdminDict();

    const toggleSoldStatus = async (item: Item) => {
        try {
            const res = await fetch(`/api/admin/items/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_sold: !item.is_sold }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setItems(items.map(i => i.id === item.id ? { ...i, is_sold: !i.is_sold } : i));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(t.errorUpdate);
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm(t.confirmDelete)) return;

        try {
            const res = await fetch(`/api/admin/items/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setItems(items.filter(i => i.id !== id));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert(t.errorDelete);
        }
    };

    const filteredItems = items.filter(item => {
        // Search
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            item.title.toLowerCase().includes(searchLower) || 
            (item.description && item.description.toLowerCase().includes(searchLower));
        
        // Category
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        
        // Status
        const matchesStatus = filterStatus === 'all' || 
                              (filterStatus === 'sold' && item.is_sold) ||
                              (filterStatus === 'available' && !item.is_sold);
                              
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-50/50 p-3 sm:p-4 rounded-xl border border-gray-100">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <Input 
                        placeholder="Cerca per titolo o descrizione..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 bg-white border-gray-200"
                    />
                </div>
                <div className="flex flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-40">
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full h-11 pl-3 pr-8 rounded-md border border-gray-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                        >
                            <option value="all">Tutte le categorie</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.name} className="capitalize">{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <Filter className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <div className="relative flex-1 sm:w-36">
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="w-full h-11 pl-3 pr-8 rounded-md border border-gray-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                        >
                            <option value="all">Tutti gli stati</option>
                            <option value="available">Disponibili</option>
                            <option value="sold">Venduti</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <Filter className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 font-medium">Nessun oggetto trovato coi filtri attuali.</p>
                    <Button variant="link" onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterStatus('all'); }}>Reset filtri</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                <div key={item.id} className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-xl shadow-sm transition-all ${item.is_sold ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'}`}>
                    {/* Image & Main Info Container */}
                    <div className="flex flex-row gap-4 w-full sm:w-auto items-start">
                        <div className="relative w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={item.image_url} alt={item.title} fill unoptimized className="object-cover" />
                            {item.is_sold && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Venduto</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                            <h3 className="text-base sm:text-sm font-semibold text-gray-900 truncate pr-2">{item.title}</h3>
                            <p className="text-sm sm:text-xs text-gray-600 font-medium mt-0.5">{new Intl.NumberFormat('it-CH', { style: 'currency', currency: 'CHF' }).format(item.price)}</p>
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm capitalize">{item.category}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions Container */}
                    <div className="flex flex-row items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto sm:ml-auto pt-3 sm:pt-0 border-t sm:border-none border-gray-100">
                        <Button
                            variant={item.is_sold ? "outline" : "default"}
                            size="sm"
                            className="flex-1 sm:flex-none justify-center h-10 rounded-lg font-medium"
                            onClick={() => toggleSoldStatus(item)}
                        >
                            {item.is_sold ? t.markAvailable : t.markSold}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center h-10 rounded-lg font-medium" onClick={() => setEditingItem(item)}>
                            {t.edit}
                        </Button>
                        <div className="flex gap-2 ml-1">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg" onClick={() => setHistoryItemId(item.id)} title={t.history}>
                                <History className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg" onClick={() => deleteItem(item.id)} title={t.delete}>
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
                </div>
            )}
            {editingItem && (
                <EditItemDialog
                    item={editingItem}
                    categories={categories}
                    onClose={() => {
                        setEditingItem(null);
                        // Refresh to fetch the new parent data, while keeping state
                        router.refresh();
                        // Note: A true SPA optimization would manually update the `items` state here using the response, 
                        // but router.refresh() gets the freshly updated props from the server component.
                        // To ensure UI snaps immediately, we do a page reload via window.location temporarily, or rely on React Server Components:
                        window.location.reload();
                    }}
                />
            )}
            {historyItemId && (
                <ItemHistoryDialog
                    itemId={historyItemId}
                    onClose={() => setHistoryItemId(null)}
                />
            )}
        </div>
    );
}
