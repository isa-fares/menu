import { useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store as languagesStore } from '@/routes/languages';

type FormData = {
    code: string;
    name: string;
    native_name: string;
    dir: 'ltr' | 'rtl';
    is_active: boolean;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function LanguageFormModal({ open, onOpenChange }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            code: '',
            name: '',
            native_name: '',
            dir: 'ltr',
            is_active: true,
        });

    function handleClose() {
        reset();
        clearErrors();
        onOpenChange(false);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(languagesStore.url(), {
            onSuccess: () => handleClose(),
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Language</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Code */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lang-code">
                            Code <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lang-code"
                            value={data.code}
                            onChange={(e) =>
                                setData('code', e.target.value.toLowerCase().trim())
                            }
                            placeholder="e.g. fr, de, tr"
                            maxLength={10}
                            aria-invalid={Boolean(errors.code)}
                        />
                        <p className="text-xs text-muted-foreground">
                            ISO 639-1 code — lowercase, unique
                        </p>
                        <InputError message={errors.code} />
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lang-name">
                            Name (English) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lang-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. French"
                            aria-invalid={Boolean(errors.name)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Native Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lang-native">
                            Native Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="lang-native"
                            value={data.native_name}
                            onChange={(e) => setData('native_name', e.target.value)}
                            placeholder="e.g. Français"
                            aria-invalid={Boolean(errors.native_name)}
                        />
                        <InputError message={errors.native_name} />
                    </div>

                    {/* Direction */}
                    <div className="space-y-1.5">
                        <Label htmlFor="lang-dir">
                            Direction <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.dir}
                            onValueChange={(v) => setData('dir', v as 'ltr' | 'rtl')}
                        >
                            <SelectTrigger id="lang-dir" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ltr">LTR — Left to Right</SelectItem>
                                <SelectItem value="rtl">RTL — Right to Left</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.dir} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving…' : 'Add Language'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
