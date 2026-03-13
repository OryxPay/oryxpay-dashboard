<template>
    <section class="mb-10">
        <div class="flex flex-wrap items-center gap-2 mb-2">
            <span
                class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                :class="methodClass"
            >
                {{ method }}
            </span>
            <code class="text-sm text-slate-300 bg-slate-800/80 px-2 py-1 rounded break-all">{{ path }}</code>
        </div>
        <p v-if="description" class="text-slate-400 text-sm mb-4">{{ description }}</p>

        <template v-if="params && params.length">
            <h4 class="text-slate-300 font-medium text-sm mb-2">Parâmetros</h4>
            <ul class="space-y-2 mb-4">
                <li
                    v-for="p in params"
                    :key="p.name"
                    class="flex flex-wrap gap-2 items-start text-sm"
                >
                    <code class="text-amber-200/90 bg-slate-800/80 px-1.5 py-0.5 rounded">{{ p.name }}</code>
                    <span v-if="p.type" class="text-slate-500">{{ p.type }}</span>
                    <span v-if="p.required" class="text-red-400 text-xs">obrigatório</span>
                    <span class="text-slate-400 flex-1 min-w-0">{{ p.description }}</span>
                </li>
            </ul>
        </template>

        <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
            <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                <span class="text-xs text-slate-500">Exemplo (cURL)</span>
                <button
                    type="button"
                    class="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                    @click="copyCurl"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                </button>
            </div>
            <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ curlExample }}</code></pre>
        </div>
    </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const apiBase = (config.public.apiBase as string).replace(/\/api\/?$/, '') || '';
const baseUrl = apiBase ? `${apiBase}/api/v1` : 'https://api.exemplo.com/api/v1';

interface Param {
    name: string;
    type?: string;
    required?: boolean;
    description: string;
}

const props = withDefaults(
    defineProps<{
        method: string;
        path: string;
        description?: string;
        params?: Param[];
        curlBody?: string;
    }>(),
    { params: () => [], curlBody: undefined }
);

const methodClass = computed(() => {
    const m = (props.method || '').toUpperCase();
    if (m === 'GET') return 'bg-emerald-500/20 text-emerald-400';
    if (m === 'POST') return 'bg-blue-500/20 text-blue-400';
    if (m === 'PUT' || m === 'PATCH') return 'bg-amber-500/20 text-amber-400';
    if (m === 'DELETE') return 'bg-red-500/20 text-red-400';
    return 'bg-slate-500/20 text-slate-400';
});

const curlExample = computed(() => {
    const m = (props.method || 'GET').toUpperCase();
    const url = props.path.startsWith('http') ? props.path : `${baseUrl}${props.path}`;
    let curl = `curl --request ${m} \\\n  --url ${url} \\\n  --header 'accept: application/json' \\\n  --header 'X-Api-Key: SUA_CHAVE_API'`;
    if (props.curlBody && (m === 'POST' || m === 'PUT' || m === 'PATCH')) {
        curl += ` \\\n  --header 'content-type: application/json' \\\n  --data '${props.curlBody}'`;
    }
    return curl;
});

async function copyCurl() {
    try {
        await navigator.clipboard.writeText(curlExample.value);
        // Opcional: toast de "Copiado"
    } catch {
        // fallback
    }
}
</script>
