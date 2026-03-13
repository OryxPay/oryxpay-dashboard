/**
 * Formatação de valores monetários. A aplicação utiliza centavos internamente na API.
 * Use formatFromCents para exibir valores retornados em centavos.
 */
export const useFormatCurrency = () => {
    const formatFromCents = (cents: number | null | undefined): string => {
        if (cents === null || cents === undefined || isNaN(cents)) {
            return 'R$ 0,00';
        }
        return (cents / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatFromReais = (reais: number | string | null | undefined): string => {
        if (reais === null || reais === undefined) {
            return 'R$ 0,00';
        }
        const n = typeof reais === 'string' ? parseFloat(reais) : reais;
        if (isNaN(n)) return 'R$ 0,00';
        return n.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    /** Exibe valor: amount é sempre em centavos (padrão da API). */
    const formatAmount = (item: { amount?: number | string; amount_cents?: number } | null | undefined): string => {
        if (!item) return 'R$ 0,00';
        const cents = item.amount ?? item.amount_cents;
        return cents != null ? formatFromCents(Number(cents)) : 'R$ 0,00';
    };

    return { formatFromCents, formatFromReais, formatAmount };
};
