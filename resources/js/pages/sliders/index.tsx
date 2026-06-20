import { Head, router } from '@inertiajs/react';
import { ImageIcon, Pencil, PlusIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable, type Column } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { dashboard } from '@/routes';
import { destroy as slidersDestroy, index as slidersRoute, update as slidersUpdate } from '@/routes/sliders';

import { SliderFormModal } from './partials/slider-form-modal';
import type { PageProps, Slider } from './types';

export default function SlidersIndex({ sliders }: PageProps) {
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Slider | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<Slider | undefined>(undefined);
    const [deleting, setDeleting] = useState(false);

    function openAdd() {
        setEditTarget(undefined);
        setFormOpen(true);
    }

    function openEdit(slider: Slider) {
        setEditTarget(slider);
        setFormOpen(true);
    }

    function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(slidersDestroy.url(deleteTarget.id), {
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(undefined);
            },
        });
    }

    function toggleActive(slider: Slider) {
        router.post(
            slidersUpdate.url(slider.id),
            { _method: 'PUT', is_active: !slider.is_active, order: slider.order },
            {
                preserveScroll: true,
                onSuccess: () =>
                    toast.success(
                        slider.is_active ? 'Slider deactivated' : 'Slider activated',
                    ),
            },
        );
    }

    const columns: Column<Slider>[] = [
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
            render: (row) => (
                <img
                    src={`/storage/${row.image_path}`}
                    alt={`Slider ${row.id}`}
                    className="h-14 w-28 rounded-md object-cover"
                />
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            className: 'w-24',
            render: (row) => (
                <Switch
                    checked={row.is_active}
                    onCheckedChange={() => toggleActive(row)}
                    aria-label={`Toggle slider ${row.id} status`}
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
                        aria-label={`Edit slider ${row.id}`}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteTarget(row)}
                        aria-label={`Delete slider ${row.id}`}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Sliders" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Sliders"
                        description="Manage offers and slider banners"
                    />
                    <Button onClick={openAdd} size="sm">
                        <PlusIcon />
                        Add Slider
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={sliders}
                    emptyMessage="No sliders yet. Click 'Add Slider' to create one."
                />
            </div>

            <SliderFormModal
                open={formOpen}
                onOpenChange={setFormOpen}
                slider={editTarget}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(undefined)}
                title="Delete Slider"
                description={`Are you sure you want to delete this slider? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                loading={deleting}
            />
        </>
    );
}

SlidersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Sliders', href: slidersRoute() },
    ],
};
