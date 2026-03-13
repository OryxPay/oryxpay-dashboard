<template>
    <div>
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Saldo</h5>
                <p class="text-white-dark">Visualize seu saldo e gerencie chaves PIX para saque.</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" class="btn btn-outline-warning" @click="refreshAll" :disabled="loadingBankAccounts || loadingWithdraws">
                    <icon-refresh class="h-4 w-4 mr-1" :class="{ 'animate-spin': loadingBankAccounts || loadingWithdraws }" /> Atualizar
                </button>
                <button type="button" class="btn btn-outline-primary" @click="store.toggleHideValues()">
                    {{ store.hideValues ? 'Mostrar valores' : 'Esconder valores' }}
                </button>
            </div>
        </div>

        <!-- Cards de saldo -->
        <div class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="panel bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
                <div class="flex justify-between">
                    <span class="text-sm opacity-90">Saldo total</span>
                    <icon-wallet class="h-8 w-8 opacity-50" />
                </div>
                <p class="mt-3 text-2xl font-bold">{{ formatBalance(balanceTotalCents) }}</p>
                <p class="mt-1 text-xs opacity-80">Disponível + Pendente</p>
            </div>
            <div class="panel bg-gradient-to-r from-success to-success/80 p-6 text-white">
                <div class="flex justify-between">
                    <span class="text-sm opacity-90">Saldo disponível</span>
                    <icon-trending-up class="h-8 w-8 opacity-50" />
                </div>
                <p class="mt-3 text-2xl font-bold">{{ formatBalance(balanceAvailableCents) }}</p>
                <p class="mt-1 text-xs opacity-80">Para saque</p>
            </div>
            <div class="panel bg-gradient-to-r from-warning to-warning/80 p-6 text-white">
                <div class="flex justify-between">
                    <span class="text-sm opacity-90">Saldo pendente</span>
                    <icon-clock class="h-8 w-8 opacity-50" />
                </div>
                <p class="mt-3 text-2xl font-bold">{{ formatBalance(balancePendingCents) }}</p>
                <p class="mt-1 text-xs opacity-80">Em processamento</p>
            </div>
        </div>

        <!-- Chaves PIX -->
        <div class="panel mb-8">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h5 class="text-lg font-semibold dark:text-white-light">Chaves PIX</h5>
                    <p class="text-sm text-white-dark">Até 5 chaves para receber saques. Defina uma como principal.</p>
                </div>
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="bankAccounts.length >= 5"
                    @click="openPixModal()"
                >
                    <icon-plus class="mr-1 h-4 w-4" />
                    Adicionar chave
                </button>
            </div>
            <div v-if="loadingBankAccounts" class="py-8 text-center text-white-dark">Carregando...</div>
            <div v-else-if="bankAccounts.length === 0" class="py-8">
                <common-empty-state
                    title="Nenhuma chave PIX"
                    message="Cadastre uma chave PIX para poder solicitar saques."
                    action-label="Adicionar chave"
                    @action="openPixModal()"
                />
            </div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th class="text-left">Tipo</th>
                            <th class="text-left">Chave (mascarada)</th>
                            <th class="text-left">Principal</th>
                            <th class="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="ba in bankAccounts" :key="ba.id" class="border-t border-white-dark/10">
                            <td>{{ pixKeyTypeLabel(ba.pix_key_type) }}</td>
                            <td class="font-mono text-sm">{{ ba.pix_key_masked || '****' }}</td>
                            <td>
                                <span v-if="ba.is_primary" class="badge badge-outline-success">Principal</span>
                                <button
                                    v-else
                                    type="button"
                                    class="text-primary hover:underline"
                                    @click="setPrimary(ba.id)"
                                >
                                    Definir principal
                                </button>
                            </td>
                            <td class="whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button type="button" class="btn btn-sm btn-outline-primary" @click="openPixModal(ba)">
                                        Editar
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDeletePix(ba)">
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Solicitar saque -->
        <div class="panel mb-8">
            <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h5 class="text-lg font-semibold dark:text-white-light">Solicitar saque</h5>
                    <p class="text-sm text-white-dark">Transfira seu saldo disponível para uma chave PIX cadastrada.</p>
                </div>
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="bankAccounts.length === 0 || balanceAvailableCents <= 0"
                    @click="openWithdrawModal()"
                >
                    <icon-card-send class="mr-1 h-4 w-4" />
                    Solicitar saque
                </button>
            </div>
            <p v-if="bankAccounts.length === 0" class="text-white-dark">Cadastre ao menos uma chave PIX para solicitar saque.</p>
            <p v-else-if="balanceAvailableCents <= 0" class="text-white-dark">Saldo disponível insuficiente para saque.</p>
        </div>

        <!-- Saques -->
        <div class="panel">
            <h5 class="mb-5 text-lg font-semibold dark:text-white-light">Saques</h5>
            <div v-if="loadingWithdraws" class="py-6 text-center text-white-dark">Carregando...</div>
            <div v-else-if="withdraws.length === 0" class="py-6 text-center text-white-dark">Nenhum saque realizado.</div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th class="text-left">Data</th>
                            <th class="text-left">Valor</th>
                            <th class="text-left">Chave</th>
                            <th class="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="w in withdraws" :key="w.id" class="border-t border-white-dark/10">
                            <td>{{ formatDate(w.created_at) }}</td>
                            <td class="font-medium">{{ formatBalance(w.amount) }}</td>
                            <td class="font-mono text-sm">{{ w.account_bank_account?.pix_key_masked || '—' }}</td>
                            <td><span class="badge">{{ statusWithdrawLabel(w.status) }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <CommonDataTablePagination
                v-if="withdrawMeta.total > 0"
                :current-page="withdrawMeta.current_page"
                :total-pages="withdrawMeta.last_page"
                :start-item="(withdrawMeta.current_page - 1) * withdrawMeta.per_page + 1"
                :end-item="Math.min(withdrawMeta.current_page * withdrawMeta.per_page, withdrawMeta.total)"
                :total-items="withdrawMeta.total"
                @page-change="goToWithdrawPage"
            />
        </div>

        <!-- Modal Chave PIX -->
        <Teleport to="body">
            <div v-if="showPixModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="closePixModal">
                <div class="panel relative max-h-[90vh] w-full max-w-md overflow-y-auto" @click.stop>
                    <div class="mb-4 flex items-center justify-between">
                        <h5 class="text-lg font-semibold">{{ editingPix ? 'Editar chave PIX' : 'Nova chave PIX' }}</h5>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-white-dark transition hover:bg-white-dark/10 hover:text-black dark:hover:bg-white-dark/10 dark:hover:text-white-light"
                            aria-label="Fechar"
                            @click="closePixModal"
                        >
                            <icon-x class="h-5 w-5" />
                        </button>
                    </div>
                    <form @submit.prevent="submitPix">
                        <div class="space-y-4">
                            <div>
                                <label class="mb-1 block text-sm font-medium">Tipo da chave</label>
                                <select v-model="pixForm.pix_key_type" class="selectize form-select" required>
                                    <option v-for="opt in pixKeyTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="mb-1 block text-sm font-medium">Chave PIX</label>
                                <input
                                    v-if="pixKeyMaska"
                                    v-model="pixForm.pix_key"
                                    type="text"
                                    class="form-input"
                                    :placeholder="pixKeyPlaceholder"
                                    v-maska="pixKeyMaska"
                                    required
                                />
                                <input
                                    v-else
                                    v-model="pixForm.pix_key"
                                    type="text"
                                    class="form-input"
                                    :placeholder="pixKeyPlaceholder"
                                    :maxlength="pixKeyMaxlength"
                                    required
                                />
                            </div>
                            <label class="flex cursor-pointer items-center gap-2">
                                <input v-model="pixForm.is_primary" type="checkbox" class="form-checkbox shrink-0" />
                                <span class="text-sm leading-none">Definir como chave principal</span>
                            </label>
                        </div>
                        <div class="mt-6 flex justify-end gap-2">
                            <button type="button" class="btn btn-outline-primary" @click="closePixModal">Cancelar</button>
                            <button type="submit" class="btn btn-primary" :disabled="savingPix">{{ savingPix ? 'Salvando...' : 'Salvar' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal Solicitar saque -->
        <Teleport to="body">
            <div v-if="showWithdrawModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="closeWithdrawModal">
                <div class="panel relative max-h-[90vh] w-full max-w-md overflow-y-auto" @click.stop>
                    <div class="mb-4 flex items-center justify-between">
                        <h5 class="text-lg font-semibold">Solicitar saque</h5>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-white-dark transition hover:bg-white-dark/10 hover:text-black dark:hover:bg-white-dark/10 dark:hover:text-white-light"
                            aria-label="Fechar"
                            @click="closeWithdrawModal"
                        >
                            <icon-x class="h-5 w-5" />
                        </button>
                    </div>
                    <form @submit.prevent="submitWithdraw">
                        <div class="space-y-4">
                            <common-amount-input
                                v-model="withdrawForm.amount"
                                label="Valor (R$)"
                                :error="withdrawFormErrors.amount"
                            />
                            <div>
                                <label class="mb-1 block text-sm font-medium">Chave PIX de destino</label>
                                <select v-model="withdrawForm.account_bank_account_id" class="selectize form-select" required>
                                    <option value="">Selecione</option>
                                    <option v-for="ba in bankAccounts" :key="ba.id" :value="ba.id">
                                        {{ pixKeyTypeLabel(ba.pix_key_type) }} – {{ ba.pix_key_masked }}
                                    </option>
                                </select>
                            </div>
                            <p class="text-sm text-white-dark">Disponível: {{ formatBalance(balanceAvailableCents) }}</p>
                            <p class="text-sm" :class="withdrawTransferFeeCents > 0 ? 'text-danger' : 'text-white-dark'">
                                Taxa de transferência: {{ withdrawTransferFeeCents > 0 ? '-' : '' }}{{ formatBalance(withdrawTransferFeeCents) }}
                            </p>
                            <p class="text-sm font-medium text-white-dark">
                                Total debitado: {{ formatBalance(totalDebitCents) }}
                            </p>
                            <p class="text-sm text-white-dark">
                                Mínimo: {{ formatBalance(minWithdrawCents) }} • Máximo: {{ formatBalance(maxWithdrawCents) }}
                            </p>
                        </div>
                        <div class="mt-6 flex justify-end gap-2">
                            <button type="button" class="btn btn-outline-primary" @click="closeWithdrawModal">Cancelar</button>
                            <button type="submit" class="btn btn-primary" :disabled="savingWithdraw">{{ savingWithdraw ? 'Enviando...' : 'Solicitar' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal confirmar exclusão PIX -->
        <Teleport to="body">
            <div v-if="showDeletePixConfirm" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="showDeletePixConfirm = false">
                <div class="panel relative w-full max-w-sm" @click.stop>
                    <div class="mb-2 flex items-center justify-between">
                        <h5 class="text-lg font-semibold">Excluir chave PIX?</h5>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-white-dark transition hover:bg-white-dark/10 hover:text-black dark:hover:bg-white-dark/10 dark:hover:text-white-light"
                            aria-label="Fechar"
                            @click="showDeletePixConfirm = false"
                        >
                            <icon-x class="h-5 w-5" />
                        </button>
                    </div>
                    <p class="mb-4 text-white-dark">A chave {{ bankToDelete?.pix_key_masked }} será removida. Esta ação não pode ser desfeita.</p>
                    <div class="flex justify-end gap-2">
                        <button type="button" class="btn btn-outline-primary" @click="showDeletePixConfirm = false">Cancelar</button>
                        <button type="button" class="btn btn-danger" :disabled="deletingPix" @click="deletePixConfirm">Excluir</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useAppStore } from '@/stores/index';
    import { useSaldo } from '@/composables/useSaldo';
    import type { BankAccount } from '@/composables/useSaldo';

    const store = useAppStore();
    const {
        getBalance,
        getBankAccounts,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setPrimaryBankAccount,
        getWithdraws,
        requestWithdraw,
    } = useSaldo();

    const { formatFromCents } = useFormatCurrency();
    const balanceData = ref({
        balance_available: 0,
        balance_pending: 0,
        transfer_fee: 0,
        min_withdrawal_amount: 1000,
        max_withdrawal_amount: 1000000,
    });
    const bankAccounts = ref<BankAccount[]>([]);
    const withdraws = ref<any[]>([]);
    const withdrawMeta = ref({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });
    const loadingBankAccounts = ref(true);
    const loadingWithdraws = ref(true);

    const balanceAvailableCents = computed(() => balanceData.value.balance_available);
    const balancePendingCents = computed(() => balanceData.value.balance_pending);
    const balanceTotalCents = computed(() => balanceAvailableCents.value + balancePendingCents.value);
    const withdrawTransferFeeCents = computed(() => Number(balanceData.value.transfer_fee || 0));
    const minWithdrawCents = computed(() => Number(balanceData.value.min_withdrawal_amount || 1000));
    const maxWithdrawCents = computed(() => Number(balanceData.value.max_withdrawal_amount || 1000000));
    const withdrawAmountCents = computed(() => {
        const amountReais = Number(withdrawForm.value.amount || 0);
        return Math.max(0, Math.round(amountReais * 100));
    });
    const totalDebitCents = computed(() => withdrawAmountCents.value + withdrawTransferFeeCents.value);

    function formatBalance(cents: number): string {
        if (store.hideValues) return 'R$ ••••••';
        return formatFromCents(cents);
    }

    const showPixModal = ref(false);
    const editingPix = ref<BankAccount | null>(null);
    const savingPix = ref(false);
    const pixForm = ref({
        pix_key_type: 'cpf',
        pix_key: '',
        is_primary: false,
    });

    const showWithdrawModal = ref(false);
    const savingWithdraw = ref(false);
    const withdrawForm = ref({ amount: null as number | null, account_bank_account_id: '' });
    const withdrawFormErrors = ref<{ amount?: string }>({});

    const showDeletePixConfirm = ref(false);
    const bankToDelete = ref<BankAccount | null>(null);
    const deletingPix = ref(false);

    const PIX_KEY_TYPES = [
        { value: 'cpf', label: 'CPF' },
        { value: 'cnpj', label: 'CNPJ' },
        { value: 'email', label: 'E-mail' },
        { value: 'phone', label: 'Telefone' },
        { value: 'random', label: 'Chave aleatória' },
    ];
    const pixKeyTypeOptions = PIX_KEY_TYPES;
    const pixKeyPlaceholder = computed(() => {
        const t = PIX_KEY_TYPES.find((o) => o.value === pixForm.value.pix_key_type);
        if (t?.value === 'email') return 'email@exemplo.com';
        if (t?.value === 'phone') return '(11) 99999-9999';
        if (t?.value === 'cpf') return '000.000.000-00';
        if (t?.value === 'cnpj') return '00.000.000/0001-00';
        return 'Chave PIX';
    });

    /** Máscara do campo Chave PIX conforme o tipo (cpf/cnpj/phone). email e random sem máscara. */
    const pixKeyMaska = computed(() => {
        const t = pixForm.value.pix_key_type;
        if (t === 'cpf') return '###.###.###-##';
        if (t === 'cnpj') return '##.###.###/####-##';
        if (t === 'phone') return '(##) #####-####';
        return undefined;
    });

    /** Limite de caracteres: email 255, chave aleatória 36. CPF/CNPJ/phone limitados pela máscara. */
    const pixKeyMaxlength = computed(() => {
        const t = pixForm.value.pix_key_type;
        if (t === 'email') return 255;
        if (t === 'random') return 36;
        return undefined;
    });

    watch(
        () => pixForm.value.pix_key_type,
        () => {
            pixForm.value.pix_key = '';
        }
    );

    const toast = useToast();

    /** Valor da chave PIX para enviar ao backend: só números para cpf/cnpj/phone; com símbolos para email e random. */
    function getPixKeyValueToSend(): string {
        const { pix_key_type, pix_key } = pixForm.value;
        const raw = pix_key.trim();
        if (pix_key_type === 'cpf' || pix_key_type === 'cnpj' || pix_key_type === 'phone') {
            return raw.replace(/\D/g, '');
        }
        return raw;
    }

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    function pixKeyTypeLabel(type: string): string {
        return PIX_KEY_TYPES.find((o) => o.value === type)?.label || type;
    }
    function statusWithdrawLabel(status: string): string {
        const map: Record<string, string> = {
            pending_approval: 'Pendente',
            processing: 'Processando',
            completed: 'Concluído',
            cancelled: 'Cancelado',
            failed: 'Falhou',
        };
        return map[status] || status;
    }

    async function loadBalance() {
        const res = await getBalance();
        if (res.success && res.data) balanceData.value = res.data;
    }
    async function loadBankAccounts() {
        loadingBankAccounts.value = true;
        const res = await getBankAccounts();
        loadingBankAccounts.value = false;
        if (res.success && res.data) bankAccounts.value = res.data;
    }
    async function loadWithdraws(page = withdrawMeta.value.current_page) {
        loadingWithdraws.value = true;
        const res = await getWithdraws(withdrawMeta.value.per_page, page);
        loadingWithdraws.value = false;
        if (res.success) {
            withdraws.value = res.data || [];
            if (res.meta) {
                withdrawMeta.value = {
                    current_page: res.meta.current_page,
                    last_page: res.meta.last_page,
                    per_page: res.meta.per_page,
                    total: res.meta.total,
                };
            }
        }
    }

    async function goToWithdrawPage(page: number) {
        withdrawMeta.value.current_page = page;
        await loadWithdraws(page);
    }

    function openPixModal(ba?: BankAccount) {
        editingPix.value = ba ?? null;
        pixForm.value = {
            pix_key_type: ba?.pix_key_type ?? 'cpf',
            pix_key: '', // nunca preencher chave em edição por segurança
            is_primary: ba?.is_primary ?? false,
        };
        showPixModal.value = true;
    }
    function closePixModal() {
        showPixModal.value = false;
        editingPix.value = null;
    }
    async function submitPix() {
        savingPix.value = true;
        const { pix_key_type, pix_key, is_primary } = pixForm.value;
        const valueToSend = getPixKeyValueToSend();
        if (!valueToSend && !editingPix.value) {
            toast.error('Informe a chave PIX.');
            savingPix.value = false;
            return;
        }
        const payload = { pix_key_type, pix_key: valueToSend, is_primary };
        const res = editingPix.value
            ? await updateBankAccount(editingPix.value.id, { ...payload, pix_key: valueToSend || undefined })
            : await addBankAccount(payload);
        savingPix.value = false;
        if (res.success) {
            toast.success(editingPix.value ? 'Chave atualizada.' : 'Chave cadastrada.');
            closePixModal();
            await loadBankAccounts();
            await loadBalance();
        } else {
            toast.error(res.error || 'Erro ao salvar.');
        }
    }

    function confirmDeletePix(ba: BankAccount) {
        bankToDelete.value = ba;
        showDeletePixConfirm.value = true;
    }
    async function deletePixConfirm() {
        if (!bankToDelete.value) return;
        deletingPix.value = true;
        const res = await deleteBankAccount(bankToDelete.value.id);
        deletingPix.value = false;
        showDeletePixConfirm.value = false;
        bankToDelete.value = null;
        if (res.success) {
            toast.success('Chave excluída.');
            await loadBankAccounts();
            await loadBalance();
        } else {
            toast.error(res.error || 'Erro ao excluir.');
        }
    }
    async function setPrimary(id: number) {
        const res = await setPrimaryBankAccount(id);
        if (res.success) {
            toast.success('Chave definida como principal.');
            await loadBankAccounts();
        } else {
            toast.error(res.error || 'Erro.');
        }
    }

    function openWithdrawModal() {
        withdrawForm.value = { amount: null, account_bank_account_id: bankAccounts.value[0]?.id?.toString() || '' };
        withdrawFormErrors.value = {};
        showWithdrawModal.value = true;
    }
    function closeWithdrawModal() {
        showWithdrawModal.value = false;
    }
    async function submitWithdraw() {
        const amountReais = withdrawForm.value.amount;
        const accountBankAccountId = parseInt(withdrawForm.value.account_bank_account_id, 10);
        withdrawFormErrors.value = {};
        if (amountReais == null || amountReais < 0.01) {
            withdrawFormErrors.value.amount = 'Informe um valor válido (mín. R$ 0,01).';
            return;
        }
        if (!accountBankAccountId) {
            toast.error('Selecione a chave PIX de destino.');
            return;
        }
        const amountCents = Math.round(amountReais * 100);
        savingWithdraw.value = true;
        const res = await requestWithdraw(amountCents, accountBankAccountId);
        savingWithdraw.value = false;
        if (res.success) {
            toast.success('Saque solicitado com sucesso.');
            closeWithdrawModal();
            await loadBalance();
            await loadWithdraws();
        } else {
            toast.error(res.error || 'Erro ao solicitar saque.');
        }
    }

    async function refreshAll() {
        await Promise.all([loadBalance(), loadBankAccounts(), loadWithdraws()]);
    }

    onMounted(async () => {
        await loadBalance();
        await loadBankAccounts();
        await loadWithdraws();
    });

    useHead({ title: 'Saldo' });
    definePageMeta({ middleware: 'auth' });
</script>
