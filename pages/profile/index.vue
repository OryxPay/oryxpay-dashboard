<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <NuxtLink to="/" class="text-primary hover:underline">Dashboard</NuxtLink>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Perfil</span>
            </li>
        </ul>
        <div class="pt-5">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">Configurações do Perfil</h5>
            </div>

            <div class="panel">
                <form @submit.prevent="handleSubmit" class="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#1E293B] dark:bg-[#0F172A]">
                    <h6 class="mb-5 text-lg font-bold">Informações Gerais</h6>
                    <div class="flex flex-col sm:flex-row">
                        <div class="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                            <div class="relative mx-auto h-32 w-32">
                                <img
                                    v-if="form.avatar || userAvatar"
                                    :src="form.avatar || userAvatar"
                                    alt="Avatar"
                                    class="h-32 w-32 rounded-full object-cover border-2 border-[#ebedf2] dark:border-[#191e3a]"
                                />
                                <div
                                    v-else
                                    class="flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-light/20 border-2 border-[#ebedf2] dark:border-[#191e3a]"
                                >
                                    <icon-user class="h-16 w-16 text-gray-400" />
                                </div>
                                <label
                                    for="avatar-upload"
                                    class="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all"
                                >
                                    <icon-camera class="h-5 w-5" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        class="hidden"
                                        @change="handleAvatarChange"
                                    />
                                </label>
                                <button
                                    v-if="form.avatar || userAvatar"
                                    type="button"
                                    class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white hover:bg-danger-dark transition-all"
                                    @click="handleRemoveAvatar"
                                >
                                    <icon-x class="h-4 w-4" />
                                </button>
                            </div>
                            <p v-if="errors.avatar" class="mt-2 text-sm text-danger">{{ errors.avatar }}</p>
                        </div>
                        <div class="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label for="name">Nome Completo *</label>
                                <input
                                    id="name"
                                    v-model="form.name"
                                    type="text"
                                    placeholder="Seu nome"
                                    class="form-input"
                                    :class="{ 'border-danger': errors.name }"
                                />
                                <p v-if="errors.name" class="mt-1 text-sm text-danger">{{ errors.name }}</p>
                            </div>
                            <div>
                                <label for="email">E-mail</label>
                                <input
                                    id="email"
                                    :value="form.email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    class="form-input bg-gray-50 dark:bg-dark-light/20 cursor-not-allowed"
                                    readonly
                                    disabled
                                />
                                <p class="mt-1 text-xs text-white-dark">O e-mail não pode ser alterado</p>
                            </div>
                            <div>
                                <label for="cpf">CPF</label>
                                <input
                                    id="cpf"
                                    :value="form.cpf"
                                    type="text"
                                    placeholder="000.000.000-00"
                                    class="form-input bg-gray-50 dark:bg-dark-light/20 cursor-not-allowed"
                                    readonly
                                    disabled
                                />
                                <p class="mt-1 text-xs text-white-dark">O CPF não pode ser alterado</p>
                            </div>
                            <div>
                                <label for="password">Nova Senha</label>
                                <input
                                    id="password"
                                    v-model="form.password"
                                    type="password"
                                    placeholder="Deixe em branco para não alterar"
                                    class="form-input"
                                    :class="{ 'border-danger': errors.password }"
                                />
                                <p v-if="errors.password" class="mt-1 text-sm text-danger">{{ errors.password }}</p>
                            </div>
                            <div v-if="form.password">
                                <label for="password_confirmation">Confirmar Nova Senha</label>
                                <input
                                    id="password_confirmation"
                                    v-model="form.password_confirmation"
                                    type="password"
                                    placeholder="Confirme a nova senha"
                                    class="form-input"
                                    :class="{ 'border-danger': errors.password_confirmation }"
                                />
                                <p v-if="errors.password_confirmation" class="mt-1 text-sm text-danger">{{ errors.password_confirmation }}</p>
                            </div>
                            <div class="mt-3 sm:col-span-2">
                                <button type="submit" class="btn btn-primary" :disabled="loading">
                                    <span v-if="loading">Salvando...</span>
                                    <span v-else>Salvar Alterações</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, computed } from 'vue';
    import { useProfile } from '@/composables/useProfile';
    import { useAuth } from '@/composables/useAuth';
    import { useToast } from '@/composables/useToast';

    useHead({ title: 'Perfil' });

    definePageMeta({
        middleware: 'auth',
    });

    const { getProfile, updateProfile, uploadAvatar, removeAvatar } = useProfile();
    const { me, user } = useAuth();
    const { showToast } = useToast();

    const loading = ref(false);
    const userAvatar = ref<string | null>(null);
    const avatarFile = ref<File | null>(null);

    const form = reactive({
        name: '',
        email: '',
        cpf: '',
        password: '',
        password_confirmation: '',
        avatar: null as string | null,
    });

    const errors = reactive<Record<string, string>>({});

    const getAvatarUrl = (avatarPath: string | null): string | null => {
        if (!avatarPath) return null;
        const config = useRuntimeConfig();
        const apiBase = config.public.apiBase;
        const baseUrl = apiBase.replace('/api', '');
        const storageBase = String(config.public.storageBaseUrl || '').replace(/\/+$/, '');

        // Se já é uma URL completa, verificar se precisa ajustar a porta
        if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
            // Se a URL não contém a porta correta, substituir pela base URL do backend
            try {
                const url = new URL(avatarPath);
                const backendUrl = new URL(baseUrl);

                // Se o host é localhost mas a porta está diferente, ajustar
                if (url.hostname === 'localhost' && url.port !== backendUrl.port) {
                    return baseUrl + url.pathname + (url.search || '');
                }
            } catch (e) {
                // Se não conseguir fazer parse, retornar como está
            }

            return avatarPath;
        }

        // Se o caminho já começa com /storage, apenas adicionar a base
        if (avatarPath.startsWith('/storage')) {
            return baseUrl + avatarPath;
        }

        if (avatarPath.startsWith('storage/')) {
            return baseUrl + '/' + avatarPath;
        }

        // Produção com S3: avatar vem como "avatars/arquivo.png"
        if (storageBase) {
            return storageBase + '/' + avatarPath.replace(/^\/+/, '');
        }

        // Caso contrário, adicionar /storage
        return baseUrl + '/storage/' + avatarPath.replace(/^\/+/, '');
    };

    const loadProfile = async () => {
        loading.value = true;
        try {
            const result = await getProfile();
            if (result.success && result.data) {
                form.name = result.data.name || '';
                form.email = result.data.email || '';
                form.cpf = result.data.cpf || '';
                const avatarUrl = getAvatarUrl((result.data.avatar_url as string | null) || result.data.avatar);
                userAvatar.value = avatarUrl;
                form.avatar = avatarUrl;
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            loading.value = false;
        }
    };

    const handleAvatarChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            // Validar tamanho (1MB)
            if (file.size > 1024 * 1024) {
                showToast('A imagem deve ser menor que 1MB', 'error');
                // Limpar o input
                target.value = '';
                return;
            }

            // Validar tipo
            if (!file.type.startsWith('image/')) {
                showToast('O arquivo deve ser uma imagem', 'error');
                // Limpar o input
                target.value = '';
                return;
            }

            avatarFile.value = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                form.avatar = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = async () => {
        if (confirm('Deseja realmente remover a foto de perfil?')) {
            loading.value = true;
            try {
                const result = await removeAvatar();
                if (result.success) {
                    form.avatar = null;
                    userAvatar.value = null;
                    avatarFile.value = null;
                    showToast('Avatar removido com sucesso', 'success');
                    // Atualizar dados do usuário
                    await me();
                } else {
                    showToast(result.error || 'Erro ao remover avatar', 'error');
                }
            } catch (error) {
                showToast('Erro ao remover avatar', 'error');
            } finally {
                loading.value = false;
            }
        }
    };

    const handleSubmit = async () => {
        loading.value = true;
        Object.keys(errors).forEach(key => delete errors[key]);

        try {
            // Upload do avatar primeiro, se houver
            if (avatarFile.value) {
                const avatarResult = await uploadAvatar(avatarFile.value);
                if (!avatarResult.success) {
                    if (avatarResult.errors?.avatar) {
                        errors.avatar = Array.isArray(avatarResult.errors.avatar)
                            ? avatarResult.errors.avatar[0]
                            : avatarResult.errors.avatar;
                    } else {
                        showToast(avatarResult.error || 'Erro ao fazer upload do avatar', 'error');
                    }
                    loading.value = false;
                    return;
                }
                const uploadedAvatar = (avatarResult.data?.avatar_url as string | null) || avatarResult.data?.avatar || null;
                if (uploadedAvatar) {
                    const avatarUrl = getAvatarUrl(uploadedAvatar);
                    userAvatar.value = avatarUrl;
                    form.avatar = avatarUrl;
                }
                avatarFile.value = null;
            }

            // Preparar dados para atualização
            const updateData: any = {
                name: form.name,
            };

            // Email e CPF não podem ser alterados

            if (form.password) {
                updateData.password = form.password;
                updateData.password_confirmation = form.password_confirmation;
            }

            // Atualizar perfil
            const result = await updateProfile(updateData);
            if (result.success) {
                showToast('Perfil atualizado com sucesso', 'success');
                // Atualizar dados do usuário
                await me();
                // Limpar senha
                form.password = '';
                form.password_confirmation = '';
            } else {
                if (result.errors) {
                    Object.keys(result.errors).forEach(key => {
                        errors[key] = Array.isArray(result.errors![key])
                            ? result.errors![key][0]
                            : result.errors![key];
                    });
                } else {
                    showToast(result.error || 'Erro ao atualizar perfil', 'error');
                }
            }
        } catch (error) {
            showToast('Erro ao atualizar perfil', 'error');
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        loadProfile();
    });
</script>
