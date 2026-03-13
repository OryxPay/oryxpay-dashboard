<template>
    <section class="mb-12 rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-800">
            <div class="flex flex-wrap items-center gap-2">
                <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                    :class="methodClass"
                >
                    {{ method }}
                </span>
                <code class="text-sm text-slate-300 bg-slate-800/80 px-2 py-1 rounded">{{ resolvedPath }}</code>
            </div>
            <p class="text-slate-400 text-sm mt-2">{{ description }}</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-0">
            <div class="lg:col-span-2 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto max-h-[70vh] lg:max-h-none">
                <h4 class="text-slate-300 font-medium text-sm mb-3 flex items-center gap-2">
                    <span>{{ paramsTitle }}</span>
                    <span class="text-slate-500 font-normal text-xs">(preencha e clique em Executar)</span>
                </h4>

                <div class="space-y-4">
                    <template v-if="pathParams?.length">
                        <div
                            v-for="p in pathParams"
                            :key="'path-' + p.key"
                            class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3"
                        >
                            <label class="block text-xs font-medium text-slate-400 mb-1">
                                {{ p.label || p.key }} <span v-if="p.required !== false" class="text-red-400">*</span>
                            </label>
                            <input
                                v-model="form[p.key]"
                                type="text"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                :placeholder="p.placeholder ?? p.key"
                            />
                            <p v-if="p.description" class="text-xs text-slate-500 mt-0.5">{{ p.description }}</p>
                        </div>
                    </template>

                    <template v-if="queryParams?.length">
                        <div
                            v-for="p in queryParams"
                            :key="'query-' + p.key"
                            class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3"
                        >
                            <label class="block text-xs font-medium text-slate-400 mb-1">
                                {{ p.label || p.key }}
                                <span v-if="p.required" class="text-red-400">*</span>
                            </label>
                            <input
                                v-model="form[p.key]"
                                :type="p.type === 'number' ? 'number' : 'text'"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                :placeholder="p.placeholder ?? ''"
                            />
                            <p v-if="p.description" class="text-xs text-slate-500 mt-0.5">{{ p.description }}</p>
                        </div>
                    </template>

                    <template v-if="bodyParams?.length">
                        <div
                            v-for="p in bodyParams"
                            :key="'body-' + p.key"
                            class="rounded-lg border border-slate-700/80 bg-slate-800/50 p-3"
                        >
                            <label class="block text-xs font-medium text-slate-400 mb-1">
                                {{ p.label || p.key }}
                                <span v-if="p.required" class="text-red-400">*</span>
                            </label>
                            <input
                                v-model="form[p.key]"
                                :type="p.type === 'number' ? 'number' : 'text'"
                                class="w-full rounded border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:border-primary focus:outline-none"
                                :placeholder="p.placeholder ?? ''"
                            />
                            <p v-if="p.description" class="text-xs text-slate-500 mt-0.5">{{ p.description }}</p>
                        </div>
                    </template>

                    <p v-if="!hasParams" class="text-slate-500 text-sm">Nenhum parâmetro obrigatório. Insira sua chave e clique em Executar.</p>
                </div>
            </div>

            <div class="lg:col-span-1 p-4 flex flex-col bg-slate-900/30 border-t lg:border-t-0 border-slate-800">
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
                            <button type="button" class="p-1.5 rounded text-slate-400 hover:text-white" :title="showApiKey ? 'Ocultar' : 'Mostrar'" @click="showApiKey = !showApiKey">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button type="button" class="p-1.5 rounded text-slate-400 hover:text-white" title="Copiar chave" @click="copyApiKey">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden mb-4">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                        <span class="text-xs text-slate-500">Shell (cURL)</span>
                        <button type="button" class="text-slate-400 hover:text-white text-xs flex items-center gap-1" @click="copyCurl">Copiar</button>
                    </div>
                    <pre class="p-3 text-xs text-slate-300 overflow-x-auto max-h-40 overflow-y-auto"><code>{{ curlExample }}</code></pre>
                </div>

                <button
                    type="button"
                    class="btn btn-primary w-full py-2.5 mb-4"
                    :disabled="executing"
                    @click="execute"
                >
                    <span v-if="executing" class="inline-flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Executando...
                    </span>
                    <span v-else>Executar</span>
                </button>

                <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-1 flex flex-col min-h-[200px]">
                    <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50 shrink-0">
                        <span class="text-xs text-slate-500">Resposta</span>
                        <span
                            v-if="responseStatus"
                            class="text-xs font-mono rounded px-2 py-0.5"
                            :class="responseStatus >= 200 && responseStatus < 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'"
                        >{{ responseStatus }}</span>
                    </div>
                    <div class="p-3 text-xs overflow-auto flex-1">
                        <p v-if="!responseStatus && !responseError" class="text-slate-500">Insira sua chave e clique em Executar para ver a resposta aqui.</p>
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

interface Param {
    key: string;
    label?: string;
    type?: string;
    required?: boolean;
    description?: string;
    placeholder?: string;
}

const props = withDefaults(
    defineProps<{
        method: string;
        path: string;
        description?: string;
        pathParams?: Param[];
        queryParams?: Param[];
        bodyParams?: Param[];
    }>(),
    { pathParams: () => [], queryParams: () => [], bodyParams: () => [] }
);

