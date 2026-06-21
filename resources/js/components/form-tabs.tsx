import { cn } from '@/lib/utils';

type Tab = {
    key: string;
    label: string;
    hasError?: boolean;
};

type Props = {
    tabs: Tab[];
    active: string;
    onChange: (key: string) => void;
    className?: string;
};

/**
 * تبويبات بسيطة لاستخدامها داخل الـ forms
 * tab نشط: خط تحته + لون primary
 * tab فيه خطأ: نقطة حمراء صغيرة
 */
export function FormTabs({ tabs, active, onChange, className }: Props) {
    return (
        <div className={cn('flex border-b border-border', className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={() => onChange(tab.key)}
                    className={cn(
                        'relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
                        active === tab.key
                            ? 'border-b-2 border-primary text-foreground -mb-px'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {tab.label}
                    {tab.hasError && (
                        <span className="size-1.5 rounded-full bg-destructive" />
                    )}
                </button>
            ))}
        </div>
    );
}
