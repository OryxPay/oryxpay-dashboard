<template>
    <div class="relative min-h-screen">
        <div
            class="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 sm:px-16"
        >
            <div
                class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0"
            >
                <div
                    class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(36,83,155,1)_0%,rgba(107,84,75,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]"
                >
                    <div
                        class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"
                    ></div>
                    <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                        <NuxtLink to="/" class="ms-10 block w-48 lg:w-72">
                            <img src="/assets/images/logo-dark.webp" alt="OryxPay" class="w-full" />
                        </NuxtLink>
                    </div>
                </div>
                <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                    <div class="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                        <NuxtLink to="/" class="block w-8 lg:hidden">
                            <img src="/assets/images/logo-dark.webp" alt="OryxPay" class="mx-auto w-10" />
                        </NuxtLink>
                    </div>
                    <div class="w-full max-w-[440px] lg:mt-16">
                        <div class="mb-10">
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Entrar</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Insira seu email e sua senha para entrar</p>
                        </div>
                        
                        <!-- Mensagem de erro geral -->
                        <div v-if="error" class="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <icon-x-circle class="h-5 w-5 text-red-400" />
                                </div>
                                <div class="ml-3 flex-1">
                                    <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
                                    <div v-if="error && error.includes('verifique seu e-mail')" class="mt-2">
                                        <NuxtLink 
                                            to="/auth/resend-verification" 
                                            class="text-sm text-primary hover:underline font-semibold"
                                        >
                                            Reenviar e-mail de verificação
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form class="space-y-5 dark:text-white" @submit.prevent="handleLogin">
                            <div>
                                <label for="email">Email</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="email" 
                                        v-model="form.email"
                                        type="email" 
                                        placeholder="Insira seu email" 
                                        :class="[
                                            'form-input ps-10 placeholder:text-white-dark',
                                            validationErrors.email ? 'border-red-500 focus:border-red-500' : ''
                                        ]"
                                        :disabled="loading"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-mail :fill="true" />
                                    </span>
                                </div>
                                <p v-if="validationErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {{ validationErrors.email }}
                                </p>
                            </div>
                            <div>
                                <label for="password">Senha</label>
                                <div class="relative text-white-dark">
                                    <input 
                                        id="password" 
                                        v-model="form.password"
                                        type="password" 
                                        placeholder="Insira sua senha" 
                                        :class="[
                                            'form-input ps-10 placeholder:text-white-dark',
                                            validationErrors.password ? 'border-red-500 focus:border-red-500' : ''
                                        ]"
                                        :disabled="loading"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                                <p v-if="validationErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {{ validationErrors.password }}
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="w-12 h-6 relative">
                                    <input 
                                        v-model="form.remember"
                                        type="checkbox" 
                                        class="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" 
                                        id="remember"
                                        :disabled="loading"
                                    />
                                    <span for="remember" class="outline_checkbox border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:border-primary peer-checked:before:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                                <span class="text-sm">Lembrar de mim</span>
                            </div>
                            <button 
                                type="submit" 
                                :disabled="loading"
                                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(36,83,155,0.44)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span v-if="loading" class="flex items-center justify-center">
                                    <icon-loader class="animate-spin h-4 w-4 mr-2" />
                                    Entrando...
                                </span>
                                <span v-else>Entrar</span>
                            </button>
                        </form>

                        <div class="text-center dark:text-white mt-3">
                            Ainda não tem uma conta?
                            <NuxtLink to="/auth/register" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                Cadastre-se
                            </NuxtLink>
                        </div>
                    </div>
                    <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }}. OryxPay. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { computed, reactive } from 'vue';
    import appSetting from '@/app-setting';
    import { useAppStore } from '@/stores/index';
    import { useRouter } from 'vue-router';

    useHead({ title: 'Entrar' });
    
    const router = useRouter();
    const store = useAppStore();
    const { setLocale } = useI18n();

    // Usar o composable de autenticação
    const { login, loading, error, validationErrors, clearError } = useAuth();

    // Formulário reativo
    const form = reactive({
        email: '',
        password: '',
        remember: false
    });

    // Função para lidar com o login
    const handleLogin = async () => {
        // Limpar erros anteriores
        clearError();

        // Validação básica do lado do cliente
        if (!form.email || !form.password) {
            return;
        }

        try {
            const result = await login({
                email: form.email,
                password: form.password,
                remember: form.remember
            });

            if (result.success) {
                if ((result as any).requires2fa && (result as any).challengeToken) {
                    await router.push({
                        path: '/auth/verify-2fa',
                        query: {
                            challenge_token: (result as any).challengeToken,
                            email: form.email,
                        },
                    });
                    return;
                }
            } else {
                // Erro já é tratado pelo store
                console.error('Erro no login:', result.error);
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
        }
    };

    definePageMeta({
        layout: 'auth-layout',
        middleware: 'auth'
    });
</script>
