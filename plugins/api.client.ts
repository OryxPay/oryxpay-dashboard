export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    
    // Criar uma instância do $fetch específica para a API
    const apiFetch = $fetch.create({
        baseURL: config.public.apiBase,
        headers: {
            'Accept': 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
        },
        onRequest({ request, options }) {
            // Adicionar token de autenticação se existir
            if (process.client) {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${token}`,
                    } as any;
                }
            }
            
            // Definir Content-Type apenas se não for FormData
            if (!(options.body instanceof FormData)) {
                options.headers = {
                    ...options.headers,
                    'Content-Type': 'application/json',
                } as any;
            }
        },
        onResponseError({ response }) {
            // Se receber 401, fazer logout
            if (response.status === 401) {
                const authStore = useAuthStore();
                authStore.logout();
                navigateTo('/auth/login');
            }
        },
    });

    // Expor a instância da API globalmente
    return {
        provide: {
            api: apiFetch
        }
    };
});
