<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Transações</h1>
        <p class="text-slate-400 mb-8">
            Crie vendas (cartão, PIX, boleto), consulte transações e realize estornos.
        </p>

        <!-- Bloco interativo: preencher campos e executar -->
        <DocTryIt
            path="/transactions"
            description="Cria uma nova transação. Preencha os parâmetros abaixo, informe sua chave de API e clique em Executar. Suporta cartão de crédito, PIX e boleto. Valores em centavos."
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Listar transações</h2>
        <DocTryItSimple
            method="GET"
            path="/transactions"
            description="Lista transações com filtros e paginação."
            :query-params="[
                { key: 'page', label: 'page', type: 'number', description: 'Página (default 1).' },
                { key: 'per_page', label: 'per_page', type: 'number', description: 'Itens por página.' },
                { key: 'status', label: 'status', description: 'Filtrar por status.' },
            ]"
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Buscar transação</h2>
        <DocTryItSimple
            method="GET"
            path="/transactions/{txId}"
            description="Retorna os detalhes de uma transação pelo ID."
            :path-params="[{ key: 'txId', label: 'ID da transação', description: 'ULID retornado na criação (ex: 01HZXK3NDEKTSV4RRFFQ69G5FA).' }]"
        />

        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Estornar transação</h2>
        <DocTryItSimple
            method="POST"
            path="/transactions/{txId}/refund"
            description="Estorna total ou parcialmente uma transação. Apenas transações pagas podem ser estornadas. O valor será debitado do seu saldo."
            :path-params="[{ key: 'txId', label: 'ID da transação', description: 'ULID da transação.' }]"
            :body-params="[
                { key: 'amount', label: 'amount', type: 'number', description: 'Valor em centavos a estornar (opcional; omita para estorno total).' },
                { key: 'reason', label: 'reason', type: 'string', description: 'Motivo do estorno (opcional, máx. 500 caracteres).' }
            ]"
        />

        <!-- Notas sobre estorno -->
        <div class="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
            <h3 class="font-medium text-amber-400 mb-2">Importante sobre estornos</h3>
            <ul class="space-y-2 text-sm text-slate-400">
                <li class="flex items-start gap-2">
                    <span class="text-amber-400">•</span>
                    Apenas transações com status <code class="text-amber-200 bg-slate-800 px-1 rounded">paid</code> podem ser estornadas.
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-amber-400">•</span>
                    O valor é debitado do seu saldo disponível. Certifique-se de ter saldo suficiente.
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-amber-400">•</span>
                    Após processado, um webhook <code class="text-amber-200 bg-slate-800 px-1 rounded">EVENT:CHARGE_REFUND</code> será disparado.
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-amber-400">•</span>
                    O estorno é irreversível após confirmado.
                </li>
            </ul>
        </div>

        <!-- Status de Transações -->
        <h2 class="text-lg font-semibold text-slate-200 mt-12 mb-4">Status de Transações</h2>
        <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="w-full text-sm">
                <thead class="bg-slate-800/50">
                    <tr>
                        <th class="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                        <th class="text-left px-4 py-3 text-slate-400 font-medium">Descrição</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800">
                    <tr>
                        <td class="px-4 py-3"><code class="text-amber-400 bg-slate-800 px-2 py-0.5 rounded text-xs">pending</code></td>
                        <td class="px-4 py-3 text-slate-400">Aguardando pagamento</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-amber-400 bg-slate-800 px-2 py-0.5 rounded text-xs">processing</code></td>
                        <td class="px-4 py-3 text-slate-400">Pagamento em processamento</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-amber-400 bg-slate-800 px-2 py-0.5 rounded text-xs">antifraud</code></td>
                        <td class="px-4 py-3 text-slate-400">Em análise antifraude</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-emerald-400 bg-slate-800 px-2 py-0.5 rounded text-xs">paid</code></td>
                        <td class="px-4 py-3 text-slate-400">Pagamento confirmado</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">failed</code></td>
                        <td class="px-4 py-3 text-slate-400">Pagamento falhou</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">refused</code></td>
                        <td class="px-4 py-3 text-slate-400">Pagamento recusado pelo emissor</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">expired</code></td>
                        <td class="px-4 py-3 text-slate-400">Cobrança expirada sem pagamento</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs">cancelled</code></td>
                        <td class="px-4 py-3 text-slate-400">Transação cancelada</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-blue-400 bg-slate-800 px-2 py-0.5 rounded text-xs">refunded</code></td>
                        <td class="px-4 py-3 text-slate-400">Pagamento estornado</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-orange-400 bg-slate-800 px-2 py-0.5 rounded text-xs">in_dispute</code></td>
                        <td class="px-4 py-3 text-slate-400">Em disputa/contestação</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-orange-400 bg-slate-800 px-2 py-0.5 rounded text-xs">pre_chargeback</code></td>
                        <td class="px-4 py-3 text-slate-400">Pré-chargeback (início da contestação de cartão)</td>
                    </tr>
                    <tr>
                        <td class="px-4 py-3"><code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">chargeback</code></td>
                        <td class="px-4 py-3 text-slate-400">Chargeback confirmado pela operadora</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});

</script>
