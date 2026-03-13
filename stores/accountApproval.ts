import { defineStore } from 'pinia';

interface ApprovalStatusData {
    can_transact: boolean;
    is_active: boolean;
    has_approved_documents: boolean;
    account_status: 'active' | 'suspended' | 'inactive' | null;
    documents_submitted_at: string | null;
}

export const useAccountApprovalStore = defineStore('accountApproval', {
    state: () => ({
        can_transact: true as boolean,
        is_active: true as boolean,
        has_approved_documents: true as boolean,
        account_status: null as 'active' | 'suspended' | 'inactive' | null,
        documents_submitted_at: null as string | null,
        loading: false as boolean,
    }),

    actions: {
        setCanTransact(value: boolean) {
            this.can_transact = value;
        },
        async fetch() {
            this.loading = true;
            try {
                const { $api } = useNuxtApp();
                const response = await $api<{ success: boolean; data: ApprovalStatusData }>('/account/approval-status', { method: 'GET' });
                if (response?.data) {
                    this.can_transact = response.data.can_transact;
                    this.is_active = response.data.is_active;
                    this.has_approved_documents = response.data.has_approved_documents;
                    this.account_status = response.data.account_status;
                    this.documents_submitted_at = response.data.documents_submitted_at;
                }
            } catch {
                this.can_transact = true;
                this.is_active = true;
                this.has_approved_documents = true;
            } finally {
                this.loading = false;
            }
        },
    },
});
