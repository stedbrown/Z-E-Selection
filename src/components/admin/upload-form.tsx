'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudinaryMultiUpload } from './cloudinary-multi-upload';
import { Category } from '@/types/item';
import { useAdminDict } from '@/components/admin/admin-dict-context';

interface UploadFormProps {
    categories: { id: string, name: string }[];
}

export function UploadForm({ categories }: UploadFormProps) {
    const router = useRouter();
    const { adminForm: t } = useAdminDict();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [imageUrl, setImageUrl] = useState('');
    const [extraImages, setExtraImages] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<Category>('antiquariato');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl || !title || !price) {
            setError(t.requiredError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formMetadata = new FormData();
            formMetadata.append('imageUrl', imageUrl);
            formMetadata.append('title', title);
            formMetadata.append('description', description);
            formMetadata.append('price', price.toString());
            formMetadata.append('category', category);
            formMetadata.append('extraImages', JSON.stringify(extraImages));

            const res = await fetch('/api/admin/items', {
                method: 'POST',
                body: formMetadata,
            });

            if (!res.ok) throw new Error(t.saveError);

            // Reset form on success
            setImageUrl('');
            setExtraImages([]);
            setTitle('');
            setDescription('');
            setPrice('');
            router.refresh(); // Refresh page to see new item in the list
        } catch (err: any) {
            setError(err.message || 'Qualcosa è andato storto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div>
                <h2 className="text-xl font-serif font-medium mb-4 text-gray-900">{t.addTitle}</h2>
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-md mb-4 text-sm">{error}</div>}
            </div>

            <div className="space-y-2">
                <CloudinaryMultiUpload
                    primaryUrl={imageUrl}
                    onPrimaryChange={setImageUrl}
                    extraUrls={extraImages}
                    onExtraChange={setExtraImages}
                />
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">{t.titleField}</label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Vaso di ceramica..."
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium text-gray-700">{t.price}</label>
                    <Input
                        id="price"
                        type="number"
                        step="0.05"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="49.90"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">{t.description}</label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Dettagli sulle condizioni, epoca, materiali..."
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">{t.category}</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.name)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.name
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="capitalize">{cat.name}</span>
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setCategory('altro')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categories.find(c => c.name === category) && category !== ''
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t.otherCategory}
                        </button>
                    </div>
                    {!categories.find(c => c.name === category) && (
                        <Input
                            placeholder={t.customCategoryPlaceholder}
                            value={category === 'altro' ? '' : category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    )}
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                {loading ? t.publishing : t.publish}
            </Button>
        </form>
    );
}
