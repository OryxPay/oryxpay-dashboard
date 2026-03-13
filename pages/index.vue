<template>
    <div>
        <div v-if="summary.banners && summary.banners.length > 0" class="mb-4 space-y-3">
            <div v-for="banner in summary.banners" :key="banner.id" class="overflow-hidden rounded-lg border border-white-dark/20 bg-white dark:bg-[#0f172a]">
                <a
                    v-if="banner.link_url"
                    :href="banner.link_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block"
                >
                    <img :src="banner.image_url" :alt="banner.title || 'Banner'" class="h-auto w-full object-cover" />
                </a>
                <img v-else :src="banner.image_url" :alt="banner.title || 'Banner'" class="h-auto w-full object-cover" />
            </div>
        </div>

        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Dashboard</h5>
                <p class="text-white-dark">Visão geral das suas operações.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="flex overflow-hidden rounded-md border border-primary">
                    <button
                        v-for="p in periodOptions"
                        :key="p.value"
                        type="button"
                        class="px-3 py-1.5 text-xs font-semibold transition"
                        :class="period === p.value ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'"
                        @click="setPeriod(p.value)"
                    >
                        {{ p.label }}
                    </button>
                </div>
                <button type="button" class="btn btn-outline-warning btn-sm h-8 w-8 p-0" @click="refreshAll" :disabled="loading || loadingSeries" title="Atualizar">
                    <icon-refresh class="h-4 w-4" :class="{ 'animate-spin': loading || loadingSeries }" />
                </button>
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm h-8 w-8 p-0"
                    @click="store.toggleHideValues()"
                    :title="store.hideValues ? 'Mostrar valores' : 'Ocultar valores'"
                >
                    <icon-eye class="h-4 w-4" />
                </button>
            </div>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 text-white sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <div class="panel bg-gradient-to-r from-[#35A4F0] to-[#3B82F6] py-4">
                <div class="text-sm opacity-90">Vendas</div>
                <div class="mt-2 text-2xl font-bold">{{ formatInteger(summary.checkouts_started || 0) }}</div>
                <div class="mt-1 text-xs opacity-80">Total de transações</div>
            </div>
            <div class="panel bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] py-4">
                <div class="text-sm opacity-90">Valor Total Vendas</div>
                <div class="mt-2 text-2xl font-bold">{{ formatCents(summary.paid_sales_month || summary.income_month) }}</div>
                <div class="mt-1 text-xs opacity-80">Volume bruto</div>
            </div>
            <div class="panel bg-gradient-to-r from-[#66BB6A] to-[#81C784] py-4">
                <div class="text-sm opacity-90">Pedidos Pagos</div>
                <div class="mt-2 text-2xl font-bold">{{ formatInteger(summary.sales_count || 0) }}</div>
                <div class="mt-1 text-xs opacity-80">Confirmados</div>
            </div>
            <div class="panel bg-gradient-to-r from-[#F5B335] to-[#FBC02D] py-4">
                <div class="text-sm opacity-90">Ticket Médio</div>
                <div class="mt-2 text-2xl font-bold">{{ formatCents(summary.average_ticket || 0) }}</div>
                <div class="mt-1 text-xs opacity-80">Por venda</div>
            </div>
            <div class="panel bg-gradient-to-r from-[#35A4F0] to-[#42A5F5] py-4">
                <div class="text-sm opacity-90">Saldo disponível</div>
                <div class="mt-2 text-2xl font-bold">{{ formatCents(summary.balance_available) }}</div>
                <NuxtLink to="/financeiro/saldo" class="mt-1 inline-block text-xs opacity-90 underline">Detalhes</NuxtLink>
            </div>
            <div class="panel bg-gradient-to-r from-[#56B561] to-[#66BB6A] py-4">
                <div class="text-sm opacity-90">Conversão</div>
                <div class="mt-2 text-2xl font-bold">{{ (summary.conversion_rate || 0).toFixed(1) }}%</div>
                <div class="mt-1 text-xs opacity-80">Taxa de aprovação</div>
            </div>
        </div>

        <div class="panel">
            <div class="mb-4">
                <div>
                    <h5 class="text-lg font-semibold dark:text-white-light">Volume de Vendas</h5>
                    <p class="text-sm text-white-dark">Acompanhe o desempenho das vendas ao longo do tempo.</p>
                </div>
            </div>
            <div v-if="loadingSeries" class="grid min-h-[320px] place-content-center">
                <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary !border-l-transparent"></span>
            </div>
            <client-only v-else>
                <apexchart
                    v-if="incomeSeries.length > 0"
                    height="340"
                    type="area"
                    :options="chartOptions"
                    :series="chartSeries"
                    class="overflow-hidden rounded-lg"
                />
                <div v-else class="grid min-h-[280px] place-content-center text-white-dark">
                    Nenhum dado de entradas no período.
                </div>
            </client-only>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, onMounted } from 'vue';
    import { useAppStore } from '@/stores/index';
    import { useDashboard } from '@/composables/useDashboard';
    import type { DashboardSummary } from '@/composables/useDashboard';

    const store = useAppStore();
    const { getDashboard, getIncomeSeries } = useDashboard();
    const { formatFromCents } = useFormatCurrency();

    const loading = ref(true);
    const loadingSeries = ref(true);
    const summary = ref<DashboardSummary>({
        income_today: 0,
        income_month: 0,
        outcome_today: 0,
        outcome_month: 0,
        balance_available: 0,
        paid_sales_month: 0,
        pending_sales_month: 0,
        sales_count: 0,
        pending_count: 0,
        checkouts_started: 0,
        conversion_rate: 0,
        order_bump_sales: 0,
        recovered_value: 0,
        average_ticket: 0,
        sales_by_hour: [],
        sales_by_method: [],
        banners: [] as { id: number; title?: string | null; image_url: string; link_url?: string | null }[],
    });
    const incomeSeries = ref<{ date: string; income: number; outcome?: number }[]>([]);
    const period = ref<1 | 7 | 14 | 30>(7);

    const periodOptions = [
        { value: 1 as const, label: 'Hoje' },
        { value: 7 as const, label: '7 dias' },
        { value: 14 as const, label: '14 dias' },
        { value: 30 as const, label: '30 dias' },
    ];

    function formatCents(cents: number): string {
        if (store.hideValues) return 'R$ ••••••';
        return formatFromCents(cents);
    }

    function formatInteger(value: number): string {
        if (store.hideValues) return '••••';
        return value.toLocaleString('pt-BR');
    }

    function formatXAxisLabel(value: string): string {
        const parsed = new Date(value.replace(' ', 'T'));
        if (Number.isNaN(parsed.getTime())) return value;
        if (period.value === 1) {
            return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }

    const chartSeries = computed(() => [
        {
            name: 'Vendas',
            data: incomeSeries.value.map((d) => d.income / 100),
        },
    ]);

    const chartOptions = computed(() => ({
        chart: {
            type: 'area',
            height: 340,
            fontFamily: 'Nunito, sans-serif',
            zoom: { enabled: false },
            toolbar: { show: false },
        },
        colors: ['#2CA6DF'],
        dataLabels: { enabled: false },
        stroke: { width: 2, curve: 'smooth' },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.35,
                opacityTo: 0.02,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            axisBorder: {
                color: store.theme === 'dark' ? '#191e3a' : '#e0e6ed',
            },
            categories: incomeSeries.value.map((d) => formatXAxisLabel(d.date)),
            labels: {
                show: true,
                formatter: (value: string) => value,
            },
        },
        yaxis: {
            opposite: store.rtlClass === 'rtl',
            labels: {
                offsetX: store.rtlClass === 'rtl' ? -40 : 0,
                formatter: (val: number) =>
                    store.hideValues
                        ? 'R$ •••'
                        : val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }),
            },
        },
        grid: {
            borderColor: store.theme === 'dark' ? '#191e3a' : '#e0e6ed',
        },
        legend: {
            show: false,
        },
        tooltip: {
            theme: store.theme === 'dark' ? 'dark' : 'light',
            y: {
                formatter: (val: number) =>
                    store.hideValues ? 'R$ ••••••' : val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            },
        },
    }));

    async function loadDashboard() {
        loading.value = true;
        try {
            const result = await getDashboard();
            if (result.success && result.data) summary.value = result.data;
        } finally {
            loading.value = false;
        }
    }

    async function loadSeries() {
        loadingSeries.value = true;
        try {
            const result = await getIncomeSeries(period.value);
            if (result.success && result.data?.series) incomeSeries.value = result.data.series;
            else incomeSeries.value = [];
        } finally {
            loadingSeries.value = false;
        }
    }

    async function refreshAll() {
        await Promise.all([loadDashboard(), loadSeries()]);
    }

    async function setPeriod(nextPeriod: 1 | 7 | 14 | 30) {
        period.value = nextPeriod;
        await loadSeries();
    }

    onMounted(async () => {
        await loadDashboard();
        await loadSeries();
    });

    useHead({ title: 'Dashboard' });
    definePageMeta({ middleware: 'auth' });
</script>
