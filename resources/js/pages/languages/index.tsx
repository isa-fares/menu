import { Head, router } from '@inertiajs/react';
import { Globe, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { dashboard } from '@/routes';
import {
    destroy as languagesDestroy,
    index as languagesRoute,
} from '@/routes/languages';

import { LanguageFormModal } from './partials/language-form-modal';
import type { Language, PageProps } from './types';

// URL يدوي لـ PATCH لأن الـ wayfinder لا يولّدها تلقائياً
const toggleActiveUrl = (id: number) => `/languages/${id}/toggle-active`;
const makeDefaultUrl  = (id: number) => `/languages/${id}/make-default`;

export default function LanguagesIndex({ languages }: PageProps) {
    const [formOpen, setFormOpen]       = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Language | undefined>(undefined);
    const [deleting, setDeleting]       = useState(false);

    function handleToggleActive(language: Language) {
        if (language.is_default) {
            toast.error('Cannot deactivate the default language');
            return;
        }
        router.patch(
            toggleActiveUrl(language.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        language.is_active
                            ? `${language.native_name} deactivated`
                            : `${language.native_name} activated`,
                    ),
            },
        );
    }

    function handleMakeDefault(language: Language) {
        if (language.is_default) return;
        router.patch(
            makeDefaultUrl(language.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(`${language.native_name} is now the default language`),
            },
        );
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(languagesDestroy.url(deleteTarget.id), {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(undefined);
            },
        });
    }

    const columns: Column<Language>[] = [
        {
            key: 'code',
            header: 'Code',
            className: 'w-16',
            render: (row) => (
                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs uppercase">
                    {row.code}
                </span>
            ),
        },
        {
            key: 'name',
            header: 'Language',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <Globe className="size-4 text-muted-foreground" />
                    <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.native_name}</p>
                    </div>
                    {row.is_default && (
                        <Badge variant="default" className="ml-1 text-xs">
                            Default
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'dir',
            header: 'Direction',
            className: 'w-24',
            render: (row) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {row.dir.toUpperCase()}
                </Badge>
            ),
        },
        {
            key: 'is_active',
            header: 'Active',
            className: 'w-20',
            render: (row) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Switch
                                checked={row.is_active}
                                onCheckedChange={() => handleToggleActive(row)}
                                disabled={row.is_default}
                                aria-label={`Toggle ${row.name} active`}
                            />
                        </span>
                    </TooltipTrigger>
                    {row.is_default && (
                        <TooltipContent>Default language is always active</TooltipContent>
                    )}
                </Tooltip>
            ),
        },
        {
            key: 'is_default',
            header: 'Default',
            className: 'w-20',
            render: (row) => (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Switch
                                checked={row.is_default}
                                onCheckedChange={() => handleMakeDefault(row)}
                                disabled={row.is_default}
                                aria-label={`Make ${row.name} default`}
                            />
                        </span>
                    </TooltipTrigger>
                    {row.is_default
                        ? <TooltipContent>Already the default language</TooltipContent>
                        : <TooltipContent>Set as default</TooltipContent>
                    }
                </Tooltip>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            className: 'w-20 text-right',
            render: (row) => (
                <div className="flex items-center justify-end gap-1">
                    {!row.is_default ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => setDeleteTarget(row)}
                                    aria-label={`Delete ${row.name}`}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete language</TooltipContent>
                        </Tooltip>
                    ) : (
                        <span className="text-xs text-muted-foreground">Protected</span>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Languages" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Languages"
                        description="Manage application languages"
                    />
                    <Button onClick={() => setFormOpen(true)} size="sm">
                        <PlusIcon />
                        Add Language
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={languages}
                    emptyMessage="No languages found."
                />
            </div>

            <LanguageFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(undefined)}
                title="Delete Language"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? All translations for this language will also be deleted.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}

LanguagesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Languages', href: languagesRoute() },
    ],
};
