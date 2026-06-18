import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Column<T> = {
    key: string;
    header: string;
    className?: string;
    render?: (row: T) => ReactNode;
};

type DataTableProps<T extends { id: number }> = {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
    className?: string;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DataTable<T extends { id: number }>({
    columns,
    data,
    emptyMessage = 'No records found.',
    className,
}: DataTableProps<T>) {
    return (
        <div className={cn('overflow-hidden rounded-lg border border-border', className)}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground',
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-12 text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={row.id}
                                className={cn(
                                    'border-b border-border transition-colors hover:bg-muted/30',
                                    index === data.length - 1 && 'border-b-0',
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cn('px-4 py-3 align-middle', col.className)}
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : String((row as Record<string, unknown>)[col.key] ?? '—')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
