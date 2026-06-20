export type Slider = {
    id: number;
    image_path: string;   // string وليس string | null
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type PageProps = {
    sliders: Slider[];
};
