import { Head, router, useForm } from '@inertiajs/react';
import { ImageIcon, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categories as categoriesRoute, dashboard } from '@/routes';
import { store as categoriesStore, update as categoriesUpdate, destroy as categoriesDestroy } from '@/routes/categories';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Category = {
    id: number;
    name: string;
    image_path: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    categories: Category[];
};

// ─── Category Form Modal ──────────────────────────────────────────────────────

type CategoryFormData = {
    name: string;
    image_path: File | null;
    is_active: boolean;
    order: number;
};

type CategoryFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category;
};

function CategoryFormModal({ open, onOpenChange, category }: CategoryFormModalProps) {
    const isEditing = Boolean(category);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<CategoryFormData>({
            name: category?.name ?? '',
            image_path: null,
            is_active: category?.is_active ?? true,
            order: category?.order ?? 0,
        });

    function handleClose() {
        reset();
        clearErrors();
        setImagePreview(null);
        onOpenChange(false);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('image_path', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (isEditing) {
            router.post(categoriesUpdate.url(category!.id), {
                ...data,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onSuccess: () => handleClose(),
            });
        } else {
            post(categoriesStore.url(), {
                forceFormData: true,
                onSuccess: () => handleClose(),
            });
        }
    }

    const existingImage = category?.image_path
        ? `/storage/${category.image_path}`
        : null;

    const previewSrc = imagePreview ?? existingImage;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-name">Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="cat-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Burgers"
                            aria-invalid={Boolean(errors.name)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Image */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-image">Image</Label>
                        <div className="flex items-start gap-3">
                            {/* Preview box */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted transition-colors hover:bg-muted/70"
                            >
                                {previewSrc ? (
                                    <img
                                        src={previewSrc}
                                        alt="Preview"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="size-6 text-muted-foreground" />
                                )}
                            </button>
                            <div className="flex-1 space-y-1">
                                <Input
                                    id="cat-image"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                    aria-invalid={Boolean(errors.image_path)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG or WebP · max 2 MB
                                </p>
                                <InputError message={errors.image_path} />
                            </div>
                        </div>
                    </div>

                    {/* Order */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cat-order">Display Order</Label>
                        <Input
                            id="cat-order"
                            type="number"
                            min={0}
                            value={data.order}
                            onChange={(e) => setData('order', Number(e.target.value))}
                            aria-invalid={Boolean(errors.order)}
                        />
                        <InputError message={errors.order} />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="cat-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label htmlFor="cat-active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Categories({ categories }: PageProps) {
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

    const columns: Column<Category>[] = [
        {
            key: 'order',
            header: '#',
            className: 'w-12 text-center',
            render: (row) => <span className="font-mono text-muted-foreground">{row.order}</span>,
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
            render: (row) =>
                row.is_active ? (
                    <Badge variant="default">Active</Badge>
                ) : (
                    <Badge variant="secondary">Inactive</Badge>
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
                {/* Header row */}
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

                {/* Table */}
                <DataTable
                    columns={columns}
                    data={categories}
                    emptyMessage="No categories yet. Click 'Add Category' to create one."
                />
            </div>

            {/* Add / Edit Modal */}
            <CategoryFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                category={editTarget}
            />

            {/* Delete Confirm */}
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

Categories.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Categories', href: categoriesRoute() },
    ],
};
