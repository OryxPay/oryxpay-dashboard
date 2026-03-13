export interface BalanceData {
    /** Saldo disponível em centavos */
    balance_available: number;
    /** Saldo pendente em centavos */
    balance_pending: number;
    /** Taxa de transferência (saque) em centavos */
    transfer_fee?: number;
    /** Valor mínimo de saque em centavos */
    min_withdrawal_amount?: number;
    /** Valor máximo de saque em centavos */
    max_withdrawal_amount?: number;
}

export interface BankAccount {
    id: number;
    account_id: number;
    pix_key_type: string;
    pix_key_masked: string;
    is_primary: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface WithdrawItem {
    id: number;
    account_id: number;
    account_bank_account_id: number;
    /** Valor em centavos */
    amount: number;
    /** Taxa em centavos */
    fee: number;
    type: string;
    status: string;
    created_at: string;
    account_bank_account?: BankAccount;
}

export interface PaginatedMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export const useSaldo = () => {
    const { $api } = useNuxtApp();

    const getBalance = async (): Promise<{ success: boolean; data?: BalanceData; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: BalanceData }>('/account/balance', { method: 'GET' });
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || error?.data?.error || 'Falha ao carregar saldo',
            };
        }
    };

    const getBankAccounts = async (): Promise<{ success: boolean; data?: BankAccount[]; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: BankAccount[] }>('/account/bank-accounts', { method: 'GET' });
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Falha ao carregar chaves PIX',
            };
        }
    };

    const addBankAccount = async (payload: {
        pix_key_type: string;
        pix_key: string;
        is_primary?: boolean;
    }): Promise<{ success: boolean; data?: BankAccount; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: BankAccount }>('/account/bank-accounts', {
                method: 'POST',
                body: payload,
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            const msg = error?.data?.errors ? Object.values(error.data.errors).flat().join(' ') : error?.data?.message || 'Falha ao cadastrar';
            return { success: false, error: msg };
        }
    };

    const updateBankAccount = async (
        id: number,
        payload: { pix_key_type?: string; pix_key?: string; is_primary?: boolean }
    ): Promise<{ success: boolean; data?: BankAccount; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: BankAccount }>(`/account/bank-accounts/${id}`, {
                method: 'PUT',
                body: payload,
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            const msg = error?.data?.errors ? Object.values(error.data.errors).flat().join(' ') : error?.data?.message || 'Falha ao atualizar';
            return { success: false, error: msg };
        }
    };

    const deleteBankAccount = async (id: number): Promise<{ success: boolean; error?: string }> => {
        try {
            await $api(`/account/bank-accounts/${id}`, { method: 'DELETE' });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error?.data?.message || 'Falha ao excluir' };
        }
    };

    const setPrimaryBankAccount = async (id: number): Promise<{ success: boolean; data?: BankAccount; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: BankAccount }>(`/account/bank-accounts/${id}/set-primary`, {
                method: 'POST',
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            return { success: false, error: error?.data?.message || 'Falha ao definir como principal' };
        }
    };

    const getWithdraws = async (
        perPage = 10,
        page = 1
    ): Promise<{ success: boolean; data?: WithdrawItem[]; meta?: PaginatedMeta; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: WithdrawItem[]; meta?: PaginatedMeta }>('/account/withdraws', {
                method: 'GET',
                query: { per_page: perPage, page },
            });
            return { success: true, data: response.data, meta: response.meta };
        } catch (error: any) {
            return { success: false, error: error?.data?.message || 'Falha ao carregar saques' };
        }
    };

    /** amountCents: valor do saque em centavos */
    const requestWithdraw = async (amountCents: number, accountBankAccountId: number): Promise<{ success: boolean; data?: WithdrawItem; error?: string }> => {
        try {
            const response = await $api<{ success: boolean; data: WithdrawItem }>('/account/withdraws', {
                method: 'POST',
                body: { amount: amountCents, account_bank_account_id: accountBankAccountId },
            });
            return { success: true, data: response.data };
        } catch (error: any) {
            const msg = error?.data?.error || error?.data?.message || 'Falha ao solicitar saque';
            return { success: false, error: msg };
        }
    };

    return {
        getBalance,
        getBankAccounts,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setPrimaryBankAccount,
        getWithdraws,
        requestWithdraw,
    };
};
