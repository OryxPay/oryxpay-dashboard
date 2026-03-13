<template>
    <div class="main-section relative min-h-screen font-nunito text-sm font-normal antialiased text-black dark:text-white-dark">
        <div class="flex min-h-screen items-center justify-center bg-[#0F172A] px-4 py-10">
            <div class="w-full max-w-2xl">
                <div class="mb-8 text-center">
                    <img src="/assets/images/logo-dark.webp" alt="OryxPay" class="mx-auto h-10 w-auto" />
                </div>
                <ClientOnly>
                    <NuxtPage />
                    <template #fallback>
                        <div class="panel rounded-xl border border-white/10 bg-white/5 p-8 animate-pulse">
                            <div class="mb-6 h-6 w-48 rounded bg-white/10" />
                            <div class="h-64 rounded bg-white/10" />
                        </div>
                    </template>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
