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
                            <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Cadastre-se</h1>
                            <p class="text-base font-bold leading-normal text-white-dark">Insira seus dados para fazer seu cadastro.</p>
                        </div>
                        <form class="space-y-5 dark:text-white" @submit.prevent="handleRegister">
                            <div :class="{ 'has-error': validationErrors.name, 'has-success': !validationErrors.name && Object.keys(validationErrors).length > 0 }">
                                <label for="name">Nome</label>
                                <div class="relative text-white-dark">
                                    <input
                                        id="name"
                                        v-model="formData.name"
                                        type="text"
                                        placeholder="Nome Completo"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-user :fill="true" />
                                    </span>
                                </div>
                                <template v-if="validationErrors.name">
                                    <p class="mt-1 text-danger">{{ validationErrors.name }}</p>
                                </template>
                            </div>
                            <div :class="{ 'has-error': validationErrors.email, 'has-success': !validationErrors.email && Object.keys(validationErrors).length > 0 }">
                                <label for="email">Email</label>
                                <div class="relative text-white-dark">
                                    <input
                                        id="email"
                                        v-model="formData.email"
                                        type="email"
                                        placeholder="Insira seu Email"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-mail :fill="true" />
                                    </span>
                                </div>
                                <template v-if="validationErrors.email">
                                    <p class="mt-1 text-danger">{{ validationErrors.email }}</p>
                                </template>
                            </div>
                            <div :class="{ 'has-error': validationErrors.cpf, 'has-success': !validationErrors.cpf && Object.keys(validationErrors).length > 0 }">
                                <label for="cpf">CPF</label>
                                <div class="relative text-white-dark">
                                    <client-only>
                                        <input
                                            id="cpf"
                                            v-model="formData.cpf"
                                            type="text"
                                            placeholder="Insira seu CPF"
                                            class="form-input ps-10 placeholder:text-white-dark"
                                            v-maska="'###.###.###-##'"
                                        />
                                        <template #fallback>
                                            <input
                                                id="cpf"
                                                v-model="formData.cpf"
                                                type="text"
                                                placeholder="Insira seu CPF"
                                                class="form-input ps-10 placeholder:text-white-dark"
                                            />
                                        </template>
                                    </client-only>
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                                <template v-if="validationErrors.cpf">
                                    <p class="mt-1 text-danger">{{ validationErrors.cpf }}</p>
                                </template>
                            </div>
                            <div :class="{ 'has-error': validationErrors.password, 'has-success': !validationErrors.password && Object.keys(validationErrors).length > 0 }">
                                <label for="password">Senha</label>
                                <div class="relative text-white-dark">
                                    <input
                                        id="password"
                                        v-model="formData.password"
                                        type="password"
                                        placeholder="Insira sua senha"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                                <template v-if="validationErrors.password">
                                    <p class="mt-1 text-danger">{{ validationErrors.password }}</p>
                                </template>
                            </div>
                            <div :class="{ 'has-error': validationErrors.password_confirmation, 'has-success': !validationErrors.password_confirmation && Object.keys(validationErrors).length > 0 }">
                                <label for="confirm-password">Confirmação da senha</label>
                                <div class="relative text-white-dark">
                                    <input
                                        id="confirm-password"
                                        v-model="formData.password_confirmation"
                                        type="password"
                                        placeholder="Confirme sua senha"
                                        class="form-input ps-10 placeholder:text-white-dark"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-lock-dots :fill="true" />
                                    </span>
                                </div>
                                <template v-if="validationErrors.password_confirmation">
                                    <p class="mt-1 text-danger">{{ validationErrors.password_confirmation }}</p>
                                </template>
                            </div>

                            <!-- Mensagem de sucesso -->
                            <div v-if="registrationSuccess" class="mb-4 rounded-md bg-success/10 p-4 border border-success/20">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <icon-circle-check class="h-5 w-5 text-success" />
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm text-success dark:text-success-light font-semibold mb-2">
                                            Cadastro realizado com sucesso!
                                        </p>
                                        <p class="text-sm text-success dark:text-success-light">
                                            Enviamos um e-mail de verificação para <strong>{{ formData.email }}</strong>. 
                                            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
                                        </p>
                                        <div class="mt-3">
                                            <NuxtLink to="/auth/resend-verification" class="text-sm text-primary hover:underline">
                                                Não recebeu o e-mail? Reenviar verificação
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mensagem de erro geral -->
                            <div v-if="error && !registrationSuccess" class="p-3 text-sm text-danger bg-danger/10 border border-danger/20 rounded">
                                {{ error }}
                            </div>

                            <button
                                type="submit"
                                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(36,83,155,0.44)]"
                                :disabled="loading"
                            >
                                <span v-if="loading" class="inline-flex items-center">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cadastrando...
                                </span>
                                <span v-else>Cadastre-se</span>
                            </button>
                        </form>

                        <div class="text-center dark:text-white mt-3">
                            Já tem uma conta?
                            <NuxtLink to="/auth/login" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                Acesse sua conta
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
    import { reactive, ref } from 'vue';
    import { useAuth } from '@/composables/useAuth';
    import IconCircleCheck from '@/components/icon/icon-circle-check.vue';

    useHead({ title: 'Cadastre-se' });

    const { register, loading, error, validationErrors, clearError } = useAuth();
    const registrationSuccess = ref(false);

    definePageMeta({
        layout: 'auth-layout',
        middleware: 'auth'
    });

    // Dados do formulário
    const formData = reactive({
        name: '',
        email: '',
        cpf: '',
        password: '',
        password_confirmation: '',
    });

    // Função para lidar com o registro
    const handleRegister = async () => {
        registrationSuccess.value = false;
        clearError();
        
        const result = await register(formData);

        if (result.success) {
            registrationSuccess.value = true;
            // Limpar formulário após sucesso
            formData.name = '';
            formData.email = '';
            formData.cpf = '';
            formData.password = '';
            formData.password_confirmation = '';
        } else {
            console.error('Erro no registro:', result.error);
        }
    };
</script>
