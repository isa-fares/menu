import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import i18n from '@/i18n';
import { useFlashToast } from '@/hooks/use-flash-toast';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

type SharedProps = {
    locale: string;
};

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    useFlashToast();

    const { locale } = usePage<SharedProps>().props;

    // مزامنة لغة i18n مع اللغة القادمة من السيرفر
    useEffect(() => {
        if (locale && i18n.language !== locale) {
            void i18n.changeLanguage(locale);
        }
        // ضبط اتجاه الصفحة — لوحة التحكم LTR دائماً
        document.documentElement.lang = locale ?? 'ar';
        document.documentElement.dir = 'ltr';
    }, [locale]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
