<template>
    <div>
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Webhooks</h5>
                <p class="text-white-dark">Cadastre webhooks para receber notificações de eventos.</p>
            </div>
            <div class="flex items-center gap-2">
                <button type="button" class="btn btn-outline-warning" @click="refreshCurrentTab" :disabled="loading || loadingLogs">
                    <icon-refresh class="h-4 w-4 mr-1" :class="{ 'animate-spin': loading || loadingLogs }" /> Atualizar
                </button>
                <button
                    v-if="activeTab === 'webhooks'"
                    type="button"
                    class="btn btn-primary"
                    :disabled="webhooks.length >= 5"
                    @click="openModal()"
                >
                    <icon-plus class="mr-1 h-4 w-4" />
                    Criar webhook
                </button>
            </div>
        </div>

        <!-- Tabs: Webhooks | Logs -->
        <div class="mb-5 flex gap-1 rounded-lg border border-white-dark/20 bg-white-dark/5 p-1 dark:border-white-dark/10 dark:bg-white-dark/5">
            <button
                type="button"
                :class="[
                    'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
                    activeTab === 'webhooks'
                        ? 'bg-primary text-white'
                        : 'text-white-dark hover:bg-white-dark/10 dark:hover:bg-white-dark/10',
                ]"
                @click="activeTab = 'webhooks'"
            >
                <icon-link class="h-4 w-4" />
                Webhooks
            </button>
            <button
                type="button"
                :class="[
                    'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition',
                    activeTab === 'logs'
                        ? 'bg-primary text-white'
                        : 'text-white-dark hover:bg-white-dark/10 dark:hover:bg-white-dark/10',
                ]"
                @click="activeTab = 'logs'; loadLogs()"
            >
                <icon-receipt class="h-4 w-4" />
                Logs
            </button>
        </div>

        <!-- Tab: Webhooks -->
        <div v-show="activeTab === 'webhooks'" class="panel">
            <div v-if="loading" class="py-12 text-center text-white-dark">Carregando...</div>
            <div v-else-if="webhooks.length === 0" class="py-12">
                <common-empty-state
                    title="Sem registros"
                    message="Nenhum webhook cadastrado. Cadastre até 5 webhooks para receber notificações de eventos."
                    action-label="Criar webhook"
                    @action="openModal()"
                />
            </div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th class="text-left">Nome</th>
                            <th class="text-left">Url</th>
                            <th class="text-left">Evento</th>
                            <th class="text-left">Status</th>
                            <th class="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="w in paginatedWebhooks" :key="w.id" class="border-t border-white-dark/10">
                            <td class="font-medium">{{ w.name }}</td>
                            <td class="max-w-xs truncate font-mono text-sm" :title="w.url">{{ w.url }}</td>
                            <td class="text-sm">{{ eventLabel(w.event) }}</td>
                            <td>
                                <span :class="w.is_active ? 'badge badge-outline-success' : 'badge badge-outline-danger'">
                                    {{ w.is_active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="whitespace-nowrap text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button type="button" class="btn btn-sm btn-outline-primary" @click="openModal(w)">
                                        Editar
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-danger" @click="confirmDelete(w)">
                                        Excluir
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <CommonDataTablePagination
                v-if="!loading && webhooks.length > 0"
                :current-page="webhooksPage"
                :total-pages="webhooksTotalPages"
                :start-item="webhooksStart"
                :end-item="webhooksEnd"
                :total-items="webhooks.length"
                @page-change="goToWebhooksPage"
            />
        </div>

        <!-- Tab: Logs -->
        <div v-show="activeTab === 'logs'" class="panel">
            <div v-if="loadingLogs" class="py-12 text-center text-white-dark">Carregando...</div>
            <div v-else-if="logs.length === 0" class="py-12 text-center text-white-dark">Nenhum log de webhook.</div>
            <div v-else class="overflow-x-auto">
                <table class="table-auto">
                    <thead>
                        <tr>
                            <th class="text-left">Data</th>
                            <th class="text-left">Webhook</th>
                            <th class="text-left">Evento</th>
                            <th class="text-left">Status</th>
                            <th class="text-left">HTTP</th>
                            <th class="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="log in paginatedLogs" :key="log.id" class="border-t border-white-dark/10">
                            <td class="text-sm">{{ formatDate(log.created_at) }}</td>
                            <td class="max-w-xs truncate font-mono text-sm" :title="log.webhook?.url">{{ log.webhook?.name || log.webhook?.url }}</td>
                            <td class="text-sm">{{ eventLabel(log.event) }}</td>
                            <td>
                                <span :class="log.status === 'success' ? 'badge badge-outline-success' : 'badge badge-outline-danger'">
                                    {{ log.status }}
                                </span>
                            </td>
                            <td class="text-sm">{{ log.response_status ?? '—' }}</td>
                            <td class="text-center">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-primary p-1.5"
                                    title="Ver detalhes"
                                    @click="openLogDetails(log)"
                                >
                                    <icon-eye class="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <CommonDataTablePagination
                v-if="!loadingLogs && logs.length > 0"
                :current-page="logsPage"
                :total-pages="logsTotalPages"
                :start-item="logsStart"
                :end-item="logsEnd"
                :total-items="logs.length"
                @page-change="goToLogsPage"
            />
        </div>

        <!-- Modal Criar/Editar Webhook -->
        <Teleport to="body">
            <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="closeModal">
                <div class="panel relative max-h-[90vh] w-full max-w-md overflow-y-auto" @click.stop>
                    <div class="mb-4 flex items-center justify-between">
                        <h5 class="text-lg font-semibold">{{ editingWebhook ? 'Editar webhook' : 'Criar webhook' }}</h5>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-white-dark transition hover:bg-white-dark/10 hover:text-black dark:hover:text-white-light"
                            aria-label="Fechar"
                            @click="closeModal"
                        >
                            <icon-x class="h-5 w-5" />
                        </button>
                    </div>
                    <form @submit.prevent="submitWebhook">
                        <div class="space-y-4">
                            <div>
                                <label class="mb-1 block text-sm font-medium">Nome *</label>
                                <input v-model="form.name" type="text" class="form-input" placeholder="Ex: Notificação Cobrança" required maxlength="255" />
                            </div>
                            <div>
                                <label class="mb-1 block text-sm font-medium">Url *</label>
                                <input v-model="form.url" type="url" class="form-input" placeholder="https://..." required maxlength="512" />
                            </div>
                            <div>
                                <label class="mb-1 block text-sm font-medium">Evento</label>
                                <select v-model="form.event" class="selectize form-select" required>
                                    <option value="">Selecione uma opção</option>
                                    <option v-for="(label, value) in eventOptions" :key="value" :value="value">
                                        {{ value }} - ({{ label }})
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="mb-1 block text-sm font-medium">Status</label>
                                <label class="relative inline-flex w-12 h-6 cursor-pointer items-center">
                                    <input
                                        v-model="form.is_active"
                                        type="checkbox"
                                        class="peer sr-only"
                                    />
                                    <span
                                        class="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-6 w-12 rounded-full before:absolute before:left-1 before:bottom-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:transition-all dark:before:bg-white-dark peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary"
                                    />
                                </label>
                                <span class="ml-2 text-sm text-white-dark"></span>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end gap-2">
                            <button type="button" class="btn btn-outline-primary" @click="closeModal">Cancelar</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Salvando...' : editingWebhook ? 'Salvar' : 'Criar' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>

        <!-- Modal confirmar exclusão -->
        <Teleport to="body">
            <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="showDeleteConfirm = false">
                <div class="panel relative w-full max-w-sm" @click.stop>
                    <h5 class="mb-2 text-lg font-semibold">Excluir webhook?</h5>
                    <p class="mb-4 text-white-dark">O webhook "{{ webhookToDelete?.name }}" será removido.</p>
                    <div class="flex justify-end gap-2">
                        <button type="button" class="btn btn-outline-primary" @click="showDeleteConfirm = false">Cancelar</button>
                        <button type="button" class="btn btn-danger" :disabled="deleting" @click="doDelete">Excluir</button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Modal Detalhes do Log -->
        <Teleport to="body">
            <div v-if="showLogModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="closeLogModal">
                <div class="panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto" @click.stop>
                    <div class="mb-4 flex items-center justify-between">
                        <h5 class="text-lg font-semibold">Detalhes do Log</h5>
                        <button
                            type="button"
                            class="flex h-8 w-8 items-center justify-center rounded-full text-white-dark transition hover:bg-white-dark/10 hover:text-black dark:hover:text-white-light"
                            aria-label="Fechar"
                            @click="closeLogModal"
                        >
                            <icon-x class="h-5 w-5" />
                        </button>
                    </div>

                    <div v-if="selectedLog" class="space-y-4">
                        <!-- Info básica -->
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-white-dark">Data/Hora</p>
                                <p class="text-sm font-medium dark:text-white-light">{{ formatDate(selectedLog.created_at) }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-white-dark">Status</p>
                                <span :class="selectedLog.status === 'success' ? 'badge badge-outline-success' : 'badge badge-outline-danger'">
                                    {{ selectedLog.status }}
                                </span>
                            </div>
                            <div>
                                <p class="text-xs text-white-dark">Evento</p>
                                <p class="text-sm font-medium dark:text-white-light">{{ selectedLog.event }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-white-dark">HTTP Status</p>
                                <p class="text-sm font-medium dark:text-white-light">{{ selectedLog.response_status ?? '—' }}</p>
                            </div>
                        </div>

                        <!-- Webhook info -->
                        <div class="rounded-lg border border-white-dark/20 p-3">
                            <p class="text-xs text-white-dark mb-1">Webhook</p>
                            <p class="text-sm font-medium dark:text-white-light">{{ selectedLog.webhook?.name || '—' }}</p>
                            <p class="font-mono text-xs text-white-dark break-all">{{ selectedLog.webhook?.url || '—' }}</p>
                        </div>

                        <!-- Payload enviado -->
                        <div>
                            <p class="text-xs text-white-dark mb-2">Payload Enviado</p>
                            <div class="rounded-lg bg-slate-900 p-3 overflow-x-auto">
                                <pre class="text-xs text-slate-300 whitespace-pre-wrap break-all">{{ formatJson(selectedLog.payload) }}</pre>
                            </div>
                        </div>

                        <!-- Response recebida -->
                        <div v-if="selectedLog.response_body">
                            <p class="text-xs text-white-dark mb-2">Response</p>
                            <div class="rounded-lg bg-slate-900 p-3 overflow-x-auto">
                                <pre class="text-xs text-slate-300 whitespace-pre-wrap break-all">{{ formatJson(selectedLog.response_body) }}</pre>
                            </div>
                        </div>

                        <!-- Erro -->
                        <div v-if="selectedLog.error">
                            <p class="text-xs text-white-dark mb-2">Erro</p>
                            <div class="rounded-lg bg-danger/10 border border-danger/30 p-3">
                                <p class="text-sm text-danger">{{ selectedLog.error }}</p>
                            </div>
                        </div>

                        <!-- Tentativas -->
                        <div v-if="selectedLog.attempt" class="text-xs text-white-dark">
                            Tentativa {{ selectedLog.attempt }} de {{ selectedLog.max_attempts || 3 }}
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button type="button" class="btn btn-outline-primary" @click="closeLogModal">Fechar</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, computed, watch } from 'vue';

    const { $api } = useNuxtApp();
    const toast = useToast();

    const activeTab = ref<'webhooks' | 'logs'>('webhooks');
    const loading = ref(true);
    const loadingLogs = ref(false);
    const webhooks = ref<any[]>([]);
    const logs = ref<any[]>([]);
    const webhooksPage = ref(1);
    const logsPage = ref(1);
    const perPage = 10;
    const eventOptions = ref<Record<string, string>>({});

    const showModal = ref(false);
    const editingWebhook = ref<any>(null);
    const saving = ref(false);
    const form = ref({
        name: '',
        url: '',
        event: '',
        is_active: true,
    });

    const showDeleteConfirm = ref(false);
    const webhookToDelete = ref<any>(null);
    const deleting = ref(false);

    // Log details modal
    const showLogModal = ref(false);
    const selectedLog = ref<any>(null);
    const webhooksTotalPages = computed(() => Math.max(1, Math.ceil(webhooks.value.length / perPage)));
    const logsTotalPages = computed(() => Math.max(1, Math.ceil(logs.value.length / perPage)));
    const paginatedWebhooks = computed(() => {
        const start = (webhooksPage.value - 1) * perPage;
        return webhooks.value.slice(start, start + perPage);
    });
    const paginatedLogs = computed(() => {
        const start = (logsPage.value - 1) * perPage;
        return logs.value.slice(start, start + perPage);
    });
    const webhooksStart = computed(() => (webhooks.value.length === 0 ? 0 : (webhooksPage.value - 1) * perPage + 1));
    const webhooksEnd = computed(() => Math.min(webhooksPage.value * perPage, webhooks.value.length));
    const logsStart = computed(() => (logs.value.length === 0 ? 0 : (logsPage.value - 1) * perPage + 1));
    const logsEnd = computed(() => Math.min(logsPage.value * perPage, logs.value.length));

    function goToWebhooksPage(page: number) {
        if (page < 1 || page > webhooksTotalPages.value || page === webhooksPage.value) return;
        webhooksPage.value = page;
    }

    function goToLogsPage(page: number) {
        if (page < 1 || page > logsTotalPages.value || page === logsPage.value) return;
        logsPage.value = page;
    }

    function eventLabel(eventKey: string): string {
        return eventOptions.value[eventKey] ?? eventKey;
    }
    function formatDate(s: string): string {
        return new Date(s).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    function formatJson(data: any): string {
        if (!data) return '—';
        if (typeof data === 'string') {
            try {
                return JSON.stringify(JSON.parse(data), null, 2);
            } catch {
                return data;
            }
        }
        return JSON.stringify(data, null, 2);
    }
    function openLogDetails(log: any) {
        selectedLog.value = log;
        showLogModal.value = true;
    }
    function closeLogModal() {
        showLogModal.value = false;
        selectedLog.value = null;
    }

    async function loadWebhooks() {
        loading.value = true;
        try {
            const res = await $api<{ success: boolean; data: any[] }>('/account/webhooks', { method: 'GET' });
            if (res.success && res.data) webhooks.value = res.data;
            webhooksPage.value = 1;
        } finally {
            loading.value = false;
        }
    }
    async function loadEvents() {
        try {
            const res = await $api<{ success: boolean; data: Record<string, string> }>('/account/webhooks/events', { method: 'GET' });
            if (res.success && res.data) eventOptions.value = res.data;
        } catch (_) {
            eventOptions.value = {
                // 'EVENT:CASH_OUT': 'Transação Pix',
                'EVENT:CHARGE_EXPIRED': 'Cobrança Expirada',
                'EVENT:CHARGE_PAID': 'Cobrança Paga',
                'EVENT:CHARGE_REFUND': 'Cobrança Extornada',
                'EVENT:MED_CREATED': 'Med Criado',
                'EVENT:MED_REJECTED': 'Med Rejeitado e Favorável a empresa',
                'EVENT:MED_CANCELLED': 'Med Cancelado',
                'EVENT:MED_ACCEPTED': 'Med Aceito e Favorável ao cliente',
            };
        }
    }
    async function loadLogs() {
        loadingLogs.value = true;
        try {
            const res = await $api<{ success: boolean; data: any[] }>('/account/webhooks/logs', { method: 'GET', query: { per_page: 50 } });
            if (res.success && res.data) logs.value = res.data;
            logsPage.value = 1;
        } finally {
            loadingLogs.value = false;
        }
    }

    function refreshCurrentTab() {
        if (activeTab.value === 'webhooks') {
            loadWebhooks();
        } else {
            loadLogs();
        }
    }

    function openModal(w?: any) {
        editingWebhook.value = w ?? null;
        form.value = {
            name: w?.name ?? '',
            url: w?.url ?? '',
            event: w?.event ?? '',
            is_active: w !== undefined ? w.is_active : true,
        };
        showModal.value = true;
    }
    function closeModal() {
        showModal.value = false;
        editingWebhook.value = null;
    }
    async function submitWebhook() {
        saving.value = true;
        try {
            if (editingWebhook.value) {
                const res = await $api<{ success: boolean }>(`/account/webhooks/${editingWebhook.value.id}`, {
                    method: 'PUT',
                    body: form.value,
                });
                if (res.success) {
                    toast.success('Webhook atualizado.');
                    closeModal();
                    await loadWebhooks();
                } else {
                    toast.error('Erro ao atualizar.');
                }
            } else {
                const res = await $api<{ success: boolean; error?: string }>('/account/webhooks', {
                    method: 'POST',
                    body: form.value,
                });
                if (res.success) {
                    toast.success('Webhook criado.');
                    closeModal();
                    await loadWebhooks();
                } else {
                    toast.error(res.error ?? 'Erro ao criar.');
                }
            }
        } catch (e: any) {
            toast.error(e?.data?.error ?? e?.data?.message ?? 'Erro ao salvar.');
        } finally {
            saving.value = false;
        }
    }

    function confirmDelete(w: any) {
        webhookToDelete.value = w;
        showDeleteConfirm.value = true;
    }
    async function doDelete() {
        if (!webhookToDelete.value) return;
        deleting.value = true;
        try {
            await $api(`/account/webhooks/${webhookToDelete.value.id}`, { method: 'DELETE' });
            toast.success('Webhook excluído.');
            showDeleteConfirm.value = false;
            webhookToDelete.value = null;
            await loadWebhooks();
        } catch (e: any) {
            toast.error(e?.data?.message ?? 'Erro ao excluir.');
        } finally {
            deleting.value = false;
        }
    }

    onMounted(async () => {
        await loadEvents();
        await loadWebhooks();
    });

    watch(activeTab, (tab) => {
        if (tab === 'webhooks') {
            webhooksPage.value = 1;
            return;
        }
        logsPage.value = 1;
    });

    useHead({ title: 'Webhooks' });
    definePageMeta({ middleware: 'auth' });
</script>
