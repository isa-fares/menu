export type Locale = {
    code: string;
    name: string;
    native_name: string;
    dir: 'ltr' | 'rtl';
    is_default: boolean;
};

export type Translation = {
    name?: string;
    description?: string | null;
    language: { code: string };
};

export type Product = {
    id: number;
    category_id: number;
    name: string;
    price: string;
    description: string | null;
    calories: number | null;
    image_path: string | null;
    is_active: boolean;
    is_most_ordered: boolean;
    order: number;
    translations: Translation[];
};

export type Category = {
    id: number;
    name: string;
    image_path: string | null;
    order: number;
    translations: Translation[];
    products: Product[];
};

export type Slider = {
    id: number;
    image_path: string;
    order: number;
};

export type HomePageProps = {
    categories: Category[];
    popularMeals: Product[];
    sliders: Slider[];
    enabledLocales: Locale[];
};

export type ProductPageProps = {
    product: Product & { category: Pick<Category, 'id' | 'name'> };
    relatedProducts: Product[];
    enabledLocales: Locale[];
};
