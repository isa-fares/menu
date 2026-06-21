/**
 * Hook للحصول على المحتوى الديناميكي (DB) بلغة معينة
 * مختلف عن t() الذي للنصوص الثابتة (JSON)
 */

type WithTranslations = {
    name: string;
    description?: string | null;
    translations?: Array<{
        name?: string;
        description?: string | null;
        language: { code: string };
    }>;
};

export function useContentTranslations() {
    function getName(item: WithTranslations, lang: string): string {
        const trans = item.translations?.find((t) => t.language?.code === lang);
        if (trans?.name) return trans.name;
        return item.name;
    }

    function getDescription(item: WithTranslations, lang: string): string {
        const trans = item.translations?.find((t) => t.language?.code === lang);
        if (trans?.description) return trans.description;
        return item.description ?? '';
    }

    return { getName, getDescription };
}
