export interface ExportColumn {
    key: string;
    label: string;
    format?: (value: any) => string;
}

export interface ExportOptions {
    filename?: string;
    columns: ExportColumn[];
    data: any[];
    format?: 'csv' | 'excel' | 'json';
}

export const useExport = () => {
    /**
     * Exporta dados para CSV
     */
    const exportToCSV = (options: ExportOptions) => {
        const { filename = 'export', columns, data } = options;
        
        // Cabeçalho
        const headers = columns.map((col) => col.label).join(';');
        
        // Linhas de dados
        const rows = data.map((item) => {
            return columns
                .map((col) => {
                    let value = item[col.key] ?? '';
                    if (col.format) {
                        value = col.format(value);
                    }
                    // Escapar valores que contêm ponto e vírgula ou aspas
                    if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(';');
        });
        
        const csvContent = [headers, ...rows].join('\n');
        
        // Criar blob e fazer download
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Exporta dados para Excel usando vue3-json-excel
     */
    const exportToExcel = (options: ExportOptions) => {
        const { filename = 'export', columns, data } = options;
        
        // Criar mapeamento de colunas para o vue3-json-excel
        const fields: Record<string, string> = {};
        columns.forEach((col) => {
            fields[col.label] = col.key;
        });
        
        // Processar dados com formatação se necessário
        const processedData = data.map((item) => {
            const processed: any = {};
            columns.forEach((col) => {
                let value = item[col.key] ?? '';
                if (col.format) {
                    value = col.format(value);
                }
                processed[col.key] = value;
            });
            return processed;
        });
        
        // Retornar configuração para vue3-json-excel
        return {
            filename: `${filename}.xls`,
            fields,
            data: processedData,
        };
    };

    /**
     * Exporta dados para JSON
     */
    const exportToJSON = (options: ExportOptions) => {
        const { filename = 'export', columns, data } = options;
        
        // Processar dados com formatação se necessário
        const processedData = data.map((item) => {
            const processed: any = {};
            columns.forEach((col) => {
                let value = item[col.key] ?? '';
                if (col.format) {
                    value = col.format(value);
                }
                processed[col.label] = value;
            });
            return processed;
        });
        
        const jsonContent = JSON.stringify(processedData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Exporta dados no formato especificado
     */
    const exportData = (options: ExportOptions) => {
        const format = options.format || 'csv';
        
        switch (format) {
            case 'csv':
                exportToCSV(options);
                break;
            case 'excel':
                return exportToExcel(options);
            case 'json':
                exportToJSON(options);
                break;
            default:
                exportToCSV(options);
        }
    };

    /**
     * Formatação auxiliar para moeda brasileira
     */
    const formatCurrency = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    /**
     * Formatação auxiliar para data brasileira
     */
    const formatDate = (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('pt-BR');
    };

    /**
     * Formatação auxiliar para data e hora brasileira
     */
    const formatDateTime = (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleString('pt-BR');
    };

    return {
        exportData,
        exportToCSV,
        exportToExcel,
        exportToJSON,
        formatCurrency,
        formatDate,
        formatDateTime,
    };
};
