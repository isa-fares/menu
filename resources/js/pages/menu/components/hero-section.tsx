import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../types';

type Props = {
    backgroundImage?: string | null;
    locales: Locale[];
    onSwitchLocale: (code: string) => void;
};

export function HeroSection({ backgroundImage, locales, onSwitchLocale }: Props) {
    const { i18n } = useTranslation();
    const current = locales.find((l) => l.code === i18n.language);
    const other   = locales.find((l) => l.code !== i18n.language);

    const bg = backgroundImage
        ? `/storage/${backgroundImage}`
        : '/images/hero.webp';

    return (
        <div
            className="relative h-[220px] w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${bg}')` }}
        >
            <div className="absolute inset-0 bg-black/30" />

            {/* زر تغيير اللغة */}
            {locales.length > 1 && (
                <button
                    onClick={() => other && onSwitchLocale(other.code)}
                    className="absolute end-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow backdrop-blur-sm transition hover:bg-white"
                >
                    <Globe className="size-4 text-[var(--menu-main)]" />
                    {current?.native_name}
                </button>
            )}
        </div>
    );
}
