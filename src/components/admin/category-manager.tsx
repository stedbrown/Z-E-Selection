'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { addCategory, deleteCategory } from '@/actions/categories';
import { useAdminDict } from '@/components/admin/admin-dict-context';

interface CategoryManagerProps {
    initialCategories: { id: string, name: string }[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
    const [categories, setCategories] = useState(initialCategories);
    const [newCat, setNewCat] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { adminCategories: t } = useAdminDict();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCat.trim()) return;

        setLoading(true);
        setError('');
        try {
            const added = await addCategory(newCat);
            setCategories([...categories, added]);
            setNewCat('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.confirmDelete)) return;

        try {
            await deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-xl">
            <h2 className="text-xl font-serif font-medium mb-6 text-gray-900">{t.title}</h2>
            
            <form onSubmit={handleAdd} className="flex gap-2 mb-8">
                <Input 
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder={t.placeholder}
                    disabled={loading}
                    className="flex-1"
                />
                <Button type="submit" disabled={loading || !newCat.trim()}>
                    {loading ? '...' : t.add}
                </Button>
            </form>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="space-y-2">
                {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">{t.empty}</p>
                ) : (
                    categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                            <span className="capitalize text-gray-700 font-medium">{cat.name}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
