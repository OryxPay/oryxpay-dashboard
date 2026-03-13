<template>
    <div>
    <div class="panel rounded-xl border border-white-dark/10 bg-white p-6 dark:bg-[#1E293B] dark:border-[#334155] sm:p-8">
        <div class="mb-5" style="height: 43rem; min-height: 43rem;">
            <div class="flex h-full w-full flex-col">
                <!-- Wizard basic (template: linha de progresso + círculos com borda) -->
                <div class="mb-5 inline-block w-full">
                    <div class="relative z-[1]">
                        <!-- Linha de progresso (atrás dos círculos) -->
                        <div
                            class="bg-primary absolute top-[30px] m-auto h-1 -z-[1] transition-[width] ltr:left-0 rtl:right-0"
                            :class="{
                                'w-[15%]': activeStep === 1,
                                'w-[48%]': activeStep === 2,
                                'w-[81%]': activeStep === 3,
                            }"
                        />
                        <ul class="mb-5 grid grid-cols-3">
                            <li v-for="step in 3" :key="step" class="mx-auto flex flex-col items-center">
                                <button
                                    type="button"
                                    class="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1b2e4b] dark:bg-[#253b5c]"
                                    :class="activeStep === step ? '!border-primary !bg-primary text-white' : ''"
                                    :disabled="!canGoToStep(step)"
                                    @click="goToStep(step)"
                                >
                                    <svg v-if="step === 1" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" stroke="currentColor" stroke-width="1.5">
                                        <path opacity="0.5" d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z" />
                                        <path d="M12 15L12 18" stroke-linecap="round" />
                                    </svg>
                                    <svg v-else-if="step === 2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" stroke="currentColor" stroke-width="1.5">
                                        <circle cx="12" cy="6" r="4" />
                                        <path opacity="0.5" d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" />
                                    </svg>
                                    <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" stroke="currentColor" stroke-width="1.5">
                                        <circle opacity="0.5" cx="12" cy="12" r="10" />
                                        <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <span class="mt-2 block text-center text-sm" :class="{ 'text-primary font-medium': activeStep === step }">{{ stepLabels[step] }}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Conteúdo do passo: passos 1 e 2 no topo; passo 3 centralizado na vertical -->
                <div class="flex min-h-0 flex-1 flex-col" :class="{ 'justify-center': activeStep === 3 }">
                    <!-- Step 1: Dados da empresa -->
                    <div v-show="activeStep === 1">
                        <div class="mb-6">
                            <h2 class="text-xl font-bold dark:text-white-light">Complete seu cadastro!</h2>
                            <p class="mt-1 text-sm text-white-dark">
                                Para utilizar nossos serviços é necessário cadastrar uma empresa.
                            </p>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">CNPJ <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.company.tax_id"
                                    type="text"
                                    class="form-input"
                                    placeholder="Digite seu CNPJ"
                                    v-maska="{ mask: ['##.###.###/####-##'] }"
                                    maxlength="18"
                                />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Razão Social <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.company.legal_name"
                                    type="text"
                                    class="form-input"
                                    placeholder="Digite a razão social"
                                    maxlength="255"
                                />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Telefone de contato (empresa) <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.company.contact_phone"
                                    type="text"
                                    class="form-input"
                                    placeholder="(00) 00000-0000"
                                    v-maska="{ mask: ['(##) ####-####', '(##) #####-####'] }"
                                    maxlength="20"
                                />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Quais produtos serão comercializados pelo seu negócio? <span class="text-danger">*</span></label>
                                <textarea
                                    v-model="form.company.products_sold"
                                    class="form-input min-h-[80px]"
                                    placeholder="Ex: Roupas, Eletrônicos, E-Books, Cursos, etc..."
                                    maxlength="100"
                                    rows="3"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Representante legal -->
                    <div v-show="activeStep === 2">
                        <div class="mb-6">
                            <h2 class="text-xl font-bold dark:text-white-light">Representante legal</h2>
                            <p class="mt-1 text-sm text-white-dark">
                                Confirme ou preencha os dados do representante legal da empresa.
                            </p>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Nome completo <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.name"
                                    type="text"
                                    class="form-input"
                                    placeholder="Nome completo"
                                    maxlength="255"
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">CPF <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.cpf"
                                    type="text"
                                    class="form-input"
                                    placeholder="000.000.000-00"
                                    v-maska="{ mask: '###.###.###-##' }"
                                    maxlength="14"
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">RG</label>
                                <input
                                    v-model="form.representative.rg"
                                    type="text"
                                    class="form-input"
                                    placeholder="RG"
                                    maxlength="30"
                                />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Telefone <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.phone"
                                    type="text"
                                    class="form-input"
                                    placeholder="(00) 00000-0000"
                                    v-maska="{ mask: ['(##) ####-####', '(##) #####-####'] }"
                                    maxlength="20"
                                />
                            </div>
                            <div class="space-y-2 sm:col-span-2">
                                <label class="text-sm font-medium">Endereço <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.address"
                                    type="text"
                                    class="form-input"
                                    placeholder="Endereço completo"
                                    maxlength="255"
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Cidade <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.city"
                                    type="text"
                                    class="form-input"
                                    placeholder="Cidade"
                                    maxlength="100"
                                />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">CEP <span class="text-danger">*</span></label>
                                <input
                                    v-model="form.representative.zip_code"
                                    type="text"
                                    class="form-input"
                                    placeholder="00000-000"
                                    v-maska="{ mask: '#####-###' }"
                                    maxlength="20"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Documentos (mesmos da tela Minha Conta) -->
                    <div v-show="activeStep === 3">
                        <div class="mb-6">
                            <h2 class="text-xl font-bold dark:text-white-light">Documentos</h2>
                            <p class="mt-1 text-sm text-white-dark">
                                Envie todos os documentos abaixo. Todos são obrigatórios para concluir o cadastro.
                            </p>
                        </div>
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
                                        <a href="javascript:;" class="text-primary underline" @click="openDocumentById(docType)">
                                            Visualizar documento carregado
                                        </a>
                                        <span v-if="documents[docType]?.original_name" class="truncate text-sm text-white-dark">
                                            {{ documents[docType].original_name }}
                                        </span>
                                    </template>
                                    <template v-else-if="pendingFiles[docType]">
                                        <span class="truncate text-sm text-white-dark">{{ pendingFiles[docType].name }}</span>
                                    </template>
                                    <template v-else>
                                        <span class="text-sm text-white-dark">Nenhum arquivo</span>
                                    </template>
                                </div>
                                <p class="text-right text-sm text-white-dark/70">* arquivos aceitos: .pdf, .jpg, .png</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navegação: sempre no rodapé -->
                <div class="mt-auto flex shrink-0 justify-between pt-8">
                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        :disabled="activeStep === 1"
                        @click="activeStep--"
                    >
                        Voltar
                    </button>
                    <template v-if="activeStep < 3">
                        <button
                            type="button"
                            class="btn btn-primary"
                            :disabled="!canGoNext"
                            @click="goNext"
                        >
                            Próximo
                        </button>
                    </template>
                    <template v-else>
                        <button
                            type="button"
                            class="btn btn-primary"
                            :disabled="saving || submitted || !allDocumentsUploaded"
                            @click="!allDocumentsUploaded ? toast.warning('Envie todos os documentos obrigatórios.') : (showConfirmModal = true)"
                        >
                            {{ saving ? 'Salvando...' : submitted ? 'Redirecionando...' : 'Concluir e ir ao painel' }}
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal confirmação: Concluir e ir ao painel -->
    <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" @click.self="showConfirmModal = false">
        <div class="panel w-full max-w-md rounded-lg border border-white-dark/10 bg-white p-6 dark:border-[#334155] dark:bg-[#1E293B]">
            <div class="mb-4 flex items-center gap-2">
                <icon-circle-check class="h-8 w-8 shrink-0 text-primary" />
                <h3 class="text-lg font-semibold dark:text-white-light">Confirmar conclusão</h3>
            </div>
            <p class="mb-6 text-sm text-white-dark">
                Deseja concluir o cadastro e ir ao painel? Os documentos serão enviados à análise.
            </p>
            <div class="flex justify-end gap-2">
                <button type="button" class="btn btn-outline-primary" @click="showConfirmModal = false">
                    Cancelar
                </button>
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="saving || submitted"
                    @click="confirmAndFinish"
                >
                    {{ saving ? 'Salvando...' : submitted ? 'Redirecionando...' : 'Sim, ir ao painel' }}
                </button>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'onboarding',
    middleware: 'auth',
});

