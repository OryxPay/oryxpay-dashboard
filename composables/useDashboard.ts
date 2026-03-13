/** Todos os valores monetários em centavos */
export interface DashboardBanner {
    id: number;
    title?: string | null;
    image_url: string;
    link_url?: string | null;
    sort_order?: number;
}

export interface DashboardSummary {
    income_today: number;
    income_month: number;
    outcome_today: number;
    outcome_month: number;
    balance_available: number;
    balance_pending?: number;
    paid_sales_month?: number;
    pending_sales_month?: number;
    sales_count?: number;
    pending_count?: number;
    checkouts_started?: number;
    conversion_rate?: number;
    order_bump_sales?: number;
    recovered_value?: number;
    average_ticket?: number;
    sales_by_hour?: Array<{ hour: string; total: number }>;
    sales_by_method?: Array<{ method: string; total: number }>;
    banners?: DashboardBanner[];
}

export interface IncomeSeriesPoint {
    date: string;
    /** Entrada do dia em centavos */
    income: number;
    /** Saída do dia em centavos */
    outcome?: number;
}

export const useDashboard = () => {
    const { $api } = useNuxtApp();

    const getDashboard = async (): Promise<{ success: boolean; data?: DashboardSummary; error?: string }> => {
        try {
            const [dashboardMonthRes, dashboardTodayRes, bannersRes] = await Promise.all([
                $api<{ success: boolean; data: any }>('/dashboard', { method: 'GET', query: { period: 30 } }),
                $api<{ success: boolean; data: any }>('/dashboard', { method: 'GET', query: { period: 1 } }),
                $api<{ success: boolean; data: Array<{ id: number; title?: string | null; image_url: string; link?: string | null }> }>('/banners', { method: 'GET' }),
            ]);

            const monthData = dashboardMonthRes?.data || {};
            const todayData = dashboardTodayRes?.data || {};
            const banners = (bannersRes?.data || []).map((b) => ({
                id: b.id,
                title: b.title ?? null,
                image_url: b.image_url,
                link_url: b.link ?? null,
            }));

            // Normaliza resposta do backend novo para o formato usado pela tela.
            const normalized: DashboardSummary = {
                income_today: todayData.total_sales_amount ?? todayData.income_today ?? 0,
                income_month: monthData.total_sales_amount ?? monthData.income_month ?? 0,
                outcome_today: todayData.outcome_today ?? 0,
                outcome_month: monthData.outcome_month ?? 0,
                balance_available: monthData.balance_available ?? 0,
                balance_pending: monthData.balance_pending ?? 0,
                paid_sales_month: monthData.total_sales_amount ?? 0,
                pending_sales_month: monthData.pending_sales_month ?? 0,
                sales_count: monthData.paid_count ?? 0,
                pending_count: monthData.pending_count ?? 0,
                checkouts_started: monthData.transactions_count ?? 0,
                conversion_rate: monthData.conversion_rate ?? 0,
                order_bump_sales: monthData.order_bump_sales ?? 0,
                recovered_value: monthData.recovered_value ?? 0,
                average_ticket: monthData.average_ticket ?? 0,
                sales_by_hour: monthData.sales_by_hour ?? [],
                sales_by_method: monthData.sales_by_method ?? [],
                banners,
            };

            return { success: true, data: normalized };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Failed to load dashboard',
            };
        }
    };

    const getIncomeSeries = async (
        period: 1 | 7 | 14 | 30 = 7
    ): Promise<{ success: boolean; data?: { series: IncomeSeriesPoint[] }; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: { series: Array<{ date: string; income?: number; amount?: number; outcome?: number }> } }>(
                '/dashboard/income-series',
                { method: 'GET', query: { period } }
            );
            const series = (response.data?.series || []).map((point) => ({
                date: point.date,
                income: point.income ?? point.amount ?? 0,
                outcome: point.outcome ?? 0,
            }));
            return { success: true, data: { series } };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Failed to load income series',
            };
        }
    };

    return { getDashboard, getIncomeSeries };
};
