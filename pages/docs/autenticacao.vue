<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Autenticação</h1>
        <p class="text-slate-400 mb-6">
            A API v1 usa autenticação por <strong class="text-slate-300">chave de API</strong>. A chave é gerada no dashboard em Configurações → Credenciais de API e tem o prefixo <code class="text-amber-200/90 bg-slate-800 px-1 rounded">sk_</code>.
        </p>

        <div class="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 mb-8">
            <p class="text-sm text-amber-200/90">
                Nunca exponha sua chave em repositórios ou no front-end. Use apenas em ambiente servidor ou variáveis de ambiente.
            </p>
        </div>

        <h2 class="text-lg font-semibold text-slate-200 mb-3">Como usar</h2>
        <p class="text-slate-400 mb-4">
            Inclua um dos headers em todas as requisições:
        </p>
        <pre class="p-4 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300 overflow-x-auto mb-4"><code>X-Api-Key: sk_sua_chave_aqui</code></pre>
        <p class="text-slate-400 mb-8 text-sm">
            Alternativa: <code class="text-amber-200/90 bg-slate-800 px-1 rounded">Authorization: ApiKey sk_sua_chave_aqui</code>
        </p>

        <h2 class="text-lg font-semibold text-slate-200 mb-3">Onde obter a chave</h2>
        <p class="text-slate-400">
            Faça login no dashboard, acesse <strong>Configurações</strong> → <strong>Credenciais de API</strong>. Você pode gerar uma nova chave (a anterior será invalidada).
        </p>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});
</script>
