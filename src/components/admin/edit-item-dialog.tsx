'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudinaryMultiUpload } from './cloudinary-multi-upload';
import { Item, Category } from '@/types/item';
import { useAdminDict } from '@/components/admin/admin-dict-context';

export function EditItemDialog({ item, categories, onClose }: { item: Item, categories: { id: string, name: string }[], onClose: () => void }) {
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg h-[90dvh] sm:h-auto sm:max-h-[90vh] flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="p-5 pb-4 border-b flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-serif font-medium text-gray-900">{t.editTitle}</h2>
                            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-sm font-medium">{t.close}</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
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
                            <label className="text-base sm:text-sm font-medium text-gray-800">{t.titleField}</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="text-base sm:text-sm h-12 sm:h-10" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-base sm:text-sm font-medium text-gray-800">{t.price}</label>
                            <Input type="number" step="0.05" value={price} onChange={(e) => setPrice(e.target.value)} required className="text-base sm:text-sm h-12 sm:h-10" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-base sm:text-sm font-medium text-gray-800">{t.description}</label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-base sm:text-sm min-h-[100px]" />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-base sm:text-sm font-medium text-gray-800">{t.category}</label>
                            <select
                                value={categories.find(c => c.name === category) ? category : (category !== '' ? 'altro' : '')}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                className="flex h-12 sm:h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Seleziona una categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name} className="capitalize">
                                        {cat.name}
                                    </option>
                                ))}
                                <option value="altro">{t.otherCategory}</option>
                            </select>

                            {!categories.find(c => c.name === category) && category !== '' && (
                                <Input
                                    className="mt-2 text-base sm:text-sm h-12 sm:h-10"
                                    value={category === 'altro' ? '' : category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder={t.customCategoryPlaceholder}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-shrink-0 flex justify-end gap-3 p-5 border-t bg-white">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="h-11">{t.cancel}</Button>
                        <Button type="submit" disabled={loading} className="h-11 px-8">
                            {loading ? t.saving : t.save}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
