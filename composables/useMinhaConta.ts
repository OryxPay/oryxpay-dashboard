export type CompanyAccount = {
    tax_id: string | null;
    legal_name: string | null;
    commercial_name: string | null;
    name_on_invoice: string | null;
    average_revenue: number | null;
    average_ticket: number | null;
    products_sold: string | null;
    website_instagram: string | null;
    contact_phone: string | null;
    sells_physical_products: boolean;
};

export type Representative = {
    name: string;
    email: string;
    cpf: string | null;
    rg: string | null;
    phone: string | null;
    created_at: string | null;
    address: string | null;
    city: string | null;
    zip_code: string | null;
};

export type DocumentInfo = {
    type: string;
    id?: number;
    original_name?: string | null;
    has_file: boolean;
    status?: string | null;
    rejection_reason?: string | null;
};

export type CompanyData = {
    documents_submitted_at: string | null;
    can_transact: boolean;
    account: CompanyAccount;
    representative: Representative;
    documents: Record<string, DocumentInfo>;
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
    draft: 'Rascunho',
    under_analysis: 'Em análise',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
};

const DOCUMENT_TYPES = ['social_contract', 'rg_front', 'rg_back', 'selfie_document'] as const;
export const DOCUMENT_LABELS: Record<string, string> = {
    social_contract: 'Contrato Social',
    rg_front: 'Frente do RG/CNH',
    rg_back: 'Verso do RG/CNH',
    selfie_document: 'Selfie com Documento',
};

export const useMinhaConta = () => {
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();

    const getCompany = async () => {
        try {
            const response = await $api<{ success: boolean; data: CompanyData }>('/account/company', { method: 'GET' });
            return { success: true, data: response.data };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao carregar dados da conta',
            };
        }
    };

    const submitDocuments = async () => {
        try {
            await $api('/account/documents/submit', { method: 'POST' });
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao enviar documentos',
            };
        }
    };

    const getApprovalStatus = async () => {
        try {
            const response = await $api<{ success: boolean; data: { can_transact: boolean; documents_submitted_at: string | null } }>('/account/approval-status', { method: 'GET' });
            return { success: true, data: response.data };
        } catch {
            return { success: false, data: null };
        }
    };

    const updateCompany = async (data: Partial<CompanyAccount>) => {
        try {
            await $api('/account/company', { method: 'PUT', body: data });
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao salvar',
                errors: error?.data?.errors,
            };
        }
    };

    const uploadDocument = async (type: string, file: File) => {
        const validTypes = DOCUMENT_TYPES as readonly string[];
        if (!validTypes.includes(type)) {
            return {
                success: false,
                error: 'Categoria de documento inválida. Recarregue a página e tente novamente.',
            };
        }
        try {
            const formData = new FormData();
            formData.append('file', file);
            await $api(`/account/documents/${type}`, { method: 'POST', body: formData });
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error?.data?.message || 'Erro ao enviar documento',
                errors: error?.data?.errors,
            };
        }
    };

    /** Abre o documento em nova aba (requer token no header). */
    const openDocument = (documentId: number) => {
        if (process.client) {
            const token = localStorage.getItem('auth_token');
            if (!token) return;
            const base = (config.public.apiBase as string).replace(/\/$/, '');
            const url = `${base}/account/documents/${documentId}/download`;
            fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                .then((r) => r.blob())
                .then((blob) => {
                    const u = URL.createObjectURL(blob);
                    window.open(u, '_blank');
                })
                .catch(() => {});
        }
    };

    return {
        getCompany,
        updateCompany,
        uploadDocument,
        openDocument,
        submitDocuments,
        getApprovalStatus,
        DOCUMENT_TYPES,
        DOCUMENT_LABELS,
        DOCUMENT_STATUS_LABELS,
    };
};