useHead({ title: 'Complete seu cadastro' });

const { $api } = useNuxtApp();
const authStore = useAuthStore();
const toast = useToast();
const {
    getCompany,
    uploadDocument,
    submitDocuments,
    openDocument,
    DOCUMENT_TYPES,
    DOCUMENT_LABELS,
} = useMinhaConta();

const activeStep = ref(1);
const showConfirmModal = ref(false);
const documents = ref<Record<string, { id?: number; original_name?: string | null; has_file: boolean }>>({});
const pendingFiles = ref<Record<string, File>>({});
const saving = ref(false);
const submitted = ref(false);

const stepLabels: Record<number, string> = {
    1: 'Dados da empresa',
    2: 'Representante legal',
    3: 'Documentos',
};

const form = ref({
    company: {
        tax_id: '',
        legal_name: '',
        commercial_name: '',
        name_on_invoice: '',
        average_revenue: null as number | null,
        average_ticket: null as number | null,
        products_sold: '',
        website_instagram: '',
        contact_phone: '',
        sells_physical_products: false,
    },
    representative: {
        name: '',
        cpf: '',
        rg: '',
        phone: '',
        address: '',
        city: '',
        zip_code: '',
    },
});

function digitsOnly(val: string | null | undefined): string | null {
    if (val == null || val === '') return null;
    return String(val).replace(/\D/g, '') || null;
}

