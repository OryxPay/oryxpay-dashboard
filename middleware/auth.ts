export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) return;

    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        if (token && user) {
            try {
                authStore.token = token;
                authStore.user = JSON.parse(user);
                authStore.isAuthenticated = true;
            } catch {
                authStore.logout();
            }
        }
    }

    const publicAuthRoutes = [
        '/auth/login',
        '/auth/verify-2fa',
        '/auth/impersonate',
        '/auth/register',
        '/auth/email-verified',
        '/auth/resend-verification',
    ];

    if (!authStore.isLoggedIn && !publicAuthRoutes.includes(to.path)) {
        return navigateTo('/auth/login');
    }

    if (authStore.isLoggedIn && (to.path === '/auth/login' || to.path === '/auth/register' || to.path === '/auth/verify-2fa')) {
        return navigateTo('/');
    }

    // Logado e acessando área interna: se precisar de onboarding, redireciona
    if (authStore.isLoggedIn && to.path !== '/onboarding') {
        try {
            const { $api } = useNuxtApp();
            const res = await $api<{ success: boolean; data: { needs_onboarding: boolean } }>('/account/onboarding-status', { method: 'GET' });
            if (res?.data?.needs_onboarding) {
                return navigateTo('/onboarding');
            }
        } catch {
            // Se falhar (ex: token inválido), não redirecionar para onboarding
        }
    }
});
