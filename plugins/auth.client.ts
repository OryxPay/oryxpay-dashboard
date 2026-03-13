export default defineNuxtPlugin(async (nuxtApp) => {
    // Só executar no cliente
    if (process.client) {
        const authStore = useAuthStore();
        const router = useRouter();
        
        // Verificar se já foi inicializado para evitar múltiplas inicializações
        if (!authStore.isAuthenticated) {
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                try {
                    // Restaurar estado do localStorage imediatamente
                    authStore.token = token;
                    authStore.user = JSON.parse(user);
                    authStore.isAuthenticated = true;
                    
                    // Verificar token em background (não bloquear)
                    authStore.me().then(() => {
                        // Token válido; nenhum redirect adicional
                    }).catch(() => {
                        // Se o token for inválido, o me() já faz logout automaticamente
                    });
                } catch (error) {
                    // Se houver erro ao restaurar, limpar dados
                    authStore.logout();
                }
            }
        }
    }
});
