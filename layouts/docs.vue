<template>
    <div class="docs-layout min-h-screen bg-slate-950 text-slate-200 font-nunito">
        <!-- Sidebar -->
        <aside
            class="fixed top-0 left-0 z-40 h-full w-64 border-r border-slate-800 bg-slate-900/95 backdrop-blur flex flex-col"
            :class="{ '-translate-x-full lg:translate-x-0': !sidebarOpen }"
        >
            <div class="flex items-center justify-between h-14 px-4 border-b border-slate-800 shrink-0">
                <NuxtLink to="/docs" class="flex items-center gap-2 text-slate-100 font-semibold">
                    <span class="text-primary">OryxPay</span>
                    <span class="text-xs text-slate-500 font-normal">Docs</span>
                </NuxtLink>
                <button
                    type="button"
                    class="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                    aria-label="Fechar menu"
                    @click="sidebarOpen = false"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav class="flex-1 overflow-y-auto py-4 px-3">
                <ul class="space-y-0.5">
                    <li>
                        <NuxtLink
                            to="/docs"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs' }"
                            @click="sidebarOpen = false"
                        >
                            <span>Início</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/autenticacao"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/autenticacao' }"
                            @click="sidebarOpen = false"
                        >
                            Autenticação
                        </NuxtLink>
                    </li>
                    <li class="pt-3 pb-1 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        API v1
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/conta"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/conta' }"
                            @click="sidebarOpen = false"
                        >
                            Conta
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/transacoes"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/transacoes' }"
                            @click="sidebarOpen = false"
                        >
                            Transações
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/saques"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/saques' }"
                            @click="sidebarOpen = false"
                        >
                            Saques
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/saldo"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/saldo' }"
                            @click="sidebarOpen = false"
                        >
                            Saldo
                        </NuxtLink>
                    </li>
                    <li class="pt-3 pb-1 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Integração
                    </li>
                    <li>
                        <NuxtLink
                            to="/docs/webhooks"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            :class="{ 'bg-slate-800 text-white': $route.path === '/docs/webhooks' }"
                            @click="sidebarOpen = false"
                        >
                            Webhooks
                        </NuxtLink>
                    </li>
                </ul>
            </nav>
            <div class="p-3 border-t border-slate-800">
                <NuxtLink
                    to="/auth/login"
                    class="block text-center py-2 rounded-lg text-sm text-slate-400 hover:text-primary hover:bg-slate-800 transition-colors"
                >
                    Acessar dashboard
                </NuxtLink>
            </div>
        </aside>

        <!-- Overlay mobile -->
        <div
            v-show="sidebarOpen"
            class="fixed inset-0 z-30 bg-black/50 lg:hidden"
            aria-hidden="true"
            @click="sidebarOpen = false"
        />

        <!-- Main -->
        <div class="lg:pl-64 min-h-screen flex flex-col">
            <header class="sticky top-0 z-20 h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur flex items-center px-4 lg:px-8">
                <button
                    type="button"
                    class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-800 text-slate-400"
                    aria-label="Abrir menu"
                    @click="sidebarOpen = true"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span class="ml-2 lg:ml-0 text-slate-500 text-sm truncate">{{ pageTitle }}</span>
            </header>

            <main class="flex-1 w-full min-w-0 p-4 lg:p-8">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const sidebarOpen = ref(false);

const pageTitle = computed(() => {
    const t: Record<string, string> = {
        '/docs': 'Início',
        '/docs/autenticacao': 'Autenticação',
        '/docs/conta': 'Conta',
        '/docs/transacoes': 'Transações',
        '/docs/saques': 'Saques',
        '/docs/saldo': 'Saldo',
        '/docs/webhooks': 'Webhooks',
    };
    return t[route.path] ?? 'Documentação';
});
</script>
