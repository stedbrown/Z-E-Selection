'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudinaryMultiUpload } from './cloudinary-multi-upload';
import { Item, Category } from '@/types/item';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function EditItemDialog({ item, onClose }: { item: Item, onClose: () => void }) {
    const router = useRouter();
    const { adminForm: t } = useAdminDict();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [imageUrl, setImageUrl] = useState(item.image_url);
    const [extraImages, setExtraImages] = useState<string[]>(item.extra_images || []);
    const [title, setTitle] = useState(item.title);
    const [description, setDescription] = useState(item.description || '');
    const [price, setPrice] = useState(item.price.toString());
    const [category, setCategory] = useState<Category>(item.category);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl || !title || !price) {
            setError(t.requiredError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/items/${item.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl,
                    extra_images: extraImages,
                    title,
                    description,
                    price: parseFloat(price),
                    category
                }),
            });

            if (!res.ok) throw new Error(t.saveError);

            router.refresh(); 
            onClose();
        } catch (err: any) {
            setError(err.message || 'Qualcosa è andato storto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-xl font-serif font-medium text-gray-900">{t.editTitle}</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">{t.close}</button>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <CloudinaryMultiUpload
                                primaryUrl={imageUrl}
                                onPrimaryChange={setImageUrl}
                                extraUrls={extraImages}
                                onExtraChange={setExtraImages}
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">{t.titleField}</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">{t.price}</label>
                            <Input type="number" step="0.05" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">{t.description}</label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium text-gray-700">{t.category}</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <button type="button" onClick={() => setCategory('antiquariato' as Category)} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === 'antiquariato' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Antiquariato</button>
                                <button type="button" onClick={() => setCategory('usato' as Category)} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === 'usato' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Usato</button>
                                <button type="button" onClick={() => setCategory('oggettistica' as Category)} className={`px-4 py-2 rounded-full text-sm transition-colors ${category === 'oggettistica' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Oggettistica</button>
                                <button type="button" onClick={() => setCategory('altro' as Category)} className={`px-4 py-2 rounded-full text-sm transition-colors ${!['antiquariato','usato','oggettistica'].includes(category) ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
                                    {t.otherCategory}
                                </button>
                            </div>
                            {!['antiquariato','usato','oggettistica'].includes(category) && (
                                <Input value={category === 'altro' ? '' : category} onChange={(e) => setCategory(e.target.value)} placeholder={t.customCategoryPlaceholder} required />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>{t.cancel}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t.saving : t.save}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
