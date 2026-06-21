const CURRENCY_MAP: Record<string, string> = {
    TRY: 'TL',
    USD: '$',
    EUR: '€',
    SAR: 'SAR',
    AED: 'AED',
    KWD: 'KWD',
    SYP: 'SYP',
};

export function useCurrency(code?: string): string {
    if (!code) return 'TL';
    return CURRENCY_MAP[code.toUpperCase()] ?? code;
}
