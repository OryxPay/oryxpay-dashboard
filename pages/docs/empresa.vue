<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Conta</h1>
        <p class="text-slate-400 mb-8">
            Retorna os dados da conta associada à chave de API. Não expõe dados sensíveis da empresa.
        </p>

        <DocTryItSimple
            method="GET"
            path="/account"
            description="Dados da conta (nome, CNPJ/CPF, nome comercial, telefone, status)."
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});
</script>
