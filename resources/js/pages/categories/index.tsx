import { Head, router } from '@inertiajs/react';
import { ImageIcon, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { dashboard } from '@/routes';
import { destroy as categoriesDestroy, index as categoriesRoute, update as categoriesUpdate } from '@/routes/categories';

import { CategoryFormModal } from './partials/category-form-modal';
import type { Category, PageProps } from './types';

export default function CategoriesIndex({ categories, translatable_languages }: PageProps) {
    const { t } = useTranslation();

    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Category | undefined>(undefined);
    const [deleting, setDeleting] = useState(false);

    function openAdd() {
        setEditTarget(undefined);
        setFormOpen(true);
    }

    function openEdit(category: Category) {
        setEditTarget(category);
        setFormOpen(true);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(categoriesDestroy.url(deleteTarget.id), {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(undefined);
            },
        });
    }

    function toggleActive(category: Category) {
        router.post(
            categoriesUpdate.url(category.id),
            { _method: 'PUT', name: category.name, is_active: !category.is_active, order: category.order },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        category.is_active
                            ? t('categories.deactivated')
                            : t('categories.activated'),
                    ),
            },
        );
    }

    const columns: Column<Category>[] = [
        {
            key: 'order',
            header: t('common.order'),
            className: 'w-12 text-center',
            render: (row) => (
                <span className="font-mono text-muted-foreground">{row.order}</span>
            ),
        },
        {
            key: 'image_path',
            header: t('common.image'),
            className: 'w-16',
            render: (row) =>
                row.image_path ? (
                    <img
                        src={`/storage/${row.image_path}`}
                        alt={row.name}
                        className="size-10 rounded-md object-cover"
                    />
                ) : (
                    <div className="flex size-10 items-center justify-center rounded-md border border-dashed border-border bg-muted">
                        <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                ),
        },
        {
            key: 'name',
            header: t('common.name'),
            render: (row) => <span className="font-medium">{row.name}</span>,
        },
        {
            key: 'is_active',
            header: t('common.status'),
            className: 'w-24',
            render: (row) => (
                <Switch
                    checked={row.is_active}
                    onCheckedChange={() => toggleActive(row)}
                    aria-label={`Toggle ${row.name} status`}
                />
            ),
        },
        {
            key: 'actions',
            header: t('common.actions'),
            className: 'w-24 text-right',
            render: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(row)}
                        aria-label={`${t('common.edit')} ${row.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(row)}
                        aria-label={`${t('common.delete')} ${row.name}`}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title={t('categories.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title={t('categories.title')}
                        description={t('categories.description')}
                    />
                    <Button onClick={openAdd} size="sm">
                        <PlusIcon />
                        {t('categories.add')}
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={categories}
                    emptyMessage={t('categories.empty')}
                />
            </div>

            <CategoryFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                category={editTarget}
                languages={translatable_languages}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(undefined)}
                title={t('categories.deleteTitle')}
                description={t('categories.deleteConfirm', { name: deleteTarget?.name })}
                confirmLabel={t('common.delete')}
                cancelLabel={t('common.cancel')}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Categories', href: categoriesRoute() },
    ],
};
