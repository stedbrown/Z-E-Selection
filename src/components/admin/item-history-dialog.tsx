'use client';

import { useEffect, useState } from 'react';
import { ItemEdit } from '@/types/item';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function ItemHistoryDialog({ itemId, onClose }: { itemId: string, onClose: () => void }) {
    const [history, setHistory] = useState<ItemEdit[]>([]);
    const [loading, setLoading] = useState(true);
    const { adminHistory: t } = useAdminDict();

    useEffect(() => {
        fetch(`/api/admin/items/${itemId}/history`)
            .then(res => res.json())
            .then(data => {
                setHistory(data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load history', err);
                setLoading(false);
            });
    }, [itemId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center border-b p-6">
                    <h2 className="text-xl font-serif font-medium text-gray-900">{t.title}</h2>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">{t.close}</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">{t.loading}</p>
                    ) : history.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">{t.empty}</p>
                    ) : (
                        <div className="space-y-6">
                            {history.map((edit) => (
                                <div key={edit.id} className="bg-white p-4 border rounded shadow-sm text-sm">
                                    <div className="flex justify-between text-gray-500 mb-2 border-b pb-2">
                                        <span>{t.modifiedBy} <strong className="text-gray-700">{edit.editor_email || t.unknown}</strong></span>
                                        <span>{new Date(edit.edited_at).toLocaleString('it-CH')}</span>
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="font-medium text-xs uppercase text-gray-400 mb-1">{t.changes}</h4>
                                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-gray-800">
                                            {JSON.stringify(edit.changes?.new, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
