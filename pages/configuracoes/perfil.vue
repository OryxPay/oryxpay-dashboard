<template>
    <div class="grid min-h-[200px] place-content-center">
        <span class="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-primary !border-l-transparent"></span>
    </div>
</template>

<script lang="ts" setup>
    onMounted(() => navigateTo('/configuracoes/minha-conta', { replace: true }));
    useHead({ title: 'Minha Conta' });
    definePageMeta({ middleware: 'auth' });
</script>
