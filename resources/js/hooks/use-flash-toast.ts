import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type PageProps = {
    flash?: {
        toast?: FlashToast;
    };
};

export function useFlashToast(): void {
    const { flash } = usePage<PageProps>().props;

    const lastMessageRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash?.toast) return;

        const { type, message } = flash.toast;

        if (lastMessageRef.current === message) return;
        lastMessageRef.current = message;

        toast[type](message);
    }, [flash?.toast]);
}
