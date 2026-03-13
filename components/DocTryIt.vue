<template>
    <section class="mb-12 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <!-- Header -->
        <div class="px-4 py-3 border-b border-slate-800">
            <div class="flex flex-wrap items-center gap-2">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400"
                >
                    POST
                </span>
                <code class="text-sm text-slate-300 bg-slate-800/80 px-2 py-1 rounded">{{ path }}</code>
            </div>
            <p class="text-slate-400 text-sm mt-2">{{ description }}</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-0">
            <!-- Coluna esquerda: parâmetros (2/3 da largura) -->
            <div class="lg:col-span-2 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto max-h-[70vh] lg:max-h-none">
                <h4 class="text-slate-300 font-medium text-sm mb-3 flex items-center gap-2">
                    <span>Parâmetros do corpo</span>
                    <span class="text-slate-500 font-normal text-xs">(preencha e clique em Executar)</span>
                </h4>

                <form class="space-y-4" @submit.prevent="execute">
                    <!-- amount -->
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">
                            amount <span class="text-red-400">*</span>
                        </label>
                        <input
                            v-model.number="form.amount"
                            type="number"
                            min="1"
                            class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                            placeholder="Ex: 1000 (R$ 10,00)"
                        />
                        <p class="text-xs text-slate-500 mt-0.5">Valor total em centavos.</p>
                    </div>

                    <!-- paymentMethod -->
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">
                            paymentMethod <span class="text-red-400">*</span>
                        </label>
                        <select
                            v-model="form.paymentMethod"
                            class="selectize w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-primary focus:outline-none"
                        >
                            <option value="">Selecione...</option>
                            <option value="credit_card">credit_card</option>
                            <option value="pix">pix</option>
                            <option value="boleto">boleto</option>
                        </select>
                        <p class="text-xs text-slate-500 mt-0.5">Meio de pagamento.</p>
                    </div>

                    <!-- customer (objeto) -->
                    <div class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3 space-y-3">
                        <h5 class="text-xs font-semibold text-slate-400">customer (objeto) <span class="text-red-400">*</span></h5>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">name <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.customer.name"
                                type="text"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="Nome do cliente"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">email <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.customer.email"
                                type="email"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="email@exemplo.com"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">document <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.customer.document"
                                type="text"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="CPF/CNPJ"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">phone <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.customer.phone"
                                type="text"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>

                    <!-- items (array) -->
                    <div class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3 space-y-3">
                        <h5 class="text-xs font-semibold text-slate-400">items (array) <span class="text-red-400">*</span></h5>
                        <div
                            v-for="(item, idx) in form.items"
                            :key="idx"
                            class="flex flex-wrap gap-2 items-center rounded border border-slate-700/50 p-2 bg-slate-800/30"
                        >
                            <input
                                v-model="item.description"
                                type="text"
                                class="flex-1 min-w-[120px] rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="description"
                            />
                            <input
                                v-model.number="item.quantity"
                                type="number"
                                min="1"
                                class="w-16 rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
                                placeholder="qty"
                            />
                            <input
                                v-model.number="item.unitPrice"
                                type="number"
                                min="0"
                                class="w-24 rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
                                placeholder="unitPrice"
                            />
                            <label class="flex items-center gap-1 text-xs text-slate-400 cursor-pointer">
                                <input
                                    v-model="item.tangible"
                                    type="checkbox"
                                    class="rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary"
                                />
                                tangible
                            </label>
                            <button
                                v-if="form.items.length > 1"
                                type="button"
                                class="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700"
                                title="Remover item"
                                @click="form.items.splice(idx, 1)"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <button
                            type="button"
                            class="text-xs text-primary hover:underline"
                            @click="form.items.push({ description: '', quantity: 1, unitPrice: 0, tangible: true })"
                        >
                            + Adicionar item
                        </button>
                    </div>

                    <!-- card (visível só para credit_card) -->
                    <div
                        v-show="form.paymentMethod === 'credit_card'"
                        class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3 space-y-3"
                    >
                        <h5 class="text-xs font-semibold text-slate-400">card (objeto)</h5>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">number <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.card.number"
                                type="text"
                                maxlength="19"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="Número do cartão (ex: 4111111111111111)"
                            />
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">holderName <span class="text-red-400">*</span></label>
                            <input
                                v-model="form.card.holderName"
                                type="text"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                placeholder="Nome impresso no cartão"
                            />
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">expirationMonth <span class="text-red-400">*</span></label>
                                <input
                                    v-model="form.card.expirationMonth"
                                    type="text"
                                    maxlength="2"
                                    class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                    placeholder="MM"
                                />
                            </div>
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">expirationYear <span class="text-red-400">*</span></label>
                                <input
                                    v-model="form.card.expirationYear"
                                    type="text"
                                    maxlength="4"
                                    class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                    placeholder="AAAA"
                                />
                            </div>
                            <div>
                                <label class="block text-xs text-slate-500 mb-1">cvv <span class="text-red-400">*</span></label>
                                <input
                                    v-model="form.card.cvv"
                                    type="text"
                                    maxlength="4"
                                    class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                    placeholder="CVV"
                                />
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">installments (opcional)</label>
                            <input
                                v-model.number="form.card.installments"
                                type="number"
                                min="1"
                                max="24"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <!-- boleto (visível só para boleto) -->
                    <div
                        v-show="form.paymentMethod === 'boleto'"
                        class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3 space-y-3"
                    >
                        <h5 class="text-xs font-semibold text-slate-400">boleto (objeto)</h5>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">dueDate (opcional)</label>
                            <input
                                v-model="form.boleto.dueDate"
                                type="date"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <!-- pix (visível só para pix) -->
                    <div
                        v-show="form.paymentMethod === 'pix'"
                        class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3 space-y-3"
                    >
                        <h5 class="text-xs font-semibold text-slate-400">pix (objeto)</h5>
                        <div>
                            <label class="block text-xs text-slate-500 mb-1">expirationInSeconds (opcional)</label>
                            <input
                                v-model.number="form.pix.expirationInSeconds"
                                type="number"
                                min="1"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 focus:border-primary focus:outline-none"
                                placeholder="Ex: 1800 (30 min)"
                            />
                        </div>
                    </div>
                </form>
            </div>

            <!-- Coluna direita: credenciais (1/3 da largura) -->
            <div class="lg:col-span-1 p-4 flex flex-col bg-slate-900/30 border-t lg:border-t-0 border-slate-800">
                <!-- Credenciais (preenche a parte direita) -->
                <div class="mb-4">
                    <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Credenciais</h4>
                    <label class="block text-xs text-slate-500 mb-1">X-Api-Key (sua chave para testar)</label>
                    <div class="relative">
                        <input
                            v-model="apiKey"
                            :type="showApiKey ? 'text' : 'password'"
                            class="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 pr-20 text-sm text-slate-200 font-mono placeholder-slate-500 focus:border-primary focus:outline-none"
                            placeholder="sk_..."
                        />
                        <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                            <button
                                type="button"
                                class="p-1.5 rounded text-slate-400 hover:text-white"
                                :title="showApiKey ? 'Ocultar' : 'Mostrar'"
                                @click="showApiKey = !showApiKey"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path v-if="!showApiKey" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                class="p-1.5 rounded text-slate-400 hover:text-white"
                                title="Copiar chave"
                                @click="copyApiKey"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Código cURL (atualizado com o body atual) -->
                <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden mb-4">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                        <span class="text-xs text-slate-500">Shell (cURL)</span>
                        <button
                            type="button"
                            class="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                            @click="copyCurl"
                        >
                            Copiar
                        </button>
                    </div>
                    <pre class="p-3 text-xs text-slate-300 overflow-x-auto max-h-40 overflow-y-auto"><code>{{ curlExample }}</code></pre>
                </div>

                <!-- Botão Executar -->
                <button
                    type="button"
                    class="btn btn-primary w-full py-2.5 mb-4"
                    :disabled="executing"
                    @click="execute"
                >
                    <span v-if="executing" class="inline-flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Executando...
                    </span>
                    <span v-else>Executar</span>
                </button>

                <!-- Resposta -->
                <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-1 flex flex-col min-h-[200px]">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50 shrink-0">
                        <span class="text-xs text-slate-500">Resposta</span>
                        <span
                            v-if="responseStatus"
                            class="text-xs font-mono rounded px-2 py-0.5"
                            :class="responseStatus >= 200 && responseStatus < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'"
                        >
                            {{ responseStatus }}
                        </span>
                    </div>
                    <div class="p-3 text-xs overflow-auto flex-1">
                        <p v-if="!responseStatus && !responseError" class="text-slate-500">
                            Preencha os campos, insira sua chave e clique em Executar para ver a resposta aqui.
                        </p>
                        <p v-else-if="responseError" class="text-red-400">{{ responseError }}</p>
                        <pre v-else class="text-slate-300 whitespace-pre-wrap break-words">{{ responseBody }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const apiBase = (config.public.apiBase as string).replace(/\/api\/?$/, '') || '';
const baseUrl = apiBase ? `${apiBase}/api/v1` : '';

const props = defineProps<{
    path: string;
    description?: string;
}>();

const { apiKey } = useDocsApiKey();
const showApiKey = ref(false);
const executing = ref(false);
const responseStatus = ref<number | null>(null);
const responseBody = ref('');
const responseError = ref('');

const form = reactive({
    amount: 1000,
    paymentMethod: 'pix' as '' | 'credit_card' | 'pix' | 'boleto',
    customer: { name: '', email: '', document: '', phone: '' },
    items: [{ description: 'Item 1', quantity: 1, unitPrice: 1000, tangible: true }] as { description: string; quantity: number; unitPrice: number; tangible: boolean }[],
    card: { number: '', holderName: '', expirationMonth: '', expirationYear: '', cvv: '', installments: 1 },
    boleto: { dueDate: '' },
    pix: { expirationInSeconds: 1800 },
});

function buildBody(): Record<string, unknown> {
    const body: Record<string, unknown> = {
        amount: Number(form.amount) || 0,
        paymentMethod: form.paymentMethod,
        customer: {
            name: form.customer.name || undefined,
            email: form.customer.email || undefined,
            document: form.customer.document || undefined,
            phone: form.customer.phone || undefined,
        },
        items: form.items
            .filter((i) => (i.description || i.quantity || i.unitPrice) !== undefined)
            .map((i) => ({
                description: i.description || undefined,
                quantity: Number(i.quantity) || 1,
                unitPrice: Number(i.unitPrice) || 0,
                tangible: i.tangible ?? true,
            })),
    };
    if (form.paymentMethod === 'credit_card') {
        body.card = {
            number: form.card.number,
            holderName: form.card.holderName,
            expirationMonth: form.card.expirationMonth,
            expirationYear: form.card.expirationYear,
            cvv: form.card.cvv,
            installments: Number(form.card.installments) || 1,
        };
    }
    if (form.paymentMethod === 'boleto' && form.boleto.dueDate) {
        body.boleto = { dueDate: form.boleto.dueDate };
    }
    if (form.paymentMethod === 'pix' && form.pix.expirationInSeconds) {
        body.pix = { expirationInSeconds: Number(form.pix.expirationInSeconds) || 1800 };
    }
    return body;
}

const curlExample = computed(() => {
    const url = props.path.startsWith('http') ? props.path : `${baseUrl}${props.path}`;
    const body = buildBody();
    const jsonFormatted = JSON.stringify(body, null, 2);
    return `curl --request POST \\
  --url ${url} \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --header 'X-Api-Key: SUA_CHAVE_API' \\
  --data '
${jsonFormatted}'`;
});

async function execute() {
    responseError.value = '';
    responseBody.value = '';
    responseStatus.value = null;

    const body = buildBody();
    const customer = body.customer as { name?: string; email?: string; document?: string; phone?: string } | undefined;
    if (!body.amount || !body.paymentMethod || !customer?.name || !customer?.email || !customer?.document || !customer?.phone) {
        responseError.value = 'Preencha todos os campos obrigatórios: amount, paymentMethod e customer (name, email, document, phone).';
        return;
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
        responseError.value = 'Adicione pelo menos um item em items.';
        return;
    }
    if (body.paymentMethod === 'credit_card' && (!form.card.number || !form.card.holderName || !form.card.expirationMonth || !form.card.expirationYear || !form.card.cvv)) {
        responseError.value = 'Para credit_card informe todos os dados do cartão: number, holderName, expirationMonth, expirationYear e cvv.';
        return;
    }

    if (!apiKey.value.trim()) {
        responseError.value = 'Informe sua chave de API (X-Api-Key) para executar.';
        return;
    }

    executing.value = true;
    const url = props.path.startsWith('http') ? props.path : `${baseUrl}${props.path}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'X-Api-Key': apiKey.value.trim(),
            },
            body: JSON.stringify(body),
        });
        responseStatus.value = res.status;
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            responseBody.value = JSON.stringify(json, null, 2);
        } catch {
            responseBody.value = text || '(vazio)';
        }
    } catch (e: any) {
        responseError.value = e?.message || 'Erro de rede. Verifique CORS se a API estiver em outro domínio.';
    } finally {
        executing.value = false;
    }
}

function copyCurl() {
    navigator.clipboard.writeText(curlExample.value).catch(() => {});
}

function copyApiKey() {
    if (apiKey.value) navigator.clipboard.writeText(apiKey.value).catch(() => {});
}
</script>
