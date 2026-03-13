import { defineStore } from 'pinia';

interface User {
    id: number;
    name: string;
    email: string;
    cpf: string;
    avatar?: string | null;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    validationErrors: Record<string, string>;
}

interface RegisterData {
    name: string;
    email: string;
    cpf: string;
    password: string;
    password_confirmation: string;
}

interface AuthResponse {
    message: string;
    user: User;
    token?: string;
    email_verified?: boolean;
}

interface LoginStep1Response {
    requires_2fa?: boolean;
    challenge_token?: string;
    message?: string;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        validationErrors: {},
    }),

    getters: {
        getUser: (state) => state.user,
        getToken: (state) => state.token,
        isLoggedIn: (state) => state.isAuthenticated,
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
        getValidationErrors: (state) => state.validationErrors,
    },

    actions: {
        async register(registerData: RegisterData) {
            this.loading = true;
            this.error = null;

            try {
                // Remover pontos e traços do CPF para enviar apenas números
                const cleanCpf = registerData.cpf.replace(/[.-]/g, '');
                
                const { $api } = useNuxtApp();
                
                const response = await $api<AuthResponse>('/auth/register', {
                    method: 'POST',
                    body: {
                        name: registerData.name,
                        email: registerData.email,
                        cpf: cleanCpf,
                        password: registerData.password,
                        password_confirmation: registerData.password_confirmation,
                    },
                });

                // Se o email não foi verificado, não salvar token nem autenticar
                if (response.email_verified === false || !response.token) {
                    // Apenas retornar a resposta sem autenticar
                    return response;
                }

                // Salvar dados do usuário e token apenas se email foi verificado
                this.user = response.user;
                this.token = response.token;
                this.isAuthenticated = true;

                // Salvar token no localStorage
                if (process.client) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                return response;
            } catch (error: any) {
                // Tratar erros de validação do Laravel
                if (error.data?.errors) {
                    // Limpar erros anteriores
                    this.validationErrors = {};
                    this.error = null;
                    
                    // Mapear erros de validação para os campos
                    Object.keys(error.data.errors).forEach(field => {
                        const fieldErrors = error.data.errors[field];
                        this.validationErrors[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
                    });
                } else {
                    this.error = error.data?.message || 'Erro ao registrar usuário';
                    this.validationErrors = {};
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(credentials: { email: string; password: string; remember?: boolean }) {
            this.loading = true;
            this.error = null;

            try {
                const { $api } = useNuxtApp();
                
                const response = await $api<AuthResponse & LoginStep1Response>('/auth/login', {
                    method: 'POST',
                    body: credentials,
                });
                
                // Novo backend: login é em 2 passos
                if (response.requires_2fa && response.challenge_token) {
                    if (process.client) {
                        if (credentials.remember) {
                            localStorage.setItem('remember_me', 'true');
                        } else {
                            localStorage.removeItem('remember_me');
                        }
                    }
                    return response;
                }

                // Compatibilidade: caso backend já devolva token diretamente
                if (response.user && response.token) {
                    this.user = response.user;
                    this.token = response.token;
                    this.isAuthenticated = true;

                    if (process.client) {
                        localStorage.setItem('auth_token', response.token);
                        localStorage.setItem('user', JSON.stringify(response.user));
                        if (credentials.remember) {
                            localStorage.setItem('remember_me', 'true');
                        } else {
                            localStorage.removeItem('remember_me');
                        }
                    }
                }

                return response;
            } catch (error: any) {
                // Tratar erros de validação do Laravel
                if (error.data?.errors) {
                    // Limpar erros anteriores
                    this.validationErrors = {};
                    this.error = null;
                    
                    // Mapear erros de validação para os campos
                    Object.keys(error.data.errors).forEach(field => {
                        const fieldErrors = error.data.errors[field];
                        this.validationErrors[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
                    });
                } else {
                    this.error = error.data?.message || 'Erro ao fazer login';
                    this.validationErrors = {};
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async verify2fa(payload: { challenge_token: string; code: string }) {
            this.loading = true;
            this.error = null;
            this.validationErrors = {};

            try {
                const { $api } = useNuxtApp();
                const response = await $api<AuthResponse>('/auth/verify-2fa', {
                    method: 'POST',
                    body: payload,
                });

                this.user = response.user;
                this.token = response.token || null;
                this.isAuthenticated = Boolean(response.token);

                if (process.client && response.token) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                return response;
            } catch (error: any) {
                if (error.data?.errors) {
                    this.validationErrors = {};
                    Object.keys(error.data.errors).forEach(field => {
                        const fieldErrors = error.data.errors[field];
                        this.validationErrors[field] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;
                    });
                } else {
                    this.error = error.data?.message || 'Código inválido';
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async resend2fa(challengeToken: string) {
            this.loading = true;
            this.error = null;
            try {
                const { $api } = useNuxtApp();
                const response = await $api<{ success?: boolean; message?: string }>('/auth/resend-2fa', {
                    method: 'POST',
                    body: { challenge_token: challengeToken },
                });
                return response;
            } catch (error: any) {
                this.error = error?.data?.message || 'Falha ao reenviar código';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                const { $api } = useNuxtApp();
                // Chamar endpoint de logout no backend
                await $api('/auth/logout', {
                    method: 'POST',
                });
            } catch (error) {
                console.error('Erro ao fazer logout no backend:', error);
            } finally {
                // Limpar dados locais mesmo se a chamada falhar
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                this.error = null;
                this.validationErrors = {};

                if (process.client) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('remember_me');
                    localStorage.removeItem('has_active_subscription');
                    localStorage.removeItem('subscription_is_valid');
                    localStorage.removeItem('subscription_days_remaining');
                }
            }
        },

        async me() {
            try {
                const { $api } = useNuxtApp();
                const response = await $api<{ user: User }>('/auth/me');
                this.user = response.user;
                if (process.client) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }
                return response.user;
            } catch (error: any) {
                console.error('Erro ao buscar dados do usuário:', error);
                // Se der erro 401, fazer logout
                if (error.status === 401 || error.statusCode === 401) {
                    this.logout();
                }
                throw error;
            }
        },

        clearError() {
            this.error = null;
            this.validationErrors = {};
        },



        // Verificar se há token salvo no localStorage ao inicializar
        async initializeAuth() {
            // Só executar no lado do cliente
            if (process.client) {
                const token = localStorage.getItem('auth_token');
                const user = localStorage.getItem('user');

                if (token && user) {
                    try {
                        this.token = token;
                        this.user = JSON.parse(user);
                        this.isAuthenticated = true;
                        
                        await this.me();
                    } catch (error) {
                        // Se der erro, fazer logout
                        this.logout();
                    }
                }
            }
        },
    },
});
