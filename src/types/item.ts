export type Category = 'antiquariato' | 'usato' | 'oggettistica' | string;

export interface Translations {
    [lang: string]: {
        title: string;
        description: string;
        category?: string;
    }
}

export interface Item {
    id: string;
    created_at: string;
    title: string;
    description: string;
    price: number;
    category: Category;
    image_url: string;
    extra_images?: string[];
    translations: Translations;
    is_sold: boolean;
    created_by?: string;
    creator_email?: string;
}

export interface ItemEdit {
    id: string;
    item_id: string;
    edited_by: string;
    edited_at: string;
    changes: any;
    editor_email?: string;
}
