<template>
    <div>
        <div class="mb-5">
            <h5 class="text-lg font-semibold dark:text-white-light">Informações sobre taxas</h5>
            <p class="text-white-dark">Veja um resumo completo das taxas aplicadas.</p>
        </div>

        <div v-if="loading" class="panel py-12 text-center text-white-dark">
            Carregando...
        </div>
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="panel flex flex-col border border-secondary/30 bg-secondary/5 dark:border-secondary/20 dark:bg-secondary/10">
                <div class="mb-3 flex items-center justify-between">
                    <span class="font-semibold dark:text-white-light">PIX</span>
                    <icon-qrcode class="h-8 w-8 text-secondary/70" />
                </div>
                <p class="text-2xl font-bold dark:text-white-light">
                    {{ formatFeePix(costs?.mdr_pix, costs?.mdr_pix_monetary) }}
                </p>
                <p class="mt-1 text-sm text-white-dark">Taxa por transação PIX</p>
            </div>
            <div class="panel flex flex-col border border-secondary/30 bg-secondary/5 dark:border-secondary/20 dark:bg-secondary/10">
                <div class="mb-3 flex items-center justify-between">
                    <span class="font-semibold dark:text-white-light">Boleto</span>
                    <icon-receipt class="h-8 w-8 text-secondary/70" />
                </div>
                <p class="text-2xl font-bold dark:text-white-light">
                    {{ formatFee(costs?.mdr_billet, costs?.mdr_billet_monetary) }}
                </p>
                <p class="mt-1 text-sm text-white-dark">Taxa por boleto</p>
            </div>
            <div class="panel flex flex-col border border-secondary/30 bg-secondary/5 dark:border-secondary/20 dark:bg-secondary/10">
                <div class="mb-3 flex items-center justify-between">
                    <span class="font-semibold dark:text-white-light">Cartão de crédito</span>
                    <icon-credit-card class="h-8 w-8 text-secondary/70" />
                </div>
                <p class="text-2xl font-bold dark:text-white-light">
                    {{ formatFee(costs?.mdr_creditcard ?? costs?.mdr_card1x, costs?.mdr_creditcard_monetary) }}
                </p>
                <p class="mt-1 text-sm text-white-dark">Taxa por transação em cartão</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue';

    const { $api } = useNuxtApp();

    const loading = ref(true);
    const costs = ref<{
        mdr_pix?: number;
        mdr_billet?: number;
        mdr_creditcard?: number;
        mdr_card1x?: number;
        mdr_pix_monetary?: number;
        mdr_billet_monetary?: number;
        mdr_creditcard_monetary?: number;
    } | null>(null);

    /** monetary vem em centavos da API. Taxas sempre visíveis nesta tela. */
    function formatFee(percent: number | null | undefined, monetaryCents: number | string | null | undefined): string {
        const p = percent != null ? Number(percent) : 0;
        const mReais = (monetaryCents != null ? Number(monetaryCents) : 0) / 100;
        const percentStr = p.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        const monetaryStr = mReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
        if (mReais > 0) return `${percentStr} + ${monetaryStr}`;
        return percentStr;
    }

    /** PIX: percentual + valor monetário. monetary em centavos. */
    function formatFeePix(percent: number | null | undefined, monetaryCents: number | string | null | undefined): string {
        const p = percent != null ? Number(percent) : 0;
        const mReais = (monetaryCents != null ? Number(monetaryCents) : 0) / 100;
        const percentStr = p.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        const monetaryStr = mReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
        return `${percentStr} + ${monetaryStr}`;
    }

    onMounted(async () => {
        try {
            const response = await $api<{ success: boolean; data: typeof costs.value }>('/account/costs', { method: 'GET' });
            if (response.success && response.data) costs.value = response.data;
        } finally {
            loading.value = false;
        }
    });

    useHead({ title: 'Taxas' });
    definePageMeta({ middleware: 'auth' });
</script>
