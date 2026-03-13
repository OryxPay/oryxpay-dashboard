export interface Payment {
    id: number;
    tx_id: string;
    user_id: number;
    acquirer_slug: string;
    acquirer_transaction_id: string;
    type: string;
    /** Valor em centavos */
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    metadata: Record<string, unknown> | null;
    paid_at: string | null;
    refunded_at: string | null;
    refund_amount: number | null;
    refund_reason: string | null;
    created_at: string;
    updated_at: string;
    items?: Array<{ id: number; description: string | null; quantity: number; unit_price: number; total: number }>;
}

export interface PaymentsListParams {
    type?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    search?: string;
    page?: number;
    per_page?: number;
}

export const usePayment = () => {
    const { $api } = useNuxtApp();

    const getPayments = async (
        params?: PaymentsListParams
    ): Promise<{ success: boolean; data?: Payment[]; meta?: any; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: Payment[]; meta: any }>('/payments', {
                method: 'GET',
                query: params,
            });
            return { success: true, data: response.data, meta: response.meta };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Failed to load payments',
            };
        }
    };

    const getPayment = async (id: number): Promise<{ success: boolean; data?: Payment; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: Payment }>(`/payments/${id}`, { method: 'GET' });
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Failed to load payment',
            };
        }
    };

    return { getPayments, getPayment };
};
