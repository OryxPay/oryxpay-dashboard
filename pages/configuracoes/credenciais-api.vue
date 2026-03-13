<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Credenciais de API</h5>
                <p class="text-white-dark">
                    Utilize essas chaves para integrar seus checkouts e automações. Envie no header
                    <code class="rounded bg-white-dark/10 px-1 py-0.5 text-xs">X-Api-Key</code>.
                </p>
            </div>
            <NuxtLink to="/docs" class="btn btn-outline-info btn-sm">
                <icon-arrow-forward class="h-4 w-4 mr-1" />
                Documentação
            </NuxtLink>
        </div>

        <div class="panel overflow-hidden">
            <div v-if="loading" class="flex min-h-[200px] items-center justify-center py-12">
                <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-l-transparent" />
            </div>

            <template v-else>
                <!-- Alerta: Conta inativa -->
                <div
                    v-if="!credentials.is_active"
                    class="mb-6 flex gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-danger dark:border-danger/20 dark:bg-danger/10"
                >
                    <div class="shrink-0 pt-0.5">
                        <icon-info-circle class="h-5 w-5" />
                    </div>
                    <div class="min-w-0 text-sm">
                        <p class="font-semibold">Conta inativa</p>
                        <p class="mt-0.5 opacity-90">
                            Sua conta está inativa. Não é possível gerar ou utilizar credenciais de API. Entre em contato com o suporte para mais informações.
                        </p>
                    </div>
                </div>

                <!-- Alerta: Documentos não aprovados -->
                <div
                    v-else-if="!credentials.has_approved_documents"
                    class="mb-6 flex gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-warning dark:border-warning/20 dark:bg-warning/10"
                >
                    <div class="shrink-0 pt-0.5">
                        <icon-info-circle class="h-5 w-5" />
                    </div>
                    <div class="min-w-0 text-sm">
                        <p class="font-semibold">Documentos em análise</p>
                        <p class="mt-0.5 opacity-90">
                            Seus documentos ainda não foram aprovados. Complete a verificação da sua conta para poder gerar credenciais de API.
                        </p>
                        <NuxtLink to="/configuracoes/minha-conta" class="mt-2 inline-flex items-center gap-1 text-sm font-medium hover:underline">
                            Ir para Minha Conta
                            <icon-arrow-forward class="h-3.5 w-3.5" />
                        </NuxtLink>
                    </div>
                </div>
                <!-- Aviso de segurança -->
                <div class="mb-6 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 dark:border-primary/20 dark:bg-primary/10">
                    <div class="shrink-0 pt-0.5">
                        <icon-info-circle class="h-5 w-5 text-primary" />
                    </div>
                    <div class="min-w-0 text-sm">
                        <p class="font-semibold dark:text-white-light">Mantenha essa chave em segredo!</p>
                        <p class="mt-0.5 text-white-dark">
                            A chave permite acesso aos dados da sua empresa, vendas e clientes. Não divulgue e não commite em repositórios.
                        </p>
                    </div>
                </div>

                <div class="rounded-xl border border-white-dark/15 bg-white/[0.02]">
                    <div class="border-b border-white-dark/10 px-4 py-3">
                        <h6 class="font-semibold dark:text-white-light">Chave de API</h6>
                    </div>
                    <div class="space-y-3 p-4 md:p-5">
                        <div
                            v-if="newApiKey"
                            class="rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-success"
                        >
                            Chave gerada. Guarde em local seguro: ela não será exibida novamente.
                        </div>

                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-white-dark">
                                <icon-lock class="h-4 w-4" />
                            </span>
                            <input
                                v-if="newApiKey"
                                :value="newApiKey"
                                :type="showGeneratedKey ? 'text' : 'password'"
                                readonly
                                class="form-input w-full pl-10 pr-24 font-mono text-sm"
                            />
                            <input
                                v-else
                                :value="credentials.has_api_key ? 'sk_•••••••••••••••••••••••••••••••' : ''"
                                type="text"
                                readonly
                                :placeholder="credentials.has_api_key ? '' : 'Nenhuma chave gerada'"
                                class="form-input w-full pl-10 pr-24 font-mono text-sm"
                            />
                            <div class="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                                <button
                                    v-if="newApiKey"
                                    type="button"
                                    class="rounded p-1.5 text-white-dark hover:bg-white-dark/10 hover:text-white-light"
                                    title="Copiar chave"
                                    @click="copyKey"
                                >
                                    <icon-copy class="h-4 w-4" />
                                </button>
                                <button
                                    v-if="newApiKey"
                                    type="button"
                                    class="rounded p-1.5 text-white-dark hover:bg-white-dark/10 hover:text-white-light"
                                    :title="showGeneratedKey ? 'Ocultar chave' : 'Mostrar chave'"
                                    @click="showGeneratedKey = !showGeneratedKey"
                                >
                                    <icon-eye class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p class="text-xs text-white-dark">
                            <span v-if="credentials.has_api_key">Por segurança, a chave não pode ser visualizada após a geração.</span>
                            <span v-else>Gere sua primeira chave para autenticar suas requisições.</span>
                        </p>
                        <p v-if="credentials.has_api_key && credentials.api_key_last_used_at" class="text-xs text-white-dark">
                            Último uso: {{ formatDate(credentials.api_key_last_used_at) }}
                        </p>
                        <p v-if="credentials.has_api_key" class="text-xs text-white-dark">
                            Ao redefinir, uma nova chave será gerada e a atual deixará de funcionar.
                        </p>

                        <div class="pt-3 flex justify-end">
                            <button
                                type="button"
                                :class="[
                                    'btn inline-flex items-center gap-2 shadow-sm',
                                    credentials.has_api_key ? 'btn-danger' : 'btn-primary',
                                ]"
                                :disabled="generating || !credentials.can_generate"
                                :title="!credentials.can_generate ? 'Não é possível gerar credenciais no momento' : ''"
                                @click="generateKey"
                            >
                                <icon-refresh v-if="credentials.has_api_key" class="h-4 w-4" />
                                <span v-if="generating">Gerando...</span>
                                <span v-else>{{ credentials.has_api_key ? 'Redefinir chave' : 'Gerar chave de API' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-6 rounded-xl border border-white-dark/15 bg-white/[0.02] overflow-hidden">
                    <div class="border-b border-white-dark/10 px-4 py-3">
                        <h6 class="font-semibold dark:text-white-light">Como utilizar</h6>
                    </div>
                    <div class="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-5">
                        <div class="flex gap-3 rounded-lg border border-white-dark/10 bg-white-dark/5 p-3">
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">1</div>
                            <div>
                                <p class="text-sm font-semibold dark:text-white-light">Adicione o header</p>
                                <code class="mt-1 inline-block rounded bg-white-dark/10 px-2 py-1 text-xs">X-Api-Key: sk_seu_token_aqui</code>
                            </div>
                        </div>

                        <div class="flex gap-3 rounded-lg border border-white-dark/10 bg-white-dark/5 p-3">
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">2</div>
                            <div>
                                <p class="text-sm font-semibold dark:text-white-light">Faça requisições</p>
                                <code class="mt-1 inline-block rounded bg-white-dark/10 px-2 py-1 text-xs">POST {{ baseUrl }}/api/v1/transactions</code>
                            </div>
                        </div>

                        <div class="flex gap-3 rounded-lg border border-white-dark/10 bg-white-dark/5 p-3">
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">3</div>
                            <div>
                                <p class="text-sm font-semibold dark:text-white-light">Configure webhooks</p>
                                <p class="mt-1 text-xs text-white-dark">Receba notificações de pagamento em tempo real na sua aplicação.</p>
                            </div>
                        </div>

                        <div class="flex gap-3 rounded-lg border border-white-dark/10 bg-white-dark/5 p-3">
                            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">4</div>
                            <div>
                                <p class="text-sm font-semibold dark:text-white-light">Consulte a documentação</p>
                                <NuxtLink to="/docs" class="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                    Ver exemplos e referência
                                    <icon-arrow-forward class="h-3 w-3" />
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
    interface ApiCredentialsData {
        has_api_key: boolean;
        api_key_last_used_at: string | null;
        can_generate: boolean;
        is_active: boolean;
        has_approved_documents: boolean;
    }

    useHead({ title: 'Credenciais de API' });
    definePageMeta({ middleware: 'auth' });

    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const toast = useToast();

    const loading = ref(true);
    const generating = ref(false);
    const showGeneratedKey = ref(true);
    const credentials = ref<ApiCredentialsData>({
        has_api_key: false,
        api_key_last_used_at: null,
        can_generate: false,
        is_active: true,
        has_approved_documents: false,
    });
    const newApiKey = ref<string | null>(null);

    const baseUrl = (config.public.apiBase as string).replace(/\/api\/?$/, '') || '';

    function formatDate(iso: string | null): string {
        if (!iso) return '—';
        try {
            const d = new Date(iso);
            return d.toLocaleString('pt-BR');
        } catch {
            return iso;
        }
    }

    async function loadCredentials() {
        loading.value = true;
        try {
            const res = await $api<{ success: boolean; data: ApiCredentialsData }>('/account/api-credentials', { method: 'GET' });
            if (res?.data) {
                credentials.value = {
                    has_api_key: res.data.has_api_key ?? false,
                    api_key_last_used_at: res.data.api_key_last_used_at ?? null,
                    can_generate: res.data.can_generate ?? false,
                    is_active: res.data.is_active ?? true,
                    has_approved_documents: res.data.has_approved_documents ?? false,
                };
            }
        } catch {
            credentials.value = { has_api_key: false, api_key_last_used_at: null, can_generate: false, is_active: true, has_approved_documents: false };
        } finally {
            loading.value = false;
        }
    }

    async function generateKey() {
        if (!credentials.value.can_generate) {
            toast.error('Não é possível gerar credenciais no momento.');
            return;
        }

        generating.value = true;
        newApiKey.value = null;
        try {
            const res = await $api<{ success: boolean; data: { api_key: string }; message?: string }>('/account/api-credentials', { method: 'POST' });
            if (res?.data?.api_key) {
                newApiKey.value = res.data.api_key;
                credentials.value = {
                    ...credentials.value,
                    has_api_key: true,
                    api_key_last_used_at: null,
                };
                showGeneratedKey.value = true;
            }
        } catch (err: any) {
            const msg = err?.data?.message ?? err?.data?.error ?? err?.message ?? 'Erro ao gerar chave.';
            toast.error(msg);
        } finally {
            generating.value = false;
        }
    }

    function copyKey() {
        if (!newApiKey.value) return;
        navigator.clipboard.writeText(newApiKey.value).then(() => {
            toast.success('Chave copiada para a área de transferência.');
        }).catch(() => {
            toast.error('Não foi possível copiar.');
        });
    }

    onMounted(() => {
        loadCredentials();
    });
</script>
