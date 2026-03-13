<template>
    <div class="relative min-h-screen">
        <div class="fixed inset-0 z-0">
            <img src="/assets/images/auth/bg-auth.webp" alt="background" class="h-full w-full object-cover" />
        </div>
        <div
            class="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 sm:px-16"
        >
            <div
                class="relative flex w-full max-w-[600px] flex-col items-center justify-center overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 p-8 lg:p-12"
            >
                <div class="w-full max-w-[440px]">
                    <div class="mb-10 text-center">
                        <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                            Reenviar Verificação
                        </h1>
                        <p class="text-base font-bold leading-normal text-white-dark">
                            Digite seu e-mail para receber um novo link de verificação
                        </p>
                    </div>

                    <!-- Mensagem de sucesso -->
                    <div v-if="success" class="mb-4 rounded-md bg-success/10 p-4 border border-success/20">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <icon-circle-check class="h-5 w-5 text-success" />
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-success dark:text-success-light">{{ success }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Mensagem de erro -->
                    <div v-if="error" class="mb-4 rounded-md bg-danger/10 p-4 border border-danger/20">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <icon-x-circle class="h-5 w-5 text-danger" />
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-danger dark:text-danger-light">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <form class="space-y-5 dark:text-white" @submit.prevent="handleResend">
                        <div>
                            <label for="email">Email</label>
                            <div class="relative text-white-dark">
                                <input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    placeholder="Insira seu email"
                                    class="form-input ps-10 placeholder:text-white-dark"
                                    :class="{
                                        'border-danger': validationErrors.email,
                                    }"
                                    :disabled="loading || success"
                                />
                                <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                    <icon-mail :fill="true" />
                                </span>
                            </div>
                            <p v-if="validationErrors.email" class="mt-1 text-sm text-danger">
                                {{ validationErrors.email }}
                            </p>
                        </div>

                        <button
                            type="submit"
                            class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(36,83,155,0.44)]"
                            :disabled="loading || success"
                        >
                            <span v-if="loading">Enviando...</span>
                            <span v-else-if="success">E-mail Enviado!</span>
                            <span v-else>Reenviar E-mail de Verificação</span>
                        </button>

                        <div class="text-center">
                            <NuxtLink to="/auth/login" class="text-sm text-primary hover:underline">
                                Voltar para o login
                            </NuxtLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue';
    import { useAuth } from '@/composables/useAuth';
    import { useToast } from '@/composables/useToast';
    import IconCircleCheck from '@/components/icon/icon-circle-check.vue';
    import IconXCircle from '@/components/icon/icon-x-circle.vue';

    useHead({ title: 'Reenviar Verificação' });

    definePageMeta({
        layout: 'auth-layout',
        middleware: false, // Esta página não requer autenticação
    });

    const { $api } = useNuxtApp();
    const { showToast } = useToast();

    const loading = ref(false);
    const success = ref('');
    const error = ref('');
    const validationErrors = reactive<Record<string, string>>({});

    const form = reactive({
        email: '',
    });

    const handleResend = async () => {
        loading.value = true;
        error.value = '';
        success.value = '';
        Object.keys(validationErrors).forEach(key => delete validationErrors[key]);

        try {
            const response = await $api('/auth/email/resend', {
                method: 'POST',
                body: {
                    email: form.email,
                },
            });

            if (response.success) {
                success.value = response.message || 'Link de verificação reenviado com sucesso! Verifique sua caixa de entrada.';
                showToast(success.value, 'success');
            } else {
                error.value = response.message || 'Erro ao reenviar e-mail de verificação';
                showToast(error.value, 'error');
            }
        } catch (err: any) {
            if (err.data?.errors) {
                Object.keys(err.data.errors).forEach(key => {
                    validationErrors[key] = Array.isArray(err.data.errors[key])
                        ? err.data.errors[key][0]
                        : err.data.errors[key];
                });
            } else {
                error.value = err.data?.message || 'Erro ao reenviar e-mail de verificação';
                showToast(error.value, 'error');
            }
        } finally {
            loading.value = false;
        }
    };
</script>
