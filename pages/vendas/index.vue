<template>
    <div>
        <div class="mb-5">
            <h5 class="text-lg font-semibold dark:text-white-light">Transações</h5>
            <p class="text-white-dark">Histórico completo de depósitos e saques</p>
        </div>
        <div class="panel">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
                <input
                    v-model="search"
                    type="text"
                    class="form-input w-full max-w-xs"
                    placeholder="ID ou descrição..."
                />
                <div class="flex items-center gap-2">
                    <div class="input-group flatpicker-calender w-auto">
                        <flat-pickr
                            v-model="dateRange"
                            :config="rangeCalendarConfig"
                            class="form-input digits form-control-sm flatpickr-datetime w-[320px]"
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
                    <select v-model="filterType" class="selectize form-select w-32">
                        <option value="">Tipo</option>
                        <option value="pix">PIX</option>
                        <option value="boleto">Boleto</option>
                        <option value="card">Cartão</option>
                    </select>
                    <select v-model="filterStatus" class="selectize form-select w-40">
                        <option value="">Status</option>
                        <option value="pending">Pendente</option>
                        <option value="processing">Processando</option>
                        <option value="paid">Pago</option>
                        <option value="failed">Falhou</option>
                        <option value="refused">Recusado</option>
                        <option value="refunded">Estornado</option>
                        <option value="expired">Expirado</option>
                        <option value="cancelled">Cancelado</option>
                        <option value="chargeback">Chargeback</option>
                        <option value="in_dispute">Em Disputa</option>
                    </select>
                    <button type="button" class="btn btn-outline-secondary" @click="clearFilters">
                        <icon-x class="h-4 w-4 mr-1" /> Limpar
                    </button>
                    <button type="button" class="btn btn-outline-warning" @click="loadPayments" :disabled="loading">
                        <icon-refresh class="h-4 w-4 mr-1" :class="{ 'animate-spin': loading }" /> Atualizar
                    </button>
                </div>
            </div>
            <div v-if="loading" class="grid min-h-[200px] place-content-center">
                <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary !border-l-transparent"></span>
            </div>
            <div v-else-if="payments.length === 0" class="py-12 text-center text-white-dark">
                Nenhuma transação encontrada.
            </div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto w-full text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-200 dark:border-dark-light text-white-dark">
                            <th class="py-3 font-semibold">ID</th>
                            <th class="py-3 font-semibold">TIPO</th>
                            <th class="py-3 font-semibold text-right">VALOR</th>
                            <th class="py-3 font-semibold">STATUS</th>
                            <th class="py-3 font-semibold">DATA</th>
                            <th class="py-3 font-semibold text-center">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="p in paginatedPayments"
                            :key="p.id"
                            class="border-b border-gray-100 dark:border-dark-light/50"
                        >
                            <td class="py-3">
                                <div class="flex items-center gap-1">
                                    <button
                                        type="button"
                                        class="p-1 text-white-dark hover:text-primary transition"
                                        title="Copiar ID"
                                        @click.stop="copyToClipboard(p.tx_id || p.acquirer_transaction_id)"
                                    >
                                        <icon-copy class="h-3.5 w-3.5" />
                                    </button>
                                    <span class="font-mono text-xs dark:text-white-light">{{ truncateId(p.tx_id || p.acquirer_transaction_id) }}</span>
                                </div>
                            </td>
                            <td class="py-3">
                                <span class="text-primary">{{ formatType(p.type) }}</span>
                            </td>
                            <td class="py-3 text-right font-medium">{{ formatAmount(p) }}</td>
                            <td class="py-3">
                                    <span
                                    class="badge"
                                    :class="getStatusBadgeClass(p.status)"
                                >
                                    {{ formatStatus(p.status) }}
                                </span>
                            </td>
                            <td class="py-3 text-white-dark">{{ formatDate(p.created_at) }}</td>
                            <td class="py-3 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <button
                                        type="button"
                                        class="btn btn-sm btn-outline-primary p-1"
                                        title="Ver detalhes"
                                        @click="openDetails(p)"
                                    >
                                        <icon-eye class="h-4 w-4" />
                                    </button>
                                    <button
                                        v-if="p.status === 'paid'"
                                        type="button"
                                        class="btn btn-sm btn-outline-danger p-1"
                                        title="Solicitar reembolso"
                                        @click="confirmRefund(p)"
                                    >
                                        <icon-refresh class="h-4 w-4" />
                                    </button>
                                </div>
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

        <!-- Modal de Detalhes -->
        <TransitionRoot appear :show="showModal" as="template">
            <Dialog as="div" class="relative z-50" @close="closeModal">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel class="panel w-full max-w-2xl overflow-hidden rounded-lg">
                                <div class="flex items-center justify-between border-b border-white-dark/20 px-5 py-3">
                                    <h5 class="text-lg font-semibold dark:text-white-light">Detalhes da Transação</h5>
                                    <button type="button" class="text-white-dark hover:text-dark" @click="closeModal">
                                        <icon-x class="h-5 w-5" />
                                    </button>
                                </div>

                                <div v-if="loadingDetails" class="flex items-center justify-center py-12">
                                    <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary !border-l-transparent"></span>
                                </div>

                                <div v-else-if="selectedPayment" class="p-5">
                                    <!-- Tabs Switch -->
                                    <div class="mb-5 flex gap-1 rounded-lg border border-white-dark/20 bg-white-dark/5 p-1 dark:border-white-dark/10 dark:bg-white-dark/5">
                                        <button
                                            type="button"
                                            :class="[
                                                'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
                                                activeTab === 'details'
                                                    ? 'bg-primary text-white'
                                                    : 'text-white-dark hover:bg-white-dark/10 dark:hover:bg-white-dark/10',
                                            ]"
                                            @click="activeTab = 'details'"
                                        >
                                            <icon-file class="h-4 w-4" />
                                            Detalhes
                                        </button>
                                        <button
                                            type="button"
                                            :class="[
                                                'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
                                                activeTab === 'split'
                                                    ? 'bg-primary text-white'
                                                    : 'text-white-dark hover:bg-white-dark/10 dark:hover:bg-white-dark/10',
                                            ]"
                                            @click="activeTab = 'split'"
                                        >
                                            <icon-chart-square class="h-4 w-4" />
                                            Split
                                        </button>
                                    </div>

                                    <!-- Tab: Detalhes -->
                                    <div v-show="activeTab === 'details'" class="space-y-4">
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <p class="text-xs text-white-dark">ID da Transação</p>
                                                <div class="flex items-center gap-1">
                                                    <span class="font-mono text-sm dark:text-white-light">{{ selectedPayment.tx_id }}</span>
                                                    <button
                                                        type="button"
                                                        class="p-1 text-white-dark hover:text-primary transition"
                                                        title="Copiar ID"
                                                        @click="copyToClipboard(selectedPayment.tx_id)"
                                                    >
                                                        <icon-copy class="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Referência</p>
                                                <p class="text-sm dark:text-white-light">{{ selectedPayment.reference || '-' }}</p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Tipo</p>
                                                <p class="text-sm font-medium text-primary">{{ formatType(selectedPayment.type) }}</p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Status</p>
                                                <span
                                                    class="badge"
                                                    :class="getStatusBadgeClass(selectedPayment.status)"
                                                >
                                                    {{ formatStatus(selectedPayment.status) }}
                                                </span>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Valor</p>
                                                <p class="text-lg font-bold dark:text-white-light">{{ formatCents(selectedPayment.amount) }}</p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Parcelas</p>
                                                <p class="text-sm dark:text-white-light">{{ selectedPayment.installments || 1 }}x</p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Criado em</p>
                                                <p class="text-sm dark:text-white-light">{{ formatDateTime(selectedPayment.created_at) }}</p>
                                            </div>
                                            <div>
                                                <p class="text-xs text-white-dark">Pago em</p>
                                                <p class="text-sm dark:text-white-light">{{ selectedPayment.paid_at ? formatDateTime(selectedPayment.paid_at) : '-' }}</p>
                                            </div>
                                            <div v-if="selectedPayment.refunded_at">
                                                <p class="text-xs text-white-dark">Estornado em</p>
                                                <p class="text-sm dark:text-white-light">{{ formatDateTime(selectedPayment.refunded_at) }}</p>
                                            </div>
                                            <div v-if="selectedPayment.refund_amount">
                                                <p class="text-xs text-white-dark">Valor Estornado</p>
                                                <p class="text-sm font-bold text-danger dark:text-danger">{{ formatCents(selectedPayment.refund_amount) }}</p>
                                            </div>
                                        </div>

                                        <!-- Botão de Reembolso -->
                                        <div v-if="selectedPayment.status === 'paid'" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <button
                                                type="button"
                                                class="btn btn-danger w-full"
                                                :disabled="refundLoading"
                                                @click="confirmRefundFromModal"
                                            >
                                                <icon-refresh v-if="!refundLoading" class="h-4 w-4 mr-2" />
                                                <span v-if="refundLoading" class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white !border-l-transparent mr-2"></span>
                                                Solicitar Reembolso
                                            </button>
                                        </div>

                                        <!-- Info de Reembolso -->
                                        <div v-if="selectedPayment.status === 'refunded' && selectedPayment.refund_reason" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <h6 class="mb-2 font-semibold dark:text-white-light">Motivo do Estorno</h6>
                                            <p class="text-sm text-white-dark">{{ selectedPayment.refund_reason }}</p>
                                        </div>

                                        <!-- Cliente -->
                                        <div v-if="selectedPayment.customer" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <h6 class="mb-3 font-semibold dark:text-white-light">Cliente</h6>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p class="text-xs text-white-dark">Nome</p>
                                                    <p class="text-sm dark:text-white-light">{{ selectedPayment.customer.name || '-' }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-xs text-white-dark">Email</p>
                                                    <p class="text-sm dark:text-white-light">{{ selectedPayment.customer.email || '-' }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-xs text-white-dark">Documento</p>
                                                    <p class="text-sm dark:text-white-light">{{ selectedPayment.customer.document || '-' }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-xs text-white-dark">Telefone</p>
                                                    <p class="text-sm dark:text-white-light">{{ selectedPayment.customer.phone || '-' }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- PIX -->
                                        <div v-if="selectedPayment.pix" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <h6 class="mb-3 font-semibold dark:text-white-light">Dados PIX</h6>
                                            <div class="grid grid-cols-1 gap-4">
                                                <div>
                                                    <p class="text-xs text-white-dark">End to End</p>
                                                    <p class="font-mono text-xs break-all dark:text-white-light">{{ selectedPayment.pix.end_to_end || '-' }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Boleto -->
                                        <div v-if="selectedPayment.boleto" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <h6 class="mb-3 font-semibold dark:text-white-light">Dados Boleto</h6>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p class="text-xs text-white-dark">Vencimento</p>
                                                    <p class="text-sm dark:text-white-light">{{ selectedPayment.boleto.due_date || '-' }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-xs text-white-dark">Código de Barras</p>
                                                    <p class="font-mono text-xs break-all dark:text-white-light">{{ selectedPayment.boleto.barcode || '-' }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Card -->
                                        <div v-if="selectedPayment.card" class="mt-4 border-t border-white-dark/20 pt-4">
                                            <h6 class="mb-3 font-semibold dark:text-white-light">Dados Cartão</h6>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p class="text-xs text-white-dark">Últimos dígitos</p>
                                                    <p class="text-sm dark:text-white-light">**** {{ selectedPayment.card.last_digits || '****' }}</p>
                                                </div>
                                                <div>
                                                    <p class="text-xs text-white-dark">Bandeira</p>
                                                    <p class="text-sm capitalize dark:text-white-light">{{ selectedPayment.card.brand || '-' }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Tab: Split -->
                                    <div v-show="activeTab === 'split'" class="space-y-4">
                                        <div v-if="selectedPayment.split" class="space-y-4">
                                            <div class="rounded-lg border border-white-dark/20 p-4">
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p class="text-xs text-white-dark">Valor Bruto</p>
                                                        <p class="text-lg font-bold dark:text-white-light">{{ formatCents(selectedPayment.split.transaction_amount) }}</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-white-dark">Valor Líquido (você recebe)</p>
                                                        <p class="text-lg font-bold text-success">{{ formatCents(selectedPayment.split.account_amount) }}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="rounded-lg border border-white-dark/20 p-4">
                                                <h6 class="mb-3 font-semibold dark:text-white-light">Taxas</h6>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p class="text-xs text-white-dark">Taxa percentual (MDR)</p>
                                                        <p class="text-sm dark:text-white-light">{{ selectedPayment.split.fee_percent?.toFixed(2) || '0.00' }}%</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-xs text-white-dark">Taxa fixa</p>
                                                        <p class="text-sm dark:text-white-light">{{ formatCents(selectedPayment.split.fee_monetary || 0) }}</p>
                                                    </div>
                                                    <div class="col-span-2">
                                                        <p class="text-xs text-white-dark">Total de taxas</p>
                                                        <p class="text-lg font-bold text-danger">- {{ formatCents(selectedPayment.split.total_fee || 0) }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="py-8 text-center text-white-dark">
                                            <p>Split não disponível para esta transação.</p>
                                            <p class="text-xs mt-1">O split é gerado apenas para transações pagas.</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Modal de Confirmação de Reembolso -->
        <TransitionRoot appear :show="showRefundModal" as="template">
            <Dialog as="div" class="relative z-50" @close="closeRefundModal">
                <TransitionChild
                    as="template"
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as="template"
                            enter="duration-300 ease-out"
                            enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100"
                            leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100"
                            leave-to="opacity-0 scale-95"
                        >
                            <DialogPanel class="panel w-full max-w-md overflow-hidden rounded-lg">
                                <div class="flex items-center justify-between border-b border-white-dark/20 px-5 py-3">
                                    <h5 class="text-lg font-semibold dark:text-white-light">Confirmar Reembolso</h5>
                                    <button type="button" class="text-white-dark hover:text-dark" @click="closeRefundModal">
                                        <icon-x class="h-5 w-5" />
                                    </button>
                                </div>

                                <div class="p-5">
                                    <div class="mb-4 rounded-lg bg-danger/10 border border-danger/30 p-4">
                                        <div class="flex items-start gap-3">
                                            <icon-info-circle class="h-5 w-5 text-danger shrink-0 mt-0.5" />
                                            <div>
                                                <p class="text-sm font-medium text-danger">Atenção</p>
                                                <p class="text-sm text-danger/80">Esta ação não pode ser desfeita. O valor será estornado ao cliente.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="refundPayment" class="mb-4 space-y-2">
                                        <div class="flex justify-between">
                                            <span class="text-white-dark">ID da Transação:</span>
                                            <span class="font-mono text-sm dark:text-white-light">{{ truncateId(refundPayment.tx_id) }}</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-white-dark">Valor a estornar:</span>
                                            <span class="font-bold text-danger">{{ formatCents(refundPayment.amount) }}</span>
                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <label class="block text-sm text-white-dark mb-1">Motivo do reembolso (opcional)</label>
                                        <textarea
                                            v-model="refundReason"
                                            class="form-textarea w-full"
                                            rows="2"
                                            placeholder="Ex: Solicitação do cliente, produto com defeito..."
                                        ></textarea>
                                    </div>

                                    <div class="flex gap-3">
                                        <button
                                            type="button"
                                            class="btn btn-outline-secondary flex-1"
                                            :disabled="refundLoading"
                                            @click="closeRefundModal"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-danger flex-1"
                                            :disabled="refundLoading"
                                            @click="executeRefund"
                                        >
                                            <span v-if="refundLoading" class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white !border-l-transparent mr-2"></span>
                                            {{ refundLoading ? 'Processando...' : 'Confirmar Reembolso' }}
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
    import { useAppStore } from '@/stores/index';
    import { usePayment } from '@/composables/usePayment';
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import type { Payment } from '@/composables/usePayment';

    const store = useAppStore();
    const { $api } = useNuxtApp();
    const { getPayments } = usePayment();
    const { formatAmount: formatAmountBase } = useFormatCurrency();
    const loading = ref(true);
    const payments = ref<Payment[]>([]);
    const search = ref('');
    const dateRange = ref('');
    const filterType = ref('');
    const filterStatus = ref('');
    const currentPage = ref(1);
    const perPage = 15;
    const rangeCalendarConfig = {
        mode: 'range' as const,
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        time_24hr: true,
        locale: {
            rangeSeparator: ' até ',
        },
    };

    // Modal de Detalhes
    const showModal = ref(false);
    const loadingDetails = ref(false);
    const selectedPayment = ref<any>(null);
    const activeTab = ref<'details' | 'split'>('details');

    // Modal de Reembolso
    const showRefundModal = ref(false);
    const refundPayment = ref<Payment | null>(null);
    const refundReason = ref('');
    const refundLoading = ref(false);

    function formatAmount(p: Payment): string {
        if (store.hideValues) return 'R$ ••••••';
        return formatAmountBase(p);
    }

    function formatCents(cents: number): string {
        if (store.hideValues) return 'R$ ••••••';
        return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    }

    function formatDateTime(dateStr: string): string {
        return new Date(dateStr).toLocaleString('pt-BR');
    }

    function formatType(type: string): string {
        const types: Record<string, string> = { pix: 'PIX', boleto: 'Boleto', card: 'Cartão' };
        return types[type] || type;
    }

    function formatStatus(status: string): string {
        const statuses: Record<string, string> = {
            pending: 'Pendente',
            processing: 'Processando',
            paid: 'Pago',
            failed: 'Falhou',
            refused: 'Recusado',
            refunded: 'Estornado',
            cancelled: 'Cancelado',
            expired: 'Expirado',
            chargeback: 'Chargeback',
            pre_chargeback: 'Pré-Chargeback',
            in_dispute: 'Em Disputa',
            antifraud: 'Análise Antifraude',
        };
        return statuses[status] || status;
    }

    function getStatusBadgeClass(status: string): string {
        const classes: Record<string, string> = {
            // Sucesso
            paid: 'bg-success/20 text-success',
            // Pendentes/Processando
            pending: 'bg-warning/20 text-warning',
            processing: 'bg-warning/20 text-warning',
            antifraud: 'bg-warning/20 text-warning',
            // Falhas
            failed: 'bg-danger/20 text-danger',
            refused: 'bg-danger/20 text-danger',
            expired: 'bg-danger/20 text-danger',
            cancelled: 'bg-dark/20 text-dark dark:bg-white-dark/20 dark:text-white-dark',
            // Estornos
            refunded: 'bg-info/20 text-info',
            // Disputas
            chargeback: 'bg-danger/20 text-danger',
            pre_chargeback: 'bg-orange-500/20 text-orange-500',
            in_dispute: 'bg-orange-500/20 text-orange-500',
        };
        return classes[status] || 'bg-dark/20 text-dark';
    }

    function truncateId(id: string): string {
        if (!id) return '-';
        return id.length > 12 ? id.substring(0, 12) + '...' : id;
    }

    function clearFilters() {
        search.value = '';
        dateRange.value = '';
        filterType.value = '';
        filterStatus.value = '';
        currentPage.value = 1;
    }

    function parseDateRange(rangeValue: string): { start: Date; end: Date; startDate: string; endDate: string; startTime: string; endTime: string } | null {
        if (!rangeValue) return null;
        const parts = rangeValue.split(' até ').map((v) => v.trim());
        if (parts.length !== 2) {
            const fallback = rangeValue.split(' to ').map((v) => v.trim());
            if (fallback.length !== 2) return null;
            parts[0] = fallback[0];
            parts[1] = fallback[1];
        }
        const [startRaw, endRaw] = parts;
        const [startDateRaw, startTimeRaw = '00:00'] = startRaw.split(' ');
        const [endDateRaw, endTimeRaw = '23:59'] = endRaw.split(' ');
        const [startDay, startMonth, startYear] = startDateRaw.split('/');
        const [endDay, endMonth, endYear] = endDateRaw.split('/');
        if (!startDay || !startMonth || !startYear || !endDay || !endMonth || !endYear) return null;
        const start = new Date(`${startYear}-${startMonth}-${startDay}T${startTimeRaw}:00`);
        const end = new Date(`${endYear}-${endMonth}-${endDay}T${endTimeRaw}:59`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
        return {
            start,
            end,
            startDate: `${startYear}-${startMonth}-${startDay}`,
            endDate: `${endYear}-${endMonth}-${endDay}`,
            startTime: startTimeRaw,
            endTime: endTimeRaw,
        };
    }

    const filteredPayments = computed(() => {
        let list = payments.value;
        const range = parseDateRange(dateRange.value);
        if (range) {
            list = list.filter((p) => {
                const createdAt = new Date(p.created_at);
                if (Number.isNaN(createdAt.getTime())) return false;
                return createdAt >= range.start && createdAt <= range.end;
            });
        }
        if (filterType.value) list = list.filter((p) => p.type === filterType.value);
        if (filterStatus.value) list = list.filter((p) => p.status === filterStatus.value);
        if (search.value) {
            const q = search.value.toLowerCase();
            list = list.filter(
                (p) =>
                    (p.acquirer_transaction_id || '').toLowerCase().includes(q) ||
                    (p.description || '').toLowerCase().includes(q) ||
                    (p.tx_id || '').toLowerCase().includes(q)
            );
        }
        return list;
    });
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

    async function loadPayments() {
        loading.value = true;
        try {
            const range = parseDateRange(dateRange.value);
            const result = await getPayments({
                per_page: 100,
                start_date: range?.startDate,
                end_date: range?.endDate,
                start_time: range?.startTime,
                end_time: range?.endTime,
                type: filterType.value || undefined,
                status: filterStatus.value || undefined,
                search: search.value || undefined,
            });
            if (result.success && result.data) payments.value = result.data;
            else payments.value = [];
            currentPage.value = 1;
        } finally {
            loading.value = false;
        }
    }

    watch([search, dateRange, filterType, filterStatus], () => {
        currentPage.value = 1;
    });

    async function openDetails(payment: Payment) {
        showModal.value = true;
        loadingDetails.value = true;
        activeTab.value = 'details';
        selectedPayment.value = null;

        try {
            const res = await $api<{ success: boolean; data: any }>(`/payments/${payment.id}`);
            if (res?.success && res.data) {
                selectedPayment.value = res.data;
            }
        } finally {
            loadingDetails.value = false;
        }
    }

    function closeModal() {
        showModal.value = false;
        selectedPayment.value = null;
    }

    async function copyToClipboard(text: string) {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            useToast().success('ID copiado!');
        } catch {
            useToast().error('Erro ao copiar');
        }
    }

    function confirmRefund(payment: Payment) {
        refundPayment.value = payment;
        refundReason.value = '';
        showRefundModal.value = true;
    }

    function confirmRefundFromModal() {
        if (selectedPayment.value) {
            refundPayment.value = selectedPayment.value;
            refundReason.value = '';
            showRefundModal.value = true;
        }
    }

    function closeRefundModal() {
        showRefundModal.value = false;
        refundPayment.value = null;
        refundReason.value = '';
    }

    async function executeRefund() {
        if (!refundPayment.value) return;

        refundLoading.value = true;
        try {
            const res = await $api<{ success: boolean; message?: string; error?: string }>(
                `/payments/${refundPayment.value.id}/refund`,
                {
                    method: 'POST',
                    body: {
                        reason: refundReason.value || undefined,
                    },
                }
            );

            if (res?.success) {
                useToast().success(res.message || 'Reembolso processado com sucesso!');
                closeRefundModal();
                closeModal();
                await loadPayments(); // Recarrega a lista
            } else {
                useToast().error(res?.error || 'Erro ao processar reembolso.');
            }
        } catch (err: any) {
            const errorMsg = err?.data?.error || err?.message || 'Erro ao processar reembolso.';
            useToast().error(errorMsg);
        } finally {
            refundLoading.value = false;
        }
    }

    onMounted(loadPayments);
    useHead({ title: 'Transações' });
    definePageMeta({ middleware: 'auth' });
</script>
