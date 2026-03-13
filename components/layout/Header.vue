<template>
    <header class="z-40" :class="{ dark: store.semidark && store.menu === 'horizontal' }">
        <div class="shadow-sm">
            <div class="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-[#0F172A]">
                <div class="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img class="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo-dark.webp" alt="OryxPay" />
                        <span
                            class="hidden align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline"
                            >OryxPay</span
                        >
                    </NuxtLink>

                    <a
                        href="javascript:;"
                        class="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                        @click="store.toggleSidebar()"
                    >
                        <icon-menu class="h-5 w-5" />
                    </a>
                </div>
                <div
                    class="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2"
                >
                    <div class="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                    <div>
                        <a
                            href="javascript:;"
                            v-show="store.theme === 'light'"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('dark')"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"></circle>
                                <path d="M12 2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path d="M12 20V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path d="M4 12L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path d="M22 12L20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            </svg>
                        </a>
                        <a
                            href="javascript:;"
                            v-show="store.theme === 'dark'"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('system')"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z" fill="currentColor"></path>
                            </svg>
                        </a>
                        <a
                            href="javascript:;"
                            v-show="store.theme === 'system'"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('light')"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z" stroke="currentColor" stroke-width="1.5"></path>
                                <path opacity="0.5" d="M22 21H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                <path opacity="0.5" d="M15 15H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            </svg>
                        </a>
                    </div>

                    <div class="dropdown shrink-0">
                        <ClientOnly>
                            <template #default>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'" offsetDistance="8" class="!block">
                                    <button type="button" class="group relative block">
                                        <img
                                            v-if="userAvatar"
                                            :src="userAvatar"
                                            alt="Avatar"
                                            class="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100 border-2 border-white dark:border-[#191e3a]"
                                        />
                                        <div
                                            v-else
                                            class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-light/20 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                        >
                                            <icon-user class="h-5 w-5" />
                                        </div>
                                    </button>
                                    <template #content="{ close }">
                                        <ul class="w-[300px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            <li>
                                                <div class="flex items-center px-4 py-4">
                                                    <div class="flex-none shrink-0">
                                                        <img
                                                            v-if="userAvatar"
                                                            :src="userAvatar"
                                                            alt="Avatar"
                                                            class="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        <div
                                                            v-else
                                                            class="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 dark:bg-dark-light/20"
                                                        >
                                                            <icon-user class="h-6 w-6" />
                                                        </div>
                                                    </div>
                                                    <div class="min-w-0 flex-1 ltr:pl-4 rtl:pr-4">
                                                        <h4 class="text-base break-words">
                                                            {{ userName }}
                                                        </h4>
                                                        <a
                                                            class="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white break-all text-sm"
                                                            href="javascript:;"
                                                            >{{ userEmail }}</a
                                                        >
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <NuxtLink to="/profile" class="dark:hover:text-white" @click="close()">
                                                    <icon-user class="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />

                                                    Minha conta
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <a
                                                    :href="supportWhatsAppUrl"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="flex items-center w-full px-4 py-3 dark:hover:text-white"
                                                    @click="close()"
                                                >
                                                    <icon-help-circle class="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                                    Suporte
                                                </a>
                                            </li>
                                            <li class="border-t border-white-light dark:border-white-light/10">
                                                <button
                                                    type="button"
                                                    class="!py-3 text-danger w-full text-left flex items-center"
                                                    @click="
                                                        handleLogout();
                                                        close();
                                                    "
                                                >
                                                    <icon-logout class="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />

                                                    Sair
                                                </button>
                                            </li>
                                        </ul>
                                    </template>
                                </Popper>
                            </template>
                            <template #fallback>
                                <button type="button" class="group relative block">
                                    <div
                                        class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-light/20"
                                    >
                                        <icon-user class="h-5 w-5" />
                                    </div>
                                </button>
                            </template>
                        </ClientOnly>
                    </div>
                </div>
            </div>

            <!-- horizontal menu -->
            <ClientOnly>
                <ul
                    class="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#F9FAFB] lg:space-x-1.5 xl:space-x-8"
                >
                <li class="menu nav-item relative">
                    <a href="javascript:;" class="nav-link">
                        <div class="flex items-center">
                            <icon-menu-dashboard class="shrink-0" />

                            <span class="px-2">{{ $t('dashboard') }}</span>
                        </div>
                        <div class="right_arrow">
                            <icon-caret-down />
                        </div>
                    </a>
                    <ul class="sub-menu">
                        <li>
                            <NuxtLink to="/">{{ $t('dashboard') || 'Dashboard' }}</NuxtLink>
                        </li>
                    </ul>
                </li>
                <li class="menu nav-item relative">
                    <a href="javascript:;" class="nav-link">
                        <div class="flex items-center">
                            <icon-menu-pages class="shrink-0" />
                            <span class="px-2">{{ $t('pages') }}</span>
                        </div>
                        <div class="right_arrow">
                            <icon-caret-down />
                        </div>
                    </a>
                    <ul class="sub-menu">
                        <li>
                            <NuxtLink to="/profile">{{ $t('profile') || 'Perfil' }}</NuxtLink>
                        </li>
                    </ul>
                </li>
                <li class="menu nav-item relative">
                    <a href="javascript:;" class="nav-link">
                        <div class="flex items-center">
                            <icon-menu-more class="shrink-0" />

                            <span class="px-2">{{ $t('more') }}</span>
                        </div>
                        <div class="right_arrow">
                            <icon-caret-down />
                        </div>
                    </a>
                    <ul class="sub-menu">
                        <li>
                            <a href="https://vristo.sbthemes.com" target="_blank">{{ $t('documentation') }}</a>
                        </li>
                    </ul>
                </li>
            </ul>
            </ClientOnly>
        </div>
    </header>
