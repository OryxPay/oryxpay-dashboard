<template>
    <div class="dataTable-bottom mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white-dark/10 pt-4">
        <div class="dataTable-info text-sm text-white-dark">
            Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }} registros
        </div>
        <nav v-if="totalPages > 1" class="dataTable-pagination">
            <ul class="dataTable-pagination-list inline-flex items-center space-x-1 rtl:space-x-reverse">
                <li class="pager">
                    <button
                        type="button"
                        :disabled="currentPage <= 1"
                        class="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                        @click="$emit('page-change', 1)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="h-4.5 w-4.5 rtl:rotate-180">
                            <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </li>
                <li class="pager">
                    <button
                        type="button"
                        :disabled="currentPage <= 1"
                        class="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                        @click="$emit('page-change', currentPage - 1)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="h-4.5 w-4.5 rtl:rotate-180">
                            <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </li>
                <li v-for="p in pageNumbers" :key="p" :class="{ active: p === currentPage }">
                    <button
                        type="button"
                        class="flex justify-center rounded px-3.5 py-2 font-semibold transition"
                        :class="p === currentPage ? 'bg-primary text-white dark:bg-primary dark:text-white-light' : 'bg-white-light text-dark hover:bg-primary hover:text-white dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary'"
                        @click="$emit('page-change', p)"
                    >
                        {{ p }}
                    </button>
                </li>
                <li class="pager">
                    <button
                        type="button"
                        :disabled="currentPage >= totalPages"
                        class="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                        @click="$emit('page-change', currentPage + 1)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="h-4.5 w-4.5 rtl:rotate-180">
                            <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </li>
                <li class="pager">
                    <button
                        type="button"
                        :disabled="currentPage >= totalPages"
                        class="flex justify-center rounded bg-white-light px-3.5 py-2 font-semibold text-dark transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#191e3a] dark:text-white-light dark:hover:bg-primary"
                        @click="$emit('page-change', totalPages)"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="h-4.5 w-4.5 rtl:rotate-180">
                            <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    const props = defineProps<{
        currentPage: number;
        totalPages: number;
        startItem: number;
        endItem: number;
        totalItems: number;
    }>();

    defineEmits<{
        (e: 'page-change', page: number): void;
    }>();

    const pageNumbers = computed(() => {
        if (props.totalPages <= 0) return [];
        const maxVisible = 3;
        let start = Math.max(1, props.currentPage - 1);
        let end = Math.min(props.totalPages, start + maxVisible - 1);
        start = Math.max(1, end - maxVisible + 1);

        const pages: number[] = [];
        for (let i = start; i <= end; i += 1) pages.push(i);
        return pages;
    });
</script>
