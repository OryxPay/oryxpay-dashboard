/**
 * Composable para persistir a API key da documentação entre páginas.
 * Usa localStorage para manter a chave salva no navegador.
 */
const STORAGE_KEY = 'docs_api_key';

// Estado global reativo (singleton)
const apiKey = ref('');
let initialized = false;

export function useDocsApiKey() {
    // Inicializa apenas uma vez (client-side)
    if (!initialized && import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            apiKey.value = stored;
        }
        initialized = true;
    }

    // Watcher para salvar no localStorage sempre que mudar
    watch(apiKey, (newValue) => {
        if (import.meta.client) {
            if (newValue) {
                localStorage.setItem(STORAGE_KEY, newValue);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    });

    return {
        apiKey,
    };
}