</template>

<script lang="ts" setup>
    import { ref, onMounted, computed, reactive, watch } from 'vue';
    import appSetting from '@/app-setting';
    import { useRoute } from 'vue-router';
    import { useAppStore } from '@/stores/index';
    const store = useAppStore();
    const route = useRoute();

    const { logout, me, user: authUser } = useAuth();
    const user = ref({});

    onMounted(async () => {
        setActiveDropdown();
        try {
            const currentUser = await me();
            if (currentUser) {
                user.value = currentUser;
            }
        } catch {
            // Evita quebrar o header quando backend estiver indisponível.
        }
    });

    const userName = computed(() => user.value?.name || authUser.value?.name || '');
    const userEmail = computed(() => user.value?.email || authUser.value?.email || '');

    const getAvatarUrl = (avatarPath: string | null): string | null => {
        if (!avatarPath) return null;

        // Se já é uma URL completa, verificar se precisa ajustar a porta
        if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
            const config = useRuntimeConfig();
            const apiBase = config.public.apiBase;
            const baseUrl = apiBase.replace('/api', '');

            // Se a URL não contém a porta correta, substituir pela base URL do backend
            try {
                const url = new URL(avatarPath);
                const backendUrl = new URL(baseUrl);

                // Se o host é localhost mas a porta está diferente, ajustar
                if (url.hostname === 'localhost' && url.port !== backendUrl.port) {
                    return baseUrl + url.pathname + (url.search || '');
                }
            } catch (e) {
                // Se não conseguir fazer parse, retornar como está
            }

            return avatarPath;
        }

        // Se é um caminho relativo, construir a URL completa do backend
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase;
        // Extrair a base URL (remover /api do final)
        const baseUrl = apiBase.replace('/api', '');

        // Se o caminho já começa com /storage, apenas adicionar a base
        if (avatarPath.startsWith('/storage')) {
            return baseUrl + avatarPath;
        }

        // Caso contrário, adicionar /storage
        return baseUrl + '/storage/' + avatarPath.replace(/^\/+/, '');
    };

    const userAvatar = computed(() => {
        const localUser = user.value as any;
        const avatar =
            localUser?.avatar_url ||
            localUser?.avatar ||
            authUser.value?.avatar_url ||
            authUser.value?.avatar ||
            null;
        return getAvatarUrl(avatar);
    });

    const supportWhatsAppUrl = computed(() => {
        const phone = user.value?.account?.company?.phone_number || authUser.value?.account?.company?.phone_number || '';
        const digits = (phone || '').replace(/\D/g, '');
        if (!digits.length) return '#';
        const text = encodeURIComponent('Olá, preciso de suporte.');
        const num = digits.startsWith('55') ? digits : '55' + digits;
        return `https://wa.me/${num}?text=${text}`;
    });

    watch(route, (to, from) => {
        setActiveDropdown();
    });

    const setActiveDropdown = () => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    };

    // Função de logout
    const handleLogout = async () => {
        try {
            await logout();
            // O redirecionamento será feito automaticamente pelo composable
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
</script>