const { apiKey } = useDocsApiKey();
const showApiKey = ref(false);
const executing = ref(false);
const responseStatus = ref<number | null>(null);
const responseBody = ref('');
const responseError = ref('');

const allParamKeys = computed(() => {
    const keys: string[] = [];
    props.pathParams?.forEach((p) => keys.push(p.key));
    props.queryParams?.forEach((p) => keys.push(p.key));
    props.bodyParams?.forEach((p) => keys.push(p.key));
    return keys;
});

const initialForm: Record<string, string | number> = {};
props.pathParams?.forEach((p) => { initialForm[p.key] = ''; });
props.queryParams?.forEach((p) => { initialForm[p.key] = p.type === 'number' ? '' : ''; });
props.bodyParams?.forEach((p) => { initialForm[p.key] = p.type === 'number' ? '' : ''; });

const form = reactive<Record<string, string | number>>({ ...initialForm });

const hasParams = computed(() => (props.pathParams?.length ?? 0) + (props.queryParams?.length ?? 0) + (props.bodyParams?.length ?? 0) > 0);

const paramsTitle = computed(() => {
    if (props.bodyParams?.length) return 'Parâmetros do corpo';
    if (props.queryParams?.length) return 'Parâmetros de query';
    if (props.pathParams?.length) return 'Parâmetros do path';
    return 'Parâmetros';
});

const methodClass = computed(() => {
    const m = (props.method || 'GET').toUpperCase();
    if (m === 'GET') return 'bg-emerald-500/20 text-emerald-400';
    if (m === 'POST') return 'bg-blue-500/20 text-blue-400';
    if (m === 'PUT' || m === 'PATCH') return 'bg-amber-500/20 text-amber-400';
    if (m === 'DELETE') return 'bg-red-500/20 text-red-400';
    return 'bg-slate-500/20 text-slate-400';
});

function resolvePath(): string {
    let p = props.path.startsWith('http') ? props.path : `${baseUrl}${props.path}`;
    props.pathParams?.forEach((param) => {
        const val = form[param.key];
        p = p.replace(new RegExp(`\\{${param.key}\\}`, 'g'), String(val ?? ''));
    });
    return p;
}

const resolvedPath = computed(() => resolvePath());

function buildQueryString(): string {
    if (!props.queryParams?.length) return '';
    const pairs: string[] = [];
    props.queryParams.forEach((p) => {
        const v = form[p.key];
        if (v !== undefined && v !== null && v !== '') pairs.push(`${encodeURIComponent(p.key)}=${encodeURIComponent(String(v))}`);
    });
    return pairs.length ? '?' + pairs.join('&') : '';
}

function buildBody(): Record<string, unknown> | null {
    if (!props.bodyParams?.length) return null;
    const body: Record<string, unknown> = {};
    props.bodyParams.forEach((p) => {
        const v = form[p.key];
        if (v === undefined || v === null || v === '') return;
        if (p.type === 'number') body[p.key] = Number(v) || 0;
        else body[p.key] = String(v);
    });
    return body;
}

const curlExample = computed(() => {
    const m = (props.method || 'GET').toUpperCase();
    const url = resolvePath() + (props.queryParams?.length ? buildQueryString() : '');
    let curl = `curl --request ${m} \\\n  --url ${url} \\\n  --header 'accept: application/json' \\\n  --header 'X-Api-Key: SUA_CHAVE_API'`;
    if (props.bodyParams?.length && (m === 'POST' || m === 'PUT' || m === 'PATCH')) {
        const body = buildBody();
        if (body && Object.keys(body).length) {
            const jsonFormatted = JSON.stringify(body, null, 2);
            curl += ` \\\n  --header 'content-type: application/json' \\\n  --data '\n${jsonFormatted}'`;
        }
    }
    return curl;
});

async function execute() {
    responseError.value = '';
    responseBody.value = '';
    responseStatus.value = null;
    if (!apiKey.value.trim()) {
        responseError.value = 'Informe sua chave de API (X-Api-Key) para executar.';
        return;
    }
    const m = (props.method || 'GET').toUpperCase();
    const url = resolvePath() + buildQueryString();
    executing.value = true;
    try {
        const opts: RequestInit = {
            method: m,
            headers: { accept: 'application/json', 'X-Api-Key': apiKey.value.trim() },
        };
        if (props.bodyParams?.length && (m === 'POST' || m === 'PUT' || m === 'PATCH')) {
            const body = buildBody();
            opts.headers = { ...opts.headers, 'content-type': 'application/json' } as HeadersInit;
            opts.body = body && Object.keys(body).length ? JSON.stringify(body) : '{}';
        }
        const res = await fetch(url, opts);
        responseStatus.value = res.status;
        const text = await res.text();
        try {
            responseBody.value = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            responseBody.value = text || '(vazio)';
        }
    } catch (e: any) {
        responseError.value = e?.message || 'Erro de rede. Verifique CORS se a API estiver em outro domínio.';
    } finally {
        executing.value = false;
    }
}

function copyCurl() { navigator.clipboard.writeText(curlExample.value).catch(() => {}); }
function copyApiKey() { if (apiKey.value) navigator.clipboard.writeText(apiKey.value).catch(() => {}); }
</script>
