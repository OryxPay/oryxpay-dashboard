<template>
    <div class="relative">
        <button
            type="button"
            class="btn"
            :class="buttonClass"
            @click="showMenu = !showMenu"
            :disabled="disabled"
        >
            <icon-download class="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {{ label }}
            <icon-caret-down class="h-4 w-4 ltr:ml-2 rtl:mr-2" />
        </button>

        <div
            v-if="showMenu"
            class="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-md bg-white shadow-lg dark:bg-[#1b2e4b]"
            @click.stop
        >
            <div class="py-1">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#0F172A]"
                    @click="handleExport('csv')"
                >
                    <icon-file class="mr-2 inline h-4 w-4" />
                    Exportar CSV
                </button>
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#0F172A]"
                    @click="handleExport('excel')"
                >
                    <icon-file class="mr-2 inline h-4 w-4" />
                    Exportar Excel
                </button>
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-[#0F172A]"
                    @click="handleExport('json')"
                >
                    <icon-file class="mr-2 inline h-4 w-4" />
                    Exportar JSON
                </button>
            </div>
        </div>

        <!-- Overlay para fechar o menu ao clicar fora -->
        <div
            v-if="showMenu"
            class="fixed inset-0 z-40"
            @click="showMenu = false"
        ></div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useExport, type ExportOptions } from '@/composables/useExport';

    interface Props {
        label?: string;
        buttonClass?: string;
        disabled?: boolean;
        filename?: string;
        columns: ExportOptions['columns'];
        data: ExportOptions['data'];
    }

    const props = withDefaults(defineProps<Props>(), {
        label: 'Exportar',
        buttonClass: 'btn-outline-primary',
        disabled: false,
        filename: 'export',
    });

    const emit = defineEmits<{
        export: [format: 'csv' | 'excel' | 'json'];
    }>();

    const { exportData, exportToExcel } = useExport();
    const showMenu = ref(false);

    const handleExport = (format: 'csv' | 'excel' | 'json') => {
        showMenu.value = false;
        
        const options: ExportOptions = {
            filename: props.filename,
            columns: props.columns,
            data: props.data,
            format,
        };

        if (format === 'excel') {
            // Para Excel, precisamos retornar os dados para o componente pai usar vue3-json-excel
            const excelConfig = exportToExcel(options);
            emit('export', format);
            // O componente pai precisará usar vue3-json-excel com esses dados
        } else {
            exportData(options);
            emit('export', format);
        }
    };
</script>
