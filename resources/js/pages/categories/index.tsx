import { Head, router } from '@inertiajs/react';
import { ImageIcon, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { dashboard } from '@/routes';
import { categories as categoriesRoute } from '@/routes/app';
import { destroy as categoriesDestroy, update as categoriesUpdate } from '@/routes/categories';

import { CategoryFormModal } from './partials/category-form-modal';
import type { Category, PageProps } from './types';

export default function CategoriesIndex({ categories }: PageProps) {
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
            { preserveScroll: true },
        );
    }

    const columns: Column<Category>[] = [
        {
            key: 'order',
            header: '#',
            className: 'w-12 text-center',
            render: (row) => (
                <span className="font-mono text-muted-foreground">{row.order}</span>
            ),
        },
        {
            key: 'image_path',
            header: 'Image',
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
            header: 'Name',
            render: (row) => <span className="font-medium">{row.name}</span>,
        },
        {
            key: 'is_active',
            header: 'Status',
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
            header: 'Actions',
            className: 'w-24 text-right',
            render: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(row)}
                        aria-label={`Edit ${row.name}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(row)}
                        aria-label={`Delete ${row.name}`}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Categories"
                        description="Manage product categories"
                    />
                    <Button onClick={openAdd} size="sm">
                        <PlusIcon />
                        Add Category
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={categories}
                    emptyMessage="No categories yet. Click 'Add Category' to create one."
                />
            </div>

            <CategoryFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                category={editTarget}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(undefined)}
                title="Delete Category"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
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
