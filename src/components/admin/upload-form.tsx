'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudinaryMultiUpload } from './cloudinary-multi-upload';
import { Category } from '@/types/item';
import { useAdminDict } from '@/components/admin/admin-dict-context';
import { CheckCircle } from 'lucide-react';

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
    const [success, setSuccess] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to top of this component when success state activates
    useEffect(() => {
        if (success && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [success]);

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

            setSuccess(true);
            router.refresh(); // Refresh page to see new item in the list
        } catch (err: any) {
            setError(err.message || 'Qualcosa è andato storto.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div ref={topRef} className="flex flex-col items-center justify-center py-16 px-6 w-full bg-white rounded-2xl shadow-sm border border-green-100 text-center space-y-4">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-serif text-gray-900 tracking-tight">Cimelio Aggiunto!</h2>
                <p className="text-gray-600 pb-6 text-base leading-relaxed">
                    Il nuovo oggetto è stato salvato nel database ed è ora visibile nel catalogo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                    <Button type="button" className="flex-1 h-12 text-base rounded-xl font-medium" onClick={() => {
                        setSuccess(false);
                        setImageUrl('');
                        setExtraImages([]);
                        setTitle('');
                        setDescription('');
                        setPrice('');
                    }}>Aggiungi Nuovo</Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
            <div className="w-full">
                <h2 className="text-2xl font-serif font-medium mb-1 text-gray-900">{t.addTitle}</h2>
                <p className="text-sm text-gray-500 mb-6">Inserisci le informazioni del nuovo oggetto per pubblicarlo nel catalogo.</p>
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4 text-sm w-full break-words">{error}</div>}
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
                    <label htmlFor="title" className="text-base sm:text-sm font-medium text-gray-800">{t.titleField}</label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Vaso di ceramica..."
                        className="text-base sm:text-sm h-12 sm:h-10"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="price" className="text-base sm:text-sm font-medium text-gray-800">{t.price}</label>
                    <Input
                        id="price"
                        type="number"
                        step="0.05"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="49.90"
                        className="text-base sm:text-sm h-12 sm:h-10"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="description" className="text-base sm:text-sm font-medium text-gray-800">{t.description}</label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Dettagli sulle condizioni, epoca, materiali..."
                        className="text-base sm:text-sm min-h-[100px]"
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-base sm:text-sm font-medium text-gray-800">{t.category}</label>
                    <select
                        id="category"
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
                        <option value="altro">+ Aggiungi nuova categoria</option>
                    </select>

                    {!categories.find(c => c.name === category) && category !== '' && (
                        <Input
                            className="mt-2 text-base sm:text-sm h-12 sm:h-10"
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
