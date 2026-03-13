<template>
    <div class="docs-home">
        <h1 class="text-2xl font-bold text-white mb-2">Documentação da API</h1>
        <p class="text-slate-400 mb-8">
            Integre pagamentos e saques à sua aplicação usando a API OryxPay. Todas as requisições usam JSON e são autenticadas por chave de API.
        </p>

        <div class="grid gap-4 sm:grid-cols-2 mb-10">
            <NuxtLink
                to="/docs/autenticacao"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Autenticação</h2>
                <p class="text-sm text-slate-500">Como obter e usar sua chave de API (Bearer).</p>
            </NuxtLink>
            <NuxtLink
                to="/docs/empresa"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Empresa</h2>
                <p class="text-sm text-slate-500">Dados da empresa associada à sua conta.</p>
            </NuxtLink>
            <NuxtLink
                to="/docs/transacoes"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Transações</h2>
                <p class="text-sm text-slate-500">Criar, consultar e estornar vendas (cartão, PIX, boleto).</p>
            </NuxtLink>
            <NuxtLink
                to="/docs/saques"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Saques</h2>
                <p class="text-sm text-slate-500">Criar e gerenciar saques para contas cadastradas.</p>
            </NuxtLink>
            <NuxtLink
                to="/docs/saldo"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Saldo</h2>
                <p class="text-sm text-slate-500">Consultar saldo disponível da conta.</p>
            </NuxtLink>
            <NuxtLink
                to="/docs/webhooks"
                class="block p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
            >
                <h2 class="font-semibold text-slate-200 mb-1">Webhooks</h2>
                <p class="text-sm text-slate-500">Receba notificações de eventos em tempo real (postbacks).</p>
            </NuxtLink>
        </div>

        <div class="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h3 class="font-medium text-slate-200 mb-2">Base URL</h3>
            <code class="text-sm text-amber-200/90 bg-slate-800 px-2 py-1 rounded">{{ baseUrl }}/v1</code>
            <p class="text-slate-500 text-sm mt-2">Todas as rotas da API v1 são relativas a essa base. Valores monetários são enviados e retornados em <strong class="text-slate-400">centavos</strong>.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});

const config = useRuntimeConfig();
const apiBase = (config.public.apiBase as string).replace(/\/api\/?$/, '') || '';
const baseUrl = apiBase ? `${apiBase}/api` : 'https://api.exemplo.com/api';
</script>
