export type Language = {
    id: number;
    code: string;
    name: string;
    native_name: string;
    dir: 'ltr' | 'rtl';
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
};

export type PageProps = {
    languages: Language[];
};
