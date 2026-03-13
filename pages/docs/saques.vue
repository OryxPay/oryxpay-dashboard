<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Saques</h1>
        <p class="text-slate-400 mb-8">
            Crie saques para contas bancárias (PIX) cadastradas no dashboard e consulte ou cancele solicitações.
        </p>

        <h2 class="text-lg font-semibold text-slate-200 mb-4">Criar saque</h2>
        <DocTryItSimple
            method="POST"
            path="/withdraws"
            description="Cria um novo saque. O valor deve ser em centavos. A conta bancária de destino deve estar cadastrada."
            :body-params="[
                { key: 'amount', label: 'amount', type: 'number', required: true, description: 'Valor em centavos (ex: 5000 = R$ 50,00).', placeholder: '5000' },
                { key: 'account_bank_account_id', label: 'account_bank_account_id', type: 'number', required: true, description: 'ID da conta bancária (PIX) de destino.', placeholder: '1' },
            ]"
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Listar saques</h2>
        <DocTryItSimple
            method="GET"
            path="/withdraws"
            description="Lista saques com paginação."
            :query-params="[
                { key: 'page', label: 'page', type: 'number', description: 'Página.' },
                { key: 'per_page', label: 'per_page', type: 'number', description: 'Itens por página.' },
            ]"
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Buscar saque</h2>
        <DocTryItSimple
            method="GET"
            path="/withdraws/{id}"
            description="Retorna os detalhes de um saque pelo ID."
            :path-params="[{ key: 'id', label: 'ID do saque' }]"
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Cancelar saque</h2>
        <DocTryItSimple
            method="POST"
            path="/withdraws/{id}/cancel"
            description="Cancela um saque pendente."
            :path-params="[{ key: 'id', label: 'ID do saque' }]"
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});
</script>
