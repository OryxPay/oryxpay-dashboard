<template>
    <div>
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h5 class="text-lg font-semibold dark:text-white-light">Liquidantes por método</h5>
                <p class="text-white-dark">
                    Escolha qual liquidante será usada em cada método de pagamento entre as opções habilitadas pelo manager.
                </p>
            </div>
            <button type="button" class="btn btn-outline-warning" :disabled="loading" @click="loadData">
                <icon-refresh class="h-4 w-4 mr-1" :class="{ 'animate-spin': loading }" />
                Atualizar
            </button>
        </div>

        <div class="panel">
            <div v-if="loading" class="py-10 text-center text-white-dark">Carregando...</div>
            <template v-else>
                <div class="mb-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                    <p class="font-semibold dark:text-white-light">Dica</p>
                    <p class="mt-1 text-white-dark">
                        A liquidante definida aqui será usada por padrão nas vendas de cada método.
                    </p>
                </div>

                <div class="grid gap-4 md:grid-cols-3">
                    <div class="rounded-lg border border-white-dark/15 p-4">
                        <div class="mb-3 flex items-center justify-between">
                            <h6 class="font-semibold dark:text-white-light">PIX</h6>
                            <span class="badge badge-outline-info">Método</span>
                        </div>
                        <select v-model="form.acquirer_id_pix" class="selectize form-select">
                            <option :value="null">— Nenhuma —</option>
                            <option v-for="a in availablePix" :key="a.id" :value="a.id">{{ a.title || a.slug }}</option>
                        </select>
                    </div>

                    <div class="rounded-lg border border-white-dark/15 p-4">
                        <div class="mb-3 flex items-center justify-between">
                            <h6 class="font-semibold dark:text-white-light">Boleto</h6>
                            <span class="badge badge-outline-warning">Método</span>
                        </div>
                        <select v-model="form.acquirer_id_boleto" class="selectize form-select">
                            <option :value="null">— Nenhuma —</option>
                            <option v-for="a in availableBoleto" :key="a.id" :value="a.id">{{ a.title || a.slug }}</option>
                        </select>
                    </div>

                    <div class="rounded-lg border border-white-dark/15 p-4">
                        <div class="mb-3 flex items-center justify-between">
                            <h6 class="font-semibold dark:text-white-light">Cartão</h6>
                            <span class="badge badge-outline-primary">Método</span>
                        </div>
                        <select v-model="form.acquirer_id_card" class="selectize form-select">
                            <option :value="null">— Nenhuma —</option>
                            <option v-for="a in availableCard" :key="a.id" :value="a.id">{{ a.title || a.slug }}</option>
                        </select>
                    </div>
                </div>

                <div class="mt-5 flex flex-wrap justify-end gap-2 border-t border-white-dark/10 pt-4">
                    <button type="button" class="btn btn-outline-secondary" :disabled="saving" @click="loadData">
                        Recarregar
                    </button>
                    <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
                        {{ saving ? 'Salvando...' : 'Salvar alterações' }}
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
    interface AcquirerOption {
        id: number;
        slug: string;
        title?: string | null;
    }

    interface MethodOptions {
        available: AcquirerOption[];
        selected_id: number | null;
    }

    interface AvailableAcquirersResponse {
        pix: MethodOptions;
        boleto: MethodOptions;
        card: MethodOptions;
    }

    definePageMeta({ middleware: 'auth' });
    useHead({ title: 'Liquidantes' });

    const { $api } = useNuxtApp();
    const toast = useToast();

    const loading = ref(true);
    const saving = ref(false);
    const availablePix = ref<AcquirerOption[]>([]);
    const availableBoleto = ref<AcquirerOption[]>([]);
    const availableCard = ref<AcquirerOption[]>([]);

    const form = ref({
        acquirer_id_pix: null as number | null,
        acquirer_id_boleto: null as number | null,
        acquirer_id_card: null as number | null,
    });

    async function loadData() {
        loading.value = true;
        try {
            const res = await $api<{ success: boolean; data: AvailableAcquirersResponse }>('/account/available-acquirers', { method: 'GET' });
            const data = res?.data;
            availablePix.value = data?.pix?.available || [];
            availableBoleto.value = data?.boleto?.available || [];
            availableCard.value = data?.card?.available || [];
            form.value = {
                acquirer_id_pix: data?.pix?.selected_id ?? null,
                acquirer_id_boleto: data?.boleto?.selected_id ?? null,
                acquirer_id_card: data?.card?.selected_id ?? null,
            };
        } catch (e: any) {
            toast.error(e?.data?.message || 'Erro ao carregar liquidantes.');
        } finally {
            loading.value = false;
        }
    }

    async function save() {
        saving.value = true;
        try {
            await $api('/account/select-acquirer', {
                method: 'PUT',
                body: form.value,
            });
            toast.success('Liquidantes atualizadas com sucesso.');
            await loadData();
        } catch (e: any) {
            toast.error(e?.data?.error || e?.data?.message || 'Erro ao salvar liquidantes.');
        } finally {
            saving.value = false;
        }
    }

    onMounted(loadData);
</script>