/** Etapa 1: CNPJ (14 dígitos), Razão Social, Telefone empresa (10 ou 11 dígitos), Produtos comercializados */
const step1Valid = computed(() => {
    const taxId = digitsOnly(form.value.company.tax_id) ?? '';
    const phone = digitsOnly(form.value.company.contact_phone) ?? '';
    return (
        taxId.length === 14 &&
        form.value.company.legal_name?.trim().length > 0 &&
        (phone.length === 10 || phone.length === 11) &&
        form.value.company.products_sold?.trim().length > 0
    );
});

/** Etapa 2: Nome, CPF (11 dígitos), Telefone (10 ou 11), Endereço, Cidade, CEP (8 dígitos). RG opcional. */
const step2Valid = computed(() => {
    const cpf = digitsOnly(form.value.representative.cpf) ?? '';
    const phone = digitsOnly(form.value.representative.phone) ?? '';
    const zip = digitsOnly(form.value.representative.zip_code) ?? '';
    return (
        form.value.representative.name?.trim().length > 0 &&
        cpf.length === 11 &&
        (phone.length === 10 || phone.length === 11) &&
        form.value.representative.address?.trim().length > 0 &&
        form.value.representative.city?.trim().length > 0 &&
        zip.length === 8
    );
});

const canGoNext = computed(() => {
    if (activeStep.value === 1) return step1Valid.value;
    if (activeStep.value === 2) return step2Valid.value;
    return true;
});

function goNext() {
    if (!canGoNext.value) {
        toast.warning(activeStep.value === 1 ? 'Preencha todos os dados da empresa para continuar.' : 'Preencha todos os dados do representante legal para continuar.');
        return;
    }
    activeStep.value++;
}

/** Permite ir para o passo só se as etapas anteriores estiverem válidas (ou se for voltar). */
function canGoToStep(step: number): boolean {
    if (step === 1) return true;
    if (step === 2) return step1Valid.value;
    return step1Valid.value && step2Valid.value;
}

