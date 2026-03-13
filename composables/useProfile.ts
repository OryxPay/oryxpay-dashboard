export const useProfile = () => {
    const { $api } = useNuxtApp();

    const getProfile = async () => {
        try {
            const response = await $api('/profile', {
                method: 'GET',
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao buscar perfil',
            };
        }
    };

    const updateProfile = async (data: {
        name?: string;
        email?: string;
        cpf?: string;
        password?: string;
        password_confirmation?: string;
    }) => {
        try {
            const response = await $api('/profile', {
                method: 'PUT',
                body: data,
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao atualizar perfil',
                errors: error?.data?.errors,
            };
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await $api('/profile/avatar', {
                method: 'POST',
                body: formData,
                // Não definir Content-Type manualmente - o navegador define automaticamente com boundary
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao fazer upload do avatar',
                errors: error?.data?.errors,
            };
        }
    };

    const removeAvatar = async () => {
        try {
            await $api('/profile/avatar', {
                method: 'DELETE',
            });

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao remover avatar',
            };
        }
    };

    return {
        getProfile,
        updateProfile,
        uploadAvatar,
        removeAvatar,
    };
};
