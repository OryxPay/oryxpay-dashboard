<template>
    <div class="flex min-h-screen items-center justify-center p-6">
        <div class="panel w-full max-w-md text-center">
            <h1 class="text-lg font-semibold dark:text-white-light">Acessando conta...</h1>
            <p class="mt-2 text-sm text-white-dark">{{ message }}</p>
            <div class="mt-5 flex justify-center">
                <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-l-transparent" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({ layout: 'auth', middleware: 'auth' });
    useHead({ title: 'Acessar conta' });

    const route = useRoute();
    const router = useRouter();
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    const message = ref('Validando sessão...');

    onMounted(async () => {
        const token = String(route.query.token || '').trim();
        if (!token) {
            message.value = 'Token inválido. Redirecionando para login...';
            setTimeout(() => router.replace('/auth/login'), 900);
            return;
        }

        try {
            authStore.token = token;
            authStore.isAuthenticated = true;
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', token);
            }

            const me = await $api<{ user: any }>('/auth/me', { method: 'GET' });
            authStore.user = me.user;
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(me.user));
            }

            message.value = 'Sessão iniciada. Redirecionando...';
            await router.replace('/');
        } catch {
            authStore.logout();
            message.value = 'Não foi possível acessar esta conta. Redirecionando para login...';
            setTimeout(() => router.replace('/auth/login'), 1200);
        }
    });
</script>