function goToStep(step: number) {
    if (!canGoToStep(step)) {
        toast.warning(step === 2 ? 'Preencha todos os dados da empresa antes.' : 'Preencha os dados da empresa e do representante antes.');
        return;
    }
    activeStep.value = step;
}

const allDocumentsUploaded = computed(() => {
    return DOCUMENT_TYPES.every(
        (docType) =>
            (documents.value[docType]?.has_file && documents.value[docType]?.id) || !!pendingFiles.value[docType],
    );
});

/** Carrega documentos da conta ao entrar no passo 3 */
async function loadDocuments() {
    const result = await getCompany();
    if (result.success && result.data?.documents) {
        documents.value = { ...result.data.documents };
    }
}

watch(activeStep, (step) => {
    if (step === 3) loadDocuments();
});

function openDocumentById(docType: string) {
    const id = documents.value[docType]?.id;
    if (id != null) openDocument(id);
}

function onFileChange(docType: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        pendingFiles.value[docType] = file;
        toast.success('Arquivo selecionado. Clique em "Concluir e ir ao painel" para enviar.');
    }
    input.value = '';
}

/** Modal confirmado: envia documentos pendentes, submete (se houver), completa onboarding e redireciona */
async function confirmAndFinish() {
    showConfirmModal.value = false;
    saving.value = true;
    try {
        for (const docType of DOCUMENT_TYPES) {
            const file = pendingFiles.value[docType];
            if (file) {
                const result = await uploadDocument(docType, file);
                if (!result.success) {
                    toast.error(result.error || 'Erro ao enviar documento.');
                    saving.value = false;
                    return;
                }
            }
        }
        const submitResult = await submitDocuments();
        if (!submitResult.success) {
            toast.warning(submitResult.error || 'Documentos não enviados. Você pode enviar depois em Minha Conta.');
        }
        await submitOnboarding();
    } catch (e: any) {
        toast.error(e?.data?.message || 'Erro. Tente novamente.');
    } finally {
        saving.value = false;
    }
}

onMounted(() => {
    const user = authStore.user;
    if (user) {
        form.value.representative.name = user.name || '';
        form.value.representative.cpf = user.cpf || '';
        form.value.representative.rg = (user as any).rg || '';
        form.value.representative.phone = (user as any).phone || '';
        form.value.representative.address = (user as any).address || '';
        form.value.representative.city = (user as any).city || '';
        form.value.representative.zip_code = (user as any).zip_code || '';
    }
});

async function submitOnboarding() {
    saving.value = true;
    try {
        const payload = {
            company: {
                tax_id: digitsOnly(form.value.company.tax_id) ?? form.value.company.tax_id?.replace(/\D/g, '') ?? null,
                legal_name: form.value.company.legal_name || null,
                commercial_name: form.value.company.commercial_name || null,
                name_on_invoice: form.value.company.name_on_invoice || null,
                average_revenue: null,
                average_ticket: null,
                products_sold: form.value.company.products_sold || null,
                website_instagram: form.value.company.website_instagram || null,
                contact_phone: digitsOnly(form.value.company.contact_phone) ?? form.value.company.contact_phone?.replace(/\D/g, '') ?? null,
                sells_physical_products: form.value.company.sells_physical_products,
            },
            representative: {
                name: form.value.representative.name,
                cpf: digitsOnly(form.value.representative.cpf) ?? null,
                rg: form.value.representative.rg || null,
                phone: digitsOnly(form.value.representative.phone) ?? null,
                address: form.value.representative.address || null,
                city: form.value.representative.city || null,
                zip_code: digitsOnly(form.value.representative.zip_code) ?? null,
            },
        };
        await $api('/account/complete-onboarding', { method: 'POST', body: payload });
        submitted.value = true;
        toast.success('Cadastro inicial concluído.');
        await authStore.me();
        await navigateTo('/');
    } catch (e: any) {
        toast.error(e?.data?.message || 'Erro ao salvar. Tente novamente.');
    } finally {
        saving.value = false;
    }
}
</script>
