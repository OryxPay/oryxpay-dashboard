<template>
    <!-- Banner: Conta Inativa -->
    <div
        v-if="authStore.isLoggedIn && !approvalStore.loading && !approvalStore.is_active"
        class="mx-5 mt-4 mb-4 flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-5 py-4 text-danger dark:border-danger/20 dark:bg-danger/10"
    >
        <icon-info-circle class="h-5 w-5 shrink-0" />
        <p class="text-sm font-medium">
            <template v-if="approvalStore.account_status === 'suspended'">
                Sua conta está suspensa. Entre em contato com o suporte para mais informações.
            </template>
            <template v-else>
                Sua conta está inativa. Entre em contato com o suporte para mais informações.
            </template>
        </p>
    </div>

    <!-- Banner: Documentos pendentes (apenas se conta ativa mas sem docs aprovados) -->
    <div
        v-else-if="authStore.isLoggedIn && !approvalStore.loading && approvalStore.is_active && !approvalStore.has_approved_documents"
        class="mx-5 mt-4 mb-4 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-5 py-4 text-warning dark:border-warning/20 dark:bg-warning/10"
    >
        <icon-info-circle class="h-5 w-5 shrink-0" />
        <p class="text-sm font-medium">
            Sua conta está em análise. Você poderá começar a operar após a aprovação dos documentos.
        </p>
    </div>
</template>

<script setup lang="ts">
    import { useAuthStore } from '@/stores/auth';
    import { useAccountApprovalStore } from '@/stores/accountApproval';

    const authStore = useAuthStore();
    const approvalStore = useAccountApprovalStore();

    onMounted(() => {
        if (authStore.isLoggedIn) {
            approvalStore.fetch();
        }
    });
</script>
