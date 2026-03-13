<template>
    <div>
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Extratos</h5>
                <p class="text-white-dark">Movimentações detalhadas da sua conta</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" class="btn btn-outline-warning" :disabled="loading" @click="loadData">
                    <icon-refresh class="h-4 w-4 mr-1" :class="{ 'animate-spin': loading }" /> Atualizar
                </button>
                <button type="button" class="btn btn-outline-primary" @click="store.toggleHideValues()">
                    {{ store.hideValues ? 'Mostrar valores' : 'Esconder valores' }}
                </button>
            </div>
        </div>

        <div class="panel mb-5">
            <div class="grid gap-3 sm:grid-cols-3">
                <div class="panel bg-gradient-to-r from-success to-success/80 p-4 text-white">
                    <div class="flex justify-between">
                        <p class="text-sm font-semibold opacity-90">Entradas</p>
                        <icon-trending-up class="h-5 w-5 opacity-70" />
                    </div>
                    <p class="mt-2 text-2xl font-bold">{{ formatCents(summary.income) }}</p>
                    <p class="text-xs opacity-80">No período</p>
                </div>
                <div class="panel bg-gradient-to-r from-danger to-danger/80 p-4 text-white">
                    <div class="flex justify-between">
                        <p class="text-sm font-semibold opacity-90">Saídas</p>
                        <icon-trending-up class="h-5 w-5 rotate-180 opacity-70" />
                    </div>
                    <p class="mt-2 text-2xl font-bold">{{ formatCents(summary.outcome) }}</p>
                    <p class="text-xs opacity-80">No período</p>
                </div>
                <div class="panel bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
                    <div class="flex justify-between">
                        <p class="text-sm font-semibold opacity-90">Saldo Disponível</p>
                        <icon-wallet class="h-5 w-5 opacity-70" />
                    </div>
                    <p class="mt-2 text-2xl font-bold">{{ formatCents(balanceAvailable) }}</p>
                    <p class="text-xs opacity-80">Atual</p>
                </div>
            </div>
        </div>

        <div class="panel">
            <div class="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-6">
                <div class="input-group flatpicker-calender lg:col-span-2" style="width: auto;">
                    <flat-pickr
                        id="range-calendar"
                        v-model="filters.dateRange"
                        :config="rangeCalendarConfig"
                        class="form-input digits form-control-sm flatpickr-datetime h-10 w-full"
                        placeholder="dd/mm/yyyy HH:mm até dd/mm/yyyy HH:mm"
                        readonly="readonly"
                    />
                    <div class="input-group-text h-auto self-stretch cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </div>
                </div>
                <select v-model="filters.type" class="selectize form-select h-10 w-full">
                    <option value="">Todos os tipos</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                    <option value="card">Cartão</option>
                </select>
                <select v-model="filters.status" class="selectize form-select h-10 w-full">
                    <option value="">Todos os status</option>
                    <option value="paid">Pago</option>
                    <option value="pending">Pendente</option>
                    <option value="processing">Processando</option>
                    <option value="failed">Falhou</option>
                    <option value="refunded">Estornado</option>
                    <option value="chargeback">Chargeback</option>
                </select>
                <div class="flex flex-wrap items-center gap-2 lg:col-span-2 lg:justify-end">
                    <button type="button" class="btn btn-outline-secondary h-10 whitespace-nowrap" :disabled="loading" @click="clearFilters">
                        <icon-x class="h-4 w-4 mr-1" /> Limpar
                    </button>
                    <button type="button" class="btn btn-outline-primary h-10 whitespace-nowrap" @click="exportCsv">
                        Exportar
                    </button>
                </div>
            </div>

            <div v-if="loading" class="grid min-h-[200px] place-content-center">
                <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary !border-l-transparent"></span>
            </div>
            <div v-else-if="filteredPayments.length === 0" class="py-12 text-center text-white-dark">
                Nenhuma transação no período.
            </div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-200 dark:border-dark-light text-white-dark">
                            <th class="py-3 font-semibold">Data</th>
                            <th class="py-3 font-semibold">Descrição</th>
                            <th class="py-3 font-semibold">Categoria</th>
                            <th class="py-3 font-semibold">Status</th>
                            <th class="py-3 text-right font-semibold">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="p in paginatedPayments"
                            :key="p.id"
                            class="border-b border-gray-100 dark:border-dark-light/50"
                        >
                            <td class="py-3">
                                {{ formatDate(p.created_at) }}
                            </td>
                            <td class="py-3">{{ p.description || 'Movimentação financeira' }}</td>
                            <td class="py-3">
                                <span class="badge" :class="getCategoryBadge(p)">
                                    {{ getCategoryLabel(p) }}
                                </span>
                            </td>
                            <td class="py-3">
                                <span class="badge" :class="getStatusBadge(p.status)">{{ formatStatus(p.status) }}</span>
                            </td>
                            <td class="py-3 text-right font-semibold" :class="isOutgoing(p) ? 'text-danger' : 'text-success'">
                                {{ isOutgoing(p) ? '-' : '+' }} {{ formatAmount(p) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <CommonDataTablePagination
                v-if="!loading && filteredPayments.length > 0"
                :current-page="currentPage"
                :total-pages="totalPages"
                :start-item="paginationStart"
                :end-item="paginationEnd"
                :total-items="filteredPayments.length"
                @page-change="goToPage"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import { useAppStore } from '@/stores/index';
    import { usePayment } from '@/composables/usePayment';
    import { useSaldo } from '@/composables/useSaldo';
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import type { Payment } from '@/composables/usePayment';

    const store = useAppStore();
    const toast = useToast();
    const { getPayments } = usePayment();
    const { getBalance } = useSaldo();
    const { formatAmount: formatAmountBase, formatFromCents } = useFormatCurrency();
    const config = useRuntimeConfig();
    const loading = ref(true);
    const payments = ref<Payment[]>([]);
    const balanceAvailable = ref(0);
    const currentPage = ref(1);
    const perPage = 15;
    const filters = ref({
        dateRange: '',
        type: '',
        status: '',
    });
    const rangeCalendarConfig = {
        mode: 'range' as const,
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        time_24hr: true,
        locale: {
            rangeSeparator: ' até ',
        },
    };

    const OUTGOING_STATUSES = new Set(['refunded', 'chargeback', 'pre_chargeback', 'in_dispute', 'cancelled']);

    const filteredPayments = computed(() =>
        payments.value.filter((p) => {
            if (filters.value.type && p.type !== filters.value.type) return false;
            if (filters.value.status && p.status !== filters.value.status) return false;
            return true;
        })
    );
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredPayments.value.length / perPage)));
    const paginatedPayments = computed(() => {
        const start = (currentPage.value - 1) * perPage;
        return filteredPayments.value.slice(start, start + perPage);
    });
    const paginationStart = computed(() => (filteredPayments.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1));
    const paginationEnd = computed(() => Math.min(currentPage.value * perPage, filteredPayments.value.length));

    function goToPage(page: number) {
        if (page < 1 || page > totalPages.value || page === currentPage.value) return;
        currentPage.value = page;
    }

    const summary = computed(() => {
        let income = 0;
        let outcome = 0;
        for (const payment of filteredPayments.value) {
            const amount = payment.amount ?? 0;
            if (isOutgoing(payment)) {
                outcome += amount;
            } else if ((payment.status || '').toLowerCase() === 'paid') {
                // Entradas consideram apenas vendas efetivamente pagas.
                income += amount;
            }
        }
        return { income, outcome };
    });

    function formatAmount(p: Payment): string {
        if (store.hideValues) return 'R$ ••••••';
        return formatAmountBase(p);
    }

    function formatCents(cents: number): string {
        if (store.hideValues) return 'R$ ••••••';
        return formatFromCents(cents);
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }

    function formatStatus(status: string): string {
        const map: Record<string, string> = {
            paid: 'Disponível',
            pending: 'Pendente',
            processing: 'Processando',
            failed: 'Falhou',
            refunded: 'Estornado',
            chargeback: 'Chargeback',
            pre_chargeback: 'Pré-Chargeback',
            in_dispute: 'Em disputa',
            cancelled: 'Cancelado',
        };
        return map[status] ?? status;
    }

    function getStatusBadge(status: string): string {
        if (status === 'paid') return 'badge-outline-success';
        if (status === 'pending' || status === 'processing') return 'badge-outline-warning';
        if (status === 'refunded' || status === 'chargeback' || status === 'failed' || status === 'cancelled') return 'badge-outline-danger';
        return 'badge-outline-primary';
    }

    function isOutgoing(p: Payment): boolean {
        return OUTGOING_STATUSES.has((p.status || '').toLowerCase()) || (p.amount ?? 0) < 0;
    }

    function getCategoryLabel(p: Payment): string {
        return isOutgoing(p) ? 'Transferência' : 'Pagamento';
    }

    function getCategoryBadge(p: Payment): string {
        return isOutgoing(p) ? 'badge-outline-primary' : 'badge-outline-success';
    }

    function parseDateRange(rangeValue: string): { startDate?: string; endDate?: string; startTime?: string; endTime?: string } {
        if (!rangeValue) return {};
        let parts = rangeValue.split(' até ').map((v) => v.trim());
        if (parts.length !== 2) {
            parts = rangeValue.split(' to ').map((v) => v.trim());
            if (parts.length !== 2) return {};
        }
        const [startRaw, endRaw] = parts;
        const [startDateRaw, startTimeRaw = '00:00'] = startRaw.split(' ');
        const [endDateRaw, endTimeRaw = '23:59'] = endRaw.split(' ');
        const [startDay, startMonth, startYear] = startDateRaw.split('/');
        const [endDay, endMonth, endYear] = endDateRaw.split('/');
        if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) return {};
        return {
            startDate: `${startYear}-${startMonth}-${startDay}`,
            endDate: `${endYear}-${endMonth}-${endDay}`,
            startTime: startTimeRaw,
            endTime: endTimeRaw,
        };
    }

    async function loadData() {
        loading.value = true;
        try {
            const parsedRange = parseDateRange(filters.value.dateRange);
            const result = await getPayments({
                per_page: 100,
                start_date: parsedRange.startDate,
                end_date: parsedRange.endDate,
                start_time: parsedRange.startTime,
                end_time: parsedRange.endTime,
                type: filters.value.type || undefined,
                status: filters.value.status || undefined,
            });
            if (result.success && result.data) payments.value = result.data;
            else payments.value = [];
            currentPage.value = 1;

            const balanceResult = await getBalance();
            if (balanceResult.success && balanceResult.data) {
                balanceAvailable.value = balanceResult.data.balance_available;
            }
        } finally {
            loading.value = false;
        }
    }

    async function clearFilters() {
        filters.value.dateRange = '';
        filters.value.type = '';
        filters.value.status = '';
        currentPage.value = 1;
    }

    async function exportCsv() {
        try {
            if (typeof window === 'undefined') return;
            const token = localStorage.getItem('auth_token');
            if (!token) {
                toast.error('Sessão expirada. Faça login novamente.');
                return;
            }
            const parsedRange = parseDateRange(filters.value.dateRange);
            const base = (config.public.apiBase as string).replace(/\/$/, '');
            const params = new URLSearchParams();
            if (parsedRange.startDate) params.set('start_date', parsedRange.startDate);
            if (parsedRange.endDate) params.set('end_date', parsedRange.endDate);
            if (parsedRange.startTime) params.set('start_time', parsedRange.startTime);
            if (parsedRange.endTime) params.set('end_time', parsedRange.endTime);
            if (filters.value.type) params.set('type', filters.value.type);
            if (filters.value.status) params.set('status', filters.value.status);
            const url = `${base}/account/statements/export${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error('Falha ao exportar extrato');
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `extrato_${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch {
            toast.error('Erro ao exportar extrato.');
        }
    }

    let filterDebounce: ReturnType<typeof setTimeout> | null = null;
    watch(
        () => [filters.value.dateRange, filters.value.type, filters.value.status],
        () => {
            if (filterDebounce) clearTimeout(filterDebounce);
            filterDebounce = setTimeout(() => {
                loadData();
            }, 200);
        }
    );

    onMounted(loadData);

    useHead({ title: 'Extratos' });
    definePageMeta({ middleware: 'auth' });
</script>
