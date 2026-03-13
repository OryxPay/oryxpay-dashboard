<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="h-full bg-white dark:bg-[#0F172A]">
                <div class="flex items-center justify-between px-4 py-3">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img class="ml-[5px] w-8 flex-none" src="/assets/images/logo-dark.webp" alt="OryxPay" />
                        <span class="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">OryxPay</span>
                    </NuxtLink>
                    <a
                        href="javascript:;"
                        class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <client-only>
                    <perfect-scrollbar
                        :options="{ swipeEasing: true, wheelPropagation: false }"
                        class="relative h-[calc(100vh-80px)]"
                    >
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li class="nav-item">
                                <NuxtLink to="/" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-menu-dashboard class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Dashboard</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/vendas" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-trending-up class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Vendas</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/financeiro/saldo" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-wallet class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Saldo</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/financeiro/extratos" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-receipt class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Extratos</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/financeiro/taxas" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-tag class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Taxas</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/configuracoes/liquidantes" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-link class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Liquidantes</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/configuracoes/minha-conta" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-user class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Minha Conta</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/configuracoes/credenciais-api" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-server class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Credenciais de API</span>
                                    </div>
                                </NuxtLink>
                            </li>
                            <li class="nav-item">
                                <NuxtLink to="/integracao/webhooks" class="nav-link group" @click="toggleMobileMenu">
                                    <div class="flex items-center">
                                        <icon-link class="shrink-0 group-hover:!text-primary" />
                                        <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">Webhooks</span>
                                    </div>
                                </NuxtLink>
                            </li>
                        </ul>
                    </perfect-scrollbar>
                </client-only>
            </div>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { useAppStore } from '@/stores/index';

    const store = useAppStore();

    function toggleMobileMenu() {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) store.toggleSidebar();
    }
</script>
