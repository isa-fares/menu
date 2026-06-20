export type Category = {
    id: number;
    name: string;
};

export type Product = {
    id: number;
    category_id: number;
    category: Category;
    name: string;
    price: string;
    description: string | null;
    calories: number | null;
    image_path: string | null;
    is_active: boolean;
    is_most_ordered: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type PageProps = {
    products: Product[];
    categories: Category[];
};
