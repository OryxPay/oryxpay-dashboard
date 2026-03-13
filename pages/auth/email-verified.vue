<template>
    <div class="relative min-h-screen">
        <div
            class="relative z-10 flex min-h-screen items-center justify-center px-6 py-10 sm:px-16"
        >
            <div
                class="relative flex w-full max-w-[600px] flex-col items-center justify-center overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 p-8 lg:p-12"
            >
                <div class="w-full text-center">
                    <div
                        v-if="verified || alreadyVerified"
                        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
                    >
                        <icon-circle-check class="h-12 w-12 text-success" />
                    </div>
                    <div
                        v-else
                        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10"
                    >
                        <icon-x-circle class="h-12 w-12 text-danger" />
                    </div>

                    <h1 class="mb-4 text-3xl font-extrabold text-primary dark:text-white-light">
                        {{ alreadyVerified ? 'E-mail já verificado' : verified ? 'E-mail verificado com sucesso!' : 'Erro na verificação' }}
                    </h1>

                    <p v-if="verified" class="mb-6 text-base text-white-dark">
                        Seu e-mail foi verificado com sucesso! Agora você pode fazer login e começar a usar o OryxPay.
                    </p>

                    <p v-else-if="alreadyVerified" class="mb-6 text-base text-white-dark">
                        Este e-mail já foi verificado anteriormente. Você pode fazer login normalmente.
                    </p>

                    <p v-else class="mb-6 text-base text-white-dark">
                        O link de verificação é inválido ou expirou. Por favor, solicite um novo link de verificação.
                    </p>

                    <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <NuxtLink
                            v-if="verified || alreadyVerified"
                            to="/auth/login"
                            class="btn btn-gradient border-0 uppercase shadow-[0_10px_20px_-10px_rgba(36,83,155,0.44)]"
                        >
                            Fazer Login
                        </NuxtLink>
                        <NuxtLink
                            v-else
                            to="/auth/resend-verification"
                            class="btn btn-gradient border-0 uppercase shadow-[0_10px_20px_-10px_rgba(36,83,155,0.44)]"
                        >
                            Reenviar E-mail
                        </NuxtLink>
                        <NuxtLink
                            to="/"
                            class="btn btn-outline-primary uppercase"
                        >
                            Voltar ao Início
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import IconCircleCheck from '@/components/icon/icon-circle-check.vue';
    import IconXCircle from '@/components/icon/icon-x-circle.vue';

    useHead({ title: 'E-mail Verificado' });

    definePageMeta({
        layout: 'auth-layout',
        middleware: false, // Esta página não requer autenticação
    });

    const route = useRoute();
    const verified = ref(false);
    const alreadyVerified = ref(false);

    onMounted(() => {
        verified.value = route.query.verified === 'true';
        alreadyVerified.value = route.query.already_verified === 'true';
        
        // Se houver erro, mostrar mensagem
        if (route.query.error === 'invalid') {
            verified.value = false;
            alreadyVerified.value = false;
        }
    });
</script>
