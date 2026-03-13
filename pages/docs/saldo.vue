<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Saldo</h1>
        <p class="text-slate-400 mb-8">
            Consulte o saldo disponível da conta associada à sua chave de API. O valor é retornado em centavos.
        </p>

        <DocTryItSimple
            method="GET"
            path="/balance"
            description="Retorna o saldo atual (disponível e bloqueado, se houver) em centavos."
        />
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});
</script>
