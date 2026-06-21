export type TranslatableLanguage = {
    id: number;
    code: string;
    name: string;
    native_name: string;
};

export type CategoryTranslation = {
    id: number;
    language_id: number;
    name: string;
    language: { code: string };
};

export type Category = {
    id: number;
    name: string;
    image_path: string | null;
    is_active: boolean;
    order: number;
    translations: CategoryTranslation[];
    created_at: string;
    updated_at: string;
};

export type PageProps = {
    categories: Category[];
    translatable_languages: TranslatableLanguage[];
};
