'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';
import { Item } from '@/types/item';
import { EditItemDialog } from './edit-item-dialog';
import { ItemHistoryDialog } from './item-history-dialog';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function AdminItemsList({ initialItems, categories }: { initialItems: Item[], categories: { id: string, name: string }[] }) {
    const [items, setItems] = useState<Item[]>(initialItems);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [historyItemId, setHistoryItemId] = useState<string | null>(null);
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

    if (items.length === 0) {
        return <p className="text-gray-500 text-sm">{t.empty}</p>;
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
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
