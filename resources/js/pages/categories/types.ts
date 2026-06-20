export type Category = {
    id: number;
    name: string;
    image_path: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type PageProps = {
    categories: Category[];
};
