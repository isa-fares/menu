import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('navigate', (event) => {
            const page = (event as CustomEvent).detail?.page;
            const data = page?.props?.flash?.toast as FlashToast | undefined;

            if (!data) return;

            toast[data.type](data.message);
        });
    }, []);
}
