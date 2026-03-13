export const useAuth = () => {
    const authStore = useAuthStore();
    const router = useRouter();

    const register = async (data: {
        name: string;
        email: string;
        cpf: string;
        password: string;
        password_confirmation: string;
    }) => {
        try {
            const response = await authStore.register(data);
            // Se o email não foi verificado, não redirecionar
            if (response.email_verified === false || !response.token) {
                return { success: true, email_verified: false };
            }
            await router.push('/');
            return { success: true, email_verified: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
        try {
            const response = await authStore.login(credentials);
            if ((response as any)?.requires_2fa && (response as any)?.challenge_token) {
                return {
                    success: true,
                    requires2fa: true,
                    challengeToken: (response as any).challenge_token as string,
                };
            }
            await router.push('/');
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const verify2fa = async (payload: { challenge_token: string; code: string }) => {
        try {
            await authStore.verify2fa(payload);
            await router.push('/');
            return { success: true };
        } catch (error) {
            return { success: false, error };
        }
    };

    const resend2fa = async (challengeToken: string) => {
        try {
            const response = await authStore.resend2fa(challengeToken);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error };
        }
    };

    const logout = async () => {
        await authStore.logout();
        router.push('/auth/login');
    };

    const me = async () => {
        try {
            return await authStore.me();
        } catch {
            return null;
        }
    };

    const isAuthenticated = computed(() => authStore.isLoggedIn);
    const user = computed(() => authStore.getUser);
    const loading = computed(() => authStore.isLoading);
    const error = computed(() => authStore.getError);
    const validationErrors = computed(() => authStore.getValidationErrors);

    return {
        register,
        login,
        verify2fa,
        resend2fa,
        logout,
        me,
        isAuthenticated,
        user,
        loading,
        error,
        validationErrors,
        clearError: authStore.clearError,
    };
};
