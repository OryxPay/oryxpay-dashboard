# Sistema de Exportação de Dados

Este sistema fornece uma solução reutilizável para exportar dados em diferentes formatos (CSV, Excel, JSON).

## Componentes

### `useExport` Composable

Composable principal que fornece funções para exportação de dados.

**Localização:** `@/composables/useExport.ts`

**Uso:**

```typescript
import { useExport } from '@/composables/useExport';

const { exportData, formatCurrency, formatDate } = useExport();

// Exportar dados
exportData({
    filename: 'meus-dados',
    columns: [
        { key: 'nome', label: 'Nome' },
        { key: 'valor', label: 'Valor', format: formatCurrency },
        { key: 'data', label: 'Data', format: formatDate },
    ],
    data: [
        { nome: 'Item 1', valor: 100.50, data: '2024-01-01' },
        { nome: 'Item 2', valor: 200.75, data: '2024-01-02' },
    ],
    format: 'csv', // ou 'excel' ou 'json'
});
```

**Funções disponíveis:**
- `exportData(options)` - Exporta dados no formato especificado
- `exportToCSV(options)` - Exporta para CSV
- `exportToExcel(options)` - Retorna configuração para vue3-json-excel
- `exportToJSON(options)` - Exporta para JSON
- `formatCurrency(value)` - Formata valor como moeda brasileira
- `formatDate(date)` - Formata data no formato brasileiro
- `formatDateTime(date)` - Formata data e hora no formato brasileiro

### `ExportButton` Component

Componente reutilizável de botão de exportação com menu dropdown.

**Localização:** `@/components/common/ExportButton.vue`

**Uso:**

```vue
<template>
    <ExportButton
        label="Exportar Dados"
        filename="meus-dados"
        :columns="exportColumns"
        :data="exportDataArray"
        @export="handleExport"
    />
</template>

<script setup>
import ExportButton from '@/components/common/ExportButton.vue';

const exportColumns = [
    { key: 'nome', label: 'Nome' },
    { key: 'valor', label: 'Valor' },
];

const exportDataArray = [
    { nome: 'Item 1', valor: 100 },
    { nome: 'Item 2', valor: 200 },
];

const handleExport = (format) => {
    console.log('Exportando como:', format);
};
</script>
```

## Exemplo Completo

```vue
<template>
    <div>
        <button @click="exportarDados">Exportar</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useExport } from '@/composables/useExport';

const { exportData, formatCurrency, formatDate } = useExport();

const dados = [
    { nome: 'Produto A', preco: 100.50, data: '2024-01-01' },
    { nome: 'Produto B', preco: 200.75, data: '2024-01-02' },
];

const colunas = [
    { key: 'nome', label: 'Nome do Produto' },
    { key: 'preco', label: 'Preço', format: formatCurrency },
    { key: 'data', label: 'Data', format: formatDate },
];

const exportarDados = () => {
    exportData({
        filename: 'produtos',
        columns: colunas,
        data: dados,
        format: 'csv',
    });
};
</script>
```

## Formatos Suportados

- **CSV**: Formato de texto separado por ponto e vírgula, compatível com Excel
- **Excel**: Usa a biblioteca `vue3-json-excel` para gerar arquivos .xls
- **JSON**: Exporta dados em formato JSON estruturado

## Notas

- O formato CSV usa ponto e vírgula (`;`) como delimitador, compatível com Excel brasileiro
- Valores são automaticamente escapados se contiverem caracteres especiais
- O CSV inclui BOM UTF-8 para garantir compatibilidade com Excel
- Para Excel, é necessário usar o componente `vue3-json-excel` diretamente no template
