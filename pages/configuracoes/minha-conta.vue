<template>
    <div>
        <div class="mb-5">
            <h5 class="text-lg font-semibold dark:text-white-light">Minha Empresa</h5>
            <p class="text-white-dark">Veja e edite os dados da sua empresa.</p>
        </div>

        <div v-if="loading" class="mt-8 grid place-content-center py-12">
            <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary border-l-transparent"></span>
        </div>
        <div v-else class="mt-8 space-y-8">
            <!-- Card: Informações da empresa -->
            <div class="panel mb-8">
                <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h5 class="text-lg font-semibold dark:text-white-light">Informações da empresa</h5>
                        <p class="text-sm text-white-dark">Configure as principais informações sobre a sua empresa.</p>
                    </div>
                    <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
                        Salvar
                    </button>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">CPF/CNPJ</label>
                        <input
                            v-model="form.tax_id"
                            type="text"
                            class="form-input"
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            v-maska="{ mask: ['###.###.###-##', '##.###.###/####-##'] }"
                            maxlength="18"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Razão social</label>
                        <input
                            v-model="form.legal_name"
                            type="text"
                            class="form-input"
                            maxlength="255"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Nome comercial</label>
                        <input
                            v-model="form.commercial_name"
                            type="text"
                            class="form-input"
                            maxlength="60"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Nome na fatura</label>
                        <input
                            v-model="form.name_on_invoice"
                            type="text"
                            class="form-input"
                            maxlength="60"
                        />
                    </div>
                </div>
            </div>

            <!-- Card: Representante Legal (somente leitura, sem botão Salvar) -->
            <div class="panel mb-8">
                <div class="mb-5">
                    <h5 class="text-lg font-semibold dark:text-white-light">Representante Legal</h5>
                    <p class="text-sm text-white-dark">Visualize as informações do representante legal da sua empresa.</p>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Nome</label>
                        <input
                            :value="representative.name"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">E-mail</label>
                        <input
                            :value="representative.email"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">CPF</label>
                        <input
                            :value="formatCpfForDisplay(representative.cpf)"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">RG</label>
                        <input
                            :value="formatRgForDisplay(representative.rg)"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Telefone</label>
                        <input
                            :value="representative.phone"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Criado em</label>
                        <input
                            :value="representative.created_at"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2 sm:col-span-2">
                        <label class="text-sm font-medium leading-none">Endereço</label>
                        <input
                            :value="representative.address"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Cidade</label>
                        <input
                            :value="representative.city"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">CEP</label>
                        <input
                            :value="representative.zip_code"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            <!-- Card: Detalhes da empresa -->
            <div class="panel mb-8">
                <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h5 class="text-lg font-semibold dark:text-white-light">Detalhes da empresa</h5>
                        <p class="text-sm text-white-dark">Configure as informações sobre a sua empresa.</p>
                    </div>
                    <button type="button" class="btn btn-primary" :disabled="saving" @click="save">
                        Salvar
                    </button>
                </div>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <common-amount-input
                            v-model="form.average_revenue"
                            label="Faturamento médio"
                            placeholder="0,00"
                        />
                    </div>
                    <div>
                        <common-amount-input
                            v-model="form.average_ticket"
                            label="Ticket médio"
                            placeholder="0,00"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Quais produtos você vende?</label>
                        <input
                            v-model="form.products_sold"
                            type="text"
                            class="form-input"
                            maxlength="100"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Site / Instagram</label>
                        <input
                            v-model="form.website_instagram"
                            type="text"
                            class="form-input"
                            maxlength="100"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">E-mail de contato</label>
                        <input
                            :value="representative.email"
                            type="text"
                            disabled
                            class="form-input opacity-50 cursor-not-allowed"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Telefone de contato</label>
                        <input
                            v-model="form.contact_phone"
                            type="text"
                            class="form-input"
                            placeholder="(00) 00000-0000"
                            v-maska="{ mask: ['(##) ####-####', '(##) #####-####'] }"
                            maxlength="15"
                        />
                    </div>
                </div>
            </div>

            <!-- Card: Documentos -->
            <div class="panel mb-20">
                <div class="mb-5">
                    <h5 class="text-lg font-semibold dark:text-white-light">Documentos</h5>
                    <p class="text-sm text-white-dark">Verifique os documentos enviados.</p>
                </div>

                <!-- Ainda não enviou: uploads + botão Enviar documentos -->
                <template v-if="!documents_submitted_at">
                    <p class="mb-4 text-sm text-white-dark">
                        Envie todos os documentos abaixo e clique em <strong>Enviar documentos</strong> para enviar à análise. Após o envio, não será possível alterar até a conclusão da análise.
                    </p>
                    <div class="grid gap-4">
                        <div v-for="docType in DOCUMENT_TYPES" :key="docType" class="space-y-2">
                            <p class="text-sm font-medium leading-none dark:text-white-light">{{ DOCUMENT_LABELS[docType] }} <span class="text-danger">*</span></p>
                            <div class="flex min-h-12 flex-wrap items-center gap-4 rounded-md border border-input dark:border-white-dark/20">
                                <label class="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                    <icon-upload class="h-4 w-4 shrink-0 text-white" />
                                    <span class="text-white">Escolher Arquivo</span>
                                    <input
                                        type="file"
                                        class="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        @change="onFileChange(docType, $event)"
                                    />
                                </label>
                                <template v-if="documents[docType]?.has_file && documents[docType]?.id && !pendingFiles[docType]">
                                    <a
                                        href="javascript:;"
                                        class="text-primary underline"
                                        @click="openDocument(documents[docType].id)"
                                    >
                                        Visualizar documento carregado
                                    </a>
                                    <span v-if="documents[docType]?.original_name" class="truncate text-sm text-white-dark">
                                        {{ documents[docType].original_name }}
                                    </span>
                                </template>
                                <template v-else-if="pendingFiles[docType]">
                                    <a
                                        href="javascript:;"
                                        class="text-primary underline"
                                        @click="openPendingFile(docType)"
                                    >
                                        Visualizar documento selecionado
                                    </a>
                                    <span class="truncate text-sm text-white-dark">{{ pendingFiles[docType].name }}</span>
                                </template>
                                <template v-else>
                                    <span class="text-sm text-white-dark">Nenhum arquivo</span>
                                </template>
                            </div>
                            <p class="text-right text-sm text-white-dark/70">* arquivos aceitos: .pdf, .jpg, .png</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <button
                            type="button"
                            class="btn btn-primary"
                            :disabled="submittingDocuments || !allDocumentsUploaded"
                            @click="onSubmitDocuments"
                        >
                            {{ submittingDocuments ? 'Enviando...' : 'Enviar documentos' }}
                        </button>
                        <p v-if="!allDocumentsUploaded" class="mt-2 text-sm text-white-dark">
                            Envie todos os 4 documentos obrigatórios para habilitar o envio.
                        </p>
                    </div>
                </template>

                <!-- Enviado e em análise (ou com algum rejeitado) -->
                <template v-else-if="documents_submitted_at && !can_transact">
                    <div class="mb-4 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-4 text-warning dark:border-warning/20 dark:bg-warning/10">
                        <icon-info-circle class="h-5 w-5 shrink-0" />
                        <p class="text-sm font-medium">
                            Documentos em análise. Você será notificado quando a análise for concluída. Documentos rejeitados podem ser reenviados abaixo.
                        </p>
                    </div>
                    <div class="grid gap-4">
                        <div
                            v-for="docType in DOCUMENT_TYPES"
                            :key="docType"
                            class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-input px-3 py-3 dark:border-white-dark/20"
                        >
                            <div class="flex flex-1 flex-col gap-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="text-sm font-medium dark:text-white-light">{{ DOCUMENT_LABELS[docType] }}</span>
                                    <template v-if="documents[docType]?.has_file && documents[docType]?.id">
                                        <a
                                            href="javascript:;"
                                            class="text-sm text-primary underline"
                                            @click="documents[docType]?.id && openDocument(documents[docType].id)"
                                        >
                                            Visualizar
                                        </a>
                                    </template>
                                </div>
                                <!-- Motivo da rejeição -->
                                <p
                                    v-if="documents[docType]?.status === 'rejected' && documents[docType]?.rejection_reason"
                                    class="text-xs text-danger"
                                >
                                    Motivo: {{ documents[docType].rejection_reason }}
                                </p>
                                <!-- Upload apenas para documento rejeitado -->
                                <div
                                    v-if="documents[docType]?.status === 'rejected'"
                                    class="mt-2 flex flex-wrap items-center gap-2"
                                >
                                    <label
                                        class="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
                                        :class="{ 'pointer-events-none opacity-60': uploadingType === docType }"
                                    >
                                        <icon-upload class="h-4 w-4 shrink-0 text-white" />
                                        <span class="text-white">{{ uploadingType === docType ? 'Enviando...' : 'Enviar novo arquivo' }}</span>
                                        <input
                                            type="file"
                                            class="hidden"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            :disabled="uploadingType === docType"
                                            @change="onRejectedDocFileChange(docType, $event)"
                                        />
                                    </label>
                                    <span class="text-xs text-white-dark">.pdf, .jpg ou .png (até 10MB)</span>
                                </div>
                            </div>
                            <span
                                v-if="documents[docType]?.status"
                                :class="[
                                    'badge shrink-0 text-xs',
                                    documents[docType].status === 'approved' ? 'badge-outline-success' : documents[docType].status === 'rejected' ? 'badge-outline-danger' : 'badge-outline-warning',
                                ]"
                            >
                                {{ DOCUMENT_STATUS_LABELS[documents[docType].status] ?? documents[docType].status }}
                            </span>
                        </div>
                    </div>
                </template>

                <!-- Todos aprovados -->
                <template v-else>
                    <div class="mb-4 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-4 text-success dark:border-success/20 dark:bg-success/10">
                        <icon-circle-check class="h-5 w-5 shrink-0" />
                        <p class="text-sm font-medium">
                            Todos os documentos foram aprovados. Sua conta está ativa para operar.
                        </p>
                    </div>
                    <div class="grid gap-4">
                        <div v-for="docType in DOCUMENT_TYPES" :key="docType" class="flex flex-wrap items-center justify-between gap-2 rounded-md border border-input px-3 dark:border-white-dark/20">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium dark:text-white-light">{{ DOCUMENT_LABELS[docType] }}</span>
                                <template v-if="documents[docType]?.has_file && documents[docType]?.id">
                                    <a
                                        href="javascript:;"
                                        class="text-sm text-primary underline"
                                        @click="documents[docType]?.id && openDocument(documents[docType].id)"
                                    >
                                        Visualizar
                                    </a>
                                </template>
                            </div>
                            <span class="badge badge-outline-success text-xs">Aprovado</span>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { CompanyAccount, Representative, DocumentInfo } from '~/composables/useMinhaConta';

    definePageMeta({ middleware: 'auth' });
    useHead({ title: 'Minha Conta' });

    const {
        getCompany,
        updateCompany,
        uploadDocument,
        openDocument,
        submitDocuments,
        DOCUMENT_TYPES,
        DOCUMENT_LABELS,
        DOCUMENT_STATUS_LABELS,
    } = useMinhaConta();

    const toast = useToast();
    const approvalStore = useAccountApprovalStore();

    const loading = ref(true);
    const saving = ref(false);
    const representative = ref<Representative>({
        name: '',
        email: '',
        cpf: null,
        rg: null,
        phone: null,
        created_at: null,
        address: null,
        city: null,
        zip_code: null,
    });

    const form = ref<CompanyAccount>({
        tax_id: null,
        legal_name: null,
        commercial_name: null,
        name_on_invoice: null,
        average_revenue: null,
        average_ticket: null,
        products_sold: null,
        website_instagram: null,
        contact_phone: null,
        sells_physical_products: false,
    });

    const documents = ref<Record<string, DocumentInfo>>({});
    const pendingFiles = ref<Record<string, File>>({});
    const documents_submitted_at = ref<string | null>(null);
    const can_transact = ref(false);
    const submittingDocuments = ref(false);
    const uploadingType = ref<string | null>(null);

    /** Cada tipo tem documento no backend OU arquivo selecionado (pendente). */
    const allDocumentsUploaded = computed(() => {
        return DOCUMENT_TYPES.every(
            (t) => (documents.value[t]?.has_file && documents.value[t]?.id) || pendingFiles.value[t],
        );
    });

    const initialForm = ref<string>('');

    /** Retorna só dígitos (para enviar ao backend). */
    function digitsOnly(val: string | number | null | undefined): string | null {
        if (val == null || val === '') return null;
        const s = String(val).replace(/\D/g, '');
        return s || null;
    }

    /** Formata CPF/CNPJ para exibição (ao carregar da API). */
    function formatTaxIdForDisplay(val: string | null | undefined): string | null {
        const d = digitsOnly(val);
        if (!d) return null;
        if (d.length <= 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    /** Formata telefone para exibição (ao carregar da API). */
    function formatPhoneForDisplay(val: string | null | undefined): string | null {
        const d = digitsOnly(val);
        if (!d) return null;
        if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    /** Formata CPF (11 dígitos) para exibição: ###.###.###-##. */
    function formatCpfForDisplay(val: string | null | undefined): string | null {
        const d = digitsOnly(val);
        if (!d || d.length !== 11) return val ?? null;
        return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    /** Formata RG para exibição: 8 dígitos XX.XXX.XXX, 9 dígitos XX.XXX.XXX-X. */
    function formatRgForDisplay(val: string | null | undefined): string | null {
        const d = digitsOnly(val);
        if (!d) return val ?? null;
        if (d.length === 8) return d.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
        if (d.length === 9) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
        return val ?? null;
    }

    function setFormFromData(account: CompanyAccount) {
        const rev = account.average_revenue;
        const tick = account.average_ticket;
        form.value = {
            tax_id: formatTaxIdForDisplay(account.tax_id) ?? account.tax_id ?? null,
            legal_name: account.legal_name ?? null,
            commercial_name: account.commercial_name ?? null,
            name_on_invoice: account.name_on_invoice ?? null,
            average_revenue: rev != null && String(rev).trim() !== '' ? Number(rev) : null,
            average_ticket: tick != null && String(tick).trim() !== '' ? Number(tick) : null,
            products_sold: account.products_sold ?? null,
            website_instagram: account.website_instagram ?? null,
            contact_phone: formatPhoneForDisplay(account.contact_phone) ?? account.contact_phone ?? null,
            sells_physical_products: account.sells_physical_products ?? false,
        };
        initialForm.value = JSON.stringify(form.value);
    }

    async function load() {
        loading.value = true;
        const result = await getCompany();
        loading.value = false;
        if (result.success && result.data) {
            const d = result.data;
            documents_submitted_at.value = d.documents_submitted_at ?? null;
            can_transact.value = d.can_transact ?? false;
            representative.value = d.representative;
            setFormFromData(d.account);
            documents.value = { ...d.documents };
            pendingFiles.value = {};
            await approvalStore.fetch();
        } else {
            toast.error(result.error || 'Erro ao carregar dados.');
        }
    }

    async function save() {
        saving.value = true;
        const payload = {
            ...form.value,
            tax_id: digitsOnly(form.value.tax_id),
            contact_phone: digitsOnly(form.value.contact_phone),
            average_revenue: form.value.average_revenue ?? null,
            average_ticket: form.value.average_ticket ?? null,
        };
        const result = await updateCompany(payload);
        saving.value = false;
        if (result.success) {
            toast.success('Dados salvos com sucesso.');
            initialForm.value = JSON.stringify(form.value);
        } else {
            toast.error(result.error || 'Erro ao salvar.');
        }
    }

    function parseMoney(val: string | number | null | undefined): number | null {
        if (val == null || val === '') return null;
        if (typeof val === 'number') return val;
        const s = String(val).replace(/\D/g, '');
        if (!s) return null;
        return parseInt(s, 10) / 100;
    }

    function onFileChange(type: string, event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        pendingFiles.value = { ...pendingFiles.value, [type]: file };
        input.value = '';
        toast.success('Arquivo selecionado. Clique em "Enviar documentos" para enviar à análise.');
    }

    async function onRejectedDocFileChange(type: string, event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        input.value = '';
        uploadingType.value = type;
        const result = await uploadDocument(type, file);
        uploadingType.value = null;
        if (result.success) {
            toast.success('Novo arquivo enviado. O documento voltará a ser analisado.');
            await load();
        } else {
            toast.error(result.error || 'Erro ao enviar arquivo.');
        }
    }

    function openPendingFile(type: string) {
        const file = pendingFiles.value[type];
        if (file) window.open(URL.createObjectURL(file), '_blank');
    }

    async function onSubmitDocuments() {
        if (!allDocumentsUploaded.value) return;
        submittingDocuments.value = true;
        let errorMessage: string | null = null;
        for (const docType of DOCUMENT_TYPES) {
            const file = pendingFiles.value[docType];
            if (file) {
                const result = await uploadDocument(docType, file);
                if (!result.success) {
                    errorMessage = result.error || 'Erro ao enviar documento.';
                    break;
                }
            }
        }
        if (errorMessage) {
            submittingDocuments.value = false;
            toast.error(errorMessage);
            return;
        }
        const result = await submitDocuments();
        submittingDocuments.value = false;
        if (result.success) {
            toast.success('Documentos enviados para análise.');
            await load();
            await approvalStore.fetch();
        } else {
            toast.error(result.error || 'Erro ao enviar documentos.');
        }
    }

    onMounted(() => load());
</script>
