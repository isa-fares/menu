import { Head, router } from '@inertiajs/react';
import { ImageIcon, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { dashboard } from '@/routes';
import { destroy as productsDestroy, index as productsRoute, update as productsUpdate } from '@/routes/products';

import { ProductFormModal } from './partials/product-form-modal';
import type { Category, PageProps, Product } from './types';

export default function ProductsIndex({ products, categories }: PageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Product | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Product | undefined>(undefined);
    const [deleting, setDeleting] = useState(false);

    function openAdd() {
        setEditTarget(undefined);
        setFormOpen(true);
    }

    function openEdit(product: Product) {
        setEditTarget(product);
        setFormOpen(true);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(productsDestroy.url(deleteTarget.id), {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(undefined);
            },
        });
    }

    function toggleActive(product: Product) {
        router.post(
            productsUpdate.url(product.id),
            {
                _method: 'PUT',
                category_id: product.category_id,
                name: product.name,
                price: product.price,
                is_active: !product.is_active,
                is_most_ordered: product.is_most_ordered,
                order: product.order,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        product.is_active ? 'Product deactivated' : 'Product activated',
                    ),
            },
        );
    }

    function toggleMostOrdered(product: Product) {
        router.post(
            productsUpdate.url(product.id),
            {
                _method: 'PUT',
                category_id: product.category_id,
                name: product.name,
                price: product.price,
                is_active: product.is_active,
                is_most_ordered: !product.is_most_ordered,
                order: product.order,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        product.is_most_ordered ? 'Removed from popular' : 'Marked as popular',
                    ),
            },
        );
    }

    const columns: Column<Product>[] = [
        {
            key: 'image_path',
            header: 'Image',
            className: 'w-16',
            render: (row) =>
                row.image_path ? (
                    <img src={`/storage/${row.image_path}`} alt={row.name} className="size-10 rounded-md object-cover" />
                ) : (
                    <div className="flex size-10 items-center justify-center rounded-md border border-dashed border-border bg-muted">
                        <ImageIcon className="size-4 text-muted-foreground" />
                    </div>
                ),
        },
        {
            key: 'name',
            header: 'Name',
            render: (row) => (
                <div>
                    <p className="font-medium">{row.name}</p>
                    {row.description && (
                        <p className="line-clamp-1 text-xs text-muted-foreground">{row.description}</p>
                    )}
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            className: 'w-32',
            render: (row) => (
                <Badge variant="outline">{row.category.name}</Badge>
            ),
        },
        {
            key: 'price',
            header: 'Price',
            className: 'w-24',
            render: (row) => <span className="font-mono">{row.price}</span>,
        },
        {
            key: 'is_most_ordered',
            header: 'Popular',
            className: 'w-20',
            render: (row) => (
                <Switch
                    checked={row.is_most_ordered}
                    onCheckedChange={() => toggleMostOrdered(row)}
                    aria-label={`Toggle ${row.name} popular status`}
                />
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            className: 'w-20',
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
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`}>
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
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading variant="small" title="Products" description="Manage meals and pricing" />
                    <Button onClick={openAdd} size="sm">
                        <PlusIcon />
                        Add Product
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={products}
                    emptyMessage="No products yet. Click 'Add Product' to create one."
                />
            </div>

            <ProductFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                product={editTarget}
                categories={categories}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(undefined)}
                title="Delete Product"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Products', href: productsRoute() },
    ],
};
