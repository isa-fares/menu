import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import { index as translationsRoute } from '@/routes/translations';

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = {
    id: number;
    code: string;
    name: string;
    native_name: string;
    is_default: boolean;
};

type Entry = {
    key: string;
    default_value: string;
    value: string;
};

type PageProps = {
    languages: Language[];
    selected_code: string;
    entries: Entry[];
};

// ─── Entry Row ───────────────────────────────────────────────────────────────

function EntryRow({
    entry,
    isDefault,
    onChange,
}: {
    entry: Entry;
    isDefault: boolean;
    onChange: (key: string, value: string) => void;
}) {
    // استخرج اسم المجموعة والمفتاح
    const parts = entry.key.split('.');
    const group = parts.length > 1 ? parts[0] : '';
    const label = parts.slice(1).join('.') || parts[0];

    return (
        <div className="grid grid-cols-[1fr_1fr] gap-4 border-b border-border py-3 last:border-0">
            {/* المفتاح + القيمة المرجعية */}
            <div className="space-y-1">
                <p className="font-mono text-xs text-muted-foreground">
                    {group && (
                        <span className="mr-1 rounded bg-muted px-1.5 py-0.5 text-[10px]">
                            {group}
                        </span>
                    )}
                    {label}
                </p>
                {/* اللغة المرجعية للمقارنة — تظهر فقط إذا لم تكن نفس اللغة */}
                {!isDefault && (
                    <p className="text-sm text-muted-foreground/70 italic">
                        {entry.default_value}
                    </p>
                )}
            </div>

            {/* حقل التعديل */}
            <Input
                value={entry.value}
                onChange={(e) => onChange(entry.key, e.target.value)}
                placeholder={isDefault ? '' : entry.default_value}
                dir="auto"
                className="h-8 text-sm"
            />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TranslationsIndex({
    languages,
    selected_code,
    entries,
}: PageProps) {
    const [search, setSearch] = useState('');
    const [localEntries, setLocalEntries] = useState<Entry[]>(entries);
    const [saving, setSaving] = useState(false);

    const selectedLang = languages.find((l) => l.code === selected_code);
    const isDefault = selectedLang?.is_default ?? false;

    // تحديث الـ entries عند تغيير اللغة من الـ props
    // (Inertia يُحدِّث الـ props تلقائياً عند navigate)
    useMemo(() => {
        setLocalEntries(entries);
        setSearch('');
    }, [selected_code]);

    // تجميع المفاتيح حسب المجموعة
    const groups = useMemo(() => {
        const filtered = localEntries.filter(
            (e) =>
                search === '' ||
                e.key.toLowerCase().includes(search.toLowerCase()) ||
                e.value.toLowerCase().includes(search.toLowerCase()) ||
                e.default_value.toLowerCase().includes(search.toLowerCase()),
        );

        const map: Record<string, Entry[]> = {};
        for (const entry of filtered) {
            const group = entry.key.split('.')[0] ?? 'other';
            if (!map[group]) map[group] = [];
            map[group].push(entry);
        }
        return map;
    }, [localEntries, search]);

    function handleChange(key: string, value: string) {
        setLocalEntries((prev) =>
            prev.map((e) => (e.key === key ? { ...e, value } : e)),
        );
    }

    function handleSave() {
        setSaving(true);
        router.put(
            '/translations',
            { code: selected_code, entries: localEntries },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Translations saved successfully'),
                onError: () => toast.error('Failed to save translations'),
                onFinish: () => setSaving(false),
            },
        );
    }

    function switchLanguage(code: string) {
        router.get(
            translationsRoute.url({ query: { lang: code } }),
            {},
            { preserveScroll: true },
        );
    }

    const totalKeys    = localEntries.length;
    const emptyKeys    = localEntries.filter((e) => !e.value.trim()).length;
    const filledPercent = totalKeys > 0
        ? Math.round(((totalKeys - emptyKeys) / totalKeys) * 100)
        : 0;

    return (
        <>
            <Head title="Translations" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        variant="small"
                        title="UI Translations"
                        description="Edit static interface text for each language"
                    />
                    <Button onClick={handleSave} disabled={saving} size="sm">
                        <Save className="size-4" />
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </div>

                {/* Language Tabs */}
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            className={[
                                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                                lang.code === selected_code
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/70',
                            ].join(' ')}
                        >
                            {lang.native_name}
                            {lang.is_default && (
                                <span className="ml-1.5 text-[10px] opacity-70">
                                    (default)
                                </span>
                            )}
                        </button>
                    ))}

                    {/* مؤشر الاكتمال */}
                    <div className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${filledPercent}%` }}
                            />
                        </div>
                        <span>
                            {totalKeys - emptyKeys}/{totalKeys} keys filled
                        </span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search keys or values…"
                        className="pl-9"
                    />
                </div>

                {/* Groups */}
                <div className="space-y-6">
                    {Object.entries(groups).map(([group, groupEntries]) => (
                        <div
                            key={group}
                            className="overflow-hidden rounded-lg border border-border"
                        >
                            {/* Group Header */}
                            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
                                <span className="font-mono text-sm font-semibold capitalize">
                                    {group}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {groupEntries.length} keys
                                </span>
                            </div>

                            {/* Column Headers */}
                            <div className="grid grid-cols-[1fr_1fr] gap-4 border-b border-border bg-muted/20 px-4 py-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Key{!isDefault && ' · Reference (default)'}
                                </p>
                                <p className="text-xs font-medium text-muted-foreground">
                                    {selectedLang?.native_name ?? selected_code}
                                </p>
                            </div>

                            {/* Entries */}
                            <div className="px-4">
                                {groupEntries.map((entry) => (
                                    <EntryRow
                                        key={entry.key}
                                        entry={entry}
                                        isDefault={isDefault}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {Object.keys(groups).length === 0 && (
                        <p className="py-12 text-center text-muted-foreground">
                            No keys match your search.
                        </p>
                    )}
                </div>

                {/* Footer Save */}
                {Object.keys(groups).length > 0 && (
                    <div className="flex justify-end border-t border-border pt-4">
                        <Button onClick={handleSave} disabled={saving}>
                            <Save className="size-4" />
                            {saving ? 'Saving…' : 'Save All Changes'}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

TranslationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Translations', href: '/translations' },
    ],
};
