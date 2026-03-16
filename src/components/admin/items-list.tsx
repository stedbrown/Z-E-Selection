'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Item } from '@/types/item';
import { EditItemDialog } from './edit-item-dialog';
import { ItemHistoryDialog } from './item-history-dialog';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function AdminItemsList({ initialItems }: { initialItems: Item[] }) {
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
                <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-md transition-opacity ${item.is_sold ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
                    <div className="relative w-full sm:w-20 h-48 sm:h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image src={item.image_url} alt={item.title} fill unoptimized className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm sm:text-xs text-gray-500">{new Intl.NumberFormat('it-CH', { style: 'currency', currency: 'CHF' }).format(item.price)} - {item.category}</p>
                        <p className="text-xs text-gray-400 mt-1">{t.uploadedBy} {item.creator_email || t.unknown}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                        <Button
                            variant={item.is_sold ? "outline" : "default"}
                            size="sm"
                            className="flex-1 sm:flex-none justify-center"
                            onClick={() => toggleSoldStatus(item)}
                        >
                            {item.is_sold ? t.markAvailable : t.markSold}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center" onClick={() => setEditingItem(item)}>
                            {t.edit}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center" onClick={() => setHistoryItemId(item.id)}>
                            {t.history}
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1 sm:flex-none justify-center" onClick={() => deleteItem(item.id)}>
                            {t.delete}
                        </Button>
                    </div>
                </div>
            ))}
            {editingItem && (
                <EditItemDialog 
                    item={editingItem} 
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
