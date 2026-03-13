<template>
    <div>
        <h1 class="text-2xl font-bold text-white mb-2">Webhooks (Postbacks)</h1>
        <p class="text-slate-400 mb-8">
            Receba notificações em tempo real quando eventos importantes acontecerem na sua conta.
            Configure URLs para receber os postbacks automaticamente.
        </p>

        <!-- Introdução -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Como funcionam os Webhooks?</h2>
            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
                <p class="text-slate-400 text-sm">
                    Webhooks (também chamados de postbacks) são notificações HTTP enviadas automaticamente para uma URL da sua escolha
                    quando eventos específicos acontecem. Por exemplo, quando um pagamento é confirmado, enviamos uma requisição POST
                    para a URL configurada com os dados da transação.
                </p>
                <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                        <span class="text-slate-300">Cliente paga</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                        <span class="text-slate-300">Processamos o pagamento</span>
                    </div>
                    <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</span>
                        <span class="text-slate-300">Enviamos webhook para sua URL</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Eventos Disponíveis -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Eventos Disponíveis</h2>
            <div class="overflow-x-auto rounded-xl border border-slate-800">
                <table class="w-full text-sm">
                    <thead class="bg-slate-800/50">
                        <tr>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Evento</th>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Descrição</th>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Quando é disparado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-emerald-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_PAID</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Cobrança Paga</td>
                            <td class="px-4 py-3 text-slate-400">Quando um pagamento (PIX, Boleto ou Cartão) é confirmado</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-amber-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_EXPIRED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Cobrança Expirada</td>
                            <td class="px-4 py-3 text-slate-400">Quando uma cobrança expira sem pagamento</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_REFUND</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Cobrança Estornada</td>
                            <td class="px-4 py-3 text-slate-400">Quando um pagamento é estornado (total ou parcialmente)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_CHARGEBACK</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Chargeback</td>
                            <td class="px-4 py-3 text-slate-400">Quando um chargeback é confirmado pela operadora do cartão</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-orange-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_PRE_CHARGEBACK</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Pré-Chargeback</td>
                            <td class="px-4 py-3 text-slate-400">Quando é iniciado um processo de contestação (ainda não confirmado)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-orange-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_IN_DISPUTE</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Em Disputa</td>
                            <td class="px-4 py-3 text-slate-400">Quando uma transação entra em disputa/contestação</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:CHARGE_STATUS_CHANGED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">Status Alterado</td>
                            <td class="px-4 py-3 text-slate-400">Quando o status de uma transação é alterado (genérico)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-blue-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:MED_CREATED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">MED Criado</td>
                            <td class="px-4 py-3 text-slate-400">Quando uma contestação (MED) é aberta</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-emerald-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:MED_REJECTED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">MED Rejeitado</td>
                            <td class="px-4 py-3 text-slate-400">Contestação rejeitada (favorável à empresa)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-red-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:MED_ACCEPTED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">MED Aceito</td>
                            <td class="px-4 py-3 text-slate-400">Contestação aceita (favorável ao cliente)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3">
                                <code class="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-xs">EVENT:MED_CANCELLED</code>
                            </td>
                            <td class="px-4 py-3 text-slate-300">MED Cancelado</td>
                            <td class="px-4 py-3 text-slate-400">Contestação cancelada pelo cliente</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Formato do Payload -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Formato do Payload</h2>
            <p class="text-slate-400 text-sm mb-4">
                Todas as notificações são enviadas via <code class="text-amber-200 bg-slate-800 px-1.5 py-0.5 rounded">POST</code>
                com o corpo em JSON. O header <code class="text-amber-200 bg-slate-800 px-1.5 py-0.5 rounded">Content-Type: application/json</code> é enviado.
            </p>

            <h3 class="text-md font-medium text-slate-300 mb-3">Headers enviados</h3>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden mb-6">
                <div class="px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">Headers</span>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>Content-Type: application/json
X-Webhook-Event: EVENT:CHARGE_PAID
User-Agent: OryxPay-Webhook/1.0</code></pre>
            </div>

            <h3 class="text-md font-medium text-slate-300 mb-3">Exemplo de payload - Cobrança Paga (EVENT:CHARGE_PAID)</h3>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden mb-6">
                <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">JSON</span>
                    <button
                        type="button"
                        class="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                        @click="copyPayloadPaid"
                    >
                        Copiar
                    </button>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ payloadPaidExample }}</code></pre>
            </div>

            <h3 class="text-md font-medium text-slate-300 mb-3">Exemplo de payload - Cobrança Expirada (EVENT:CHARGE_EXPIRED)</h3>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden mb-6">
                <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">JSON</span>
                    <button
                        type="button"
                        class="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                        @click="copyPayloadExpired"
                    >
                        Copiar
                    </button>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ payloadExpiredExample }}</code></pre>
            </div>

            <h3 class="text-md font-medium text-slate-300 mb-3">Exemplo de payload - Estorno (EVENT:CHARGE_REFUND)</h3>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">JSON</span>
                    <button
                        type="button"
                        class="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                        @click="copyPayloadRefund"
                    >
                        Copiar
                    </button>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ payloadRefundExample }}</code></pre>
            </div>
        </section>

        <!-- Campos do Payload -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Campos do Payload</h2>
            <div class="overflow-x-auto rounded-xl border border-slate-800">
                <table class="w-full text-sm">
                    <thead class="bg-slate-800/50">
                        <tr>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Campo</th>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Tipo</th>
                            <th class="text-left px-4 py-3 text-slate-400 font-medium">Descrição</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800">
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">event</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">Tipo do evento (ex: EVENT:CHARGE_PAID)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.id</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">ID único da transação (ULID)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.status</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">Status atual: pending, processing, paid, failed, refused, refunded, cancelled, expired, chargeback, pre_chargeback, in_dispute, antifraud</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.amount</code></td>
                            <td class="px-4 py-3 text-slate-400">integer</td>
                            <td class="px-4 py-3 text-slate-400">Valor em centavos (ex: 1000 = R$ 10,00)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.payment_method</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">Método: pix, boleto ou card</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.customer</code></td>
                            <td class="px-4 py-3 text-slate-400">object</td>
                            <td class="px-4 py-3 text-slate-400">Dados do cliente (name, email, document, phone)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.paid_at</code></td>
                            <td class="px-4 py-3 text-slate-400">string|null</td>
                            <td class="px-4 py-3 text-slate-400">Data/hora do pagamento (ISO 8601)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.created_at</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">Data/hora de criação (ISO 8601)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.refund_amount</code></td>
                            <td class="px-4 py-3 text-slate-400">integer|null</td>
                            <td class="px-4 py-3 text-slate-400">Valor do reembolso em centavos (apenas em EVENT:CHARGE_REFUND)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.refund_reason</code></td>
                            <td class="px-4 py-3 text-slate-400">string|null</td>
                            <td class="px-4 py-3 text-slate-400">Motivo do reembolso (apenas em EVENT:CHARGE_REFUND)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">transaction.refunded_at</code></td>
                            <td class="px-4 py-3 text-slate-400">string|null</td>
                            <td class="px-4 py-3 text-slate-400">Data/hora do reembolso (apenas em EVENT:CHARGE_REFUND)</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-3"><code class="text-slate-300">sent_at</code></td>
                            <td class="px-4 py-3 text-slate-400">string</td>
                            <td class="px-4 py-3 text-slate-400">Data/hora do envio do webhook (ISO 8601)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Resposta Esperada -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Resposta Esperada</h2>
            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
                <p class="text-slate-400 text-sm">
                    Sua aplicação deve retornar um status HTTP <code class="text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded">2xx</code>
                    (200, 201, 202, etc.) para indicar que recebeu a notificação com sucesso. Qualquer outro status será considerado falha.
                </p>
                <div class="grid sm:grid-cols-2 gap-4">
                    <div class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span class="font-medium text-emerald-400">Sucesso</span>
                        </div>
                        <p class="text-sm text-slate-400">HTTP 200, 201, 202, 204</p>
                        <p class="text-xs text-slate-500 mt-1">O corpo da resposta é ignorado.</p>
                    </div>
                    <div class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <div class="flex items-center gap-2 mb-2">
                            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span class="font-medium text-red-400">Falha</span>
                        </div>
                        <p class="text-sm text-slate-400">HTTP 4xx, 5xx ou timeout</p>
                        <p class="text-xs text-slate-500 mt-1">Tentaremos novamente até 3 vezes.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Retentativas -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Política de Retentativas</h2>
            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <ul class="space-y-3 text-sm text-slate-400">
                    <li class="flex items-start gap-2">
                        <span class="text-primary">•</span>
                        Em caso de falha, fazemos até <strong class="text-slate-300">3 tentativas</strong> de envio.
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-primary">•</span>
                        O intervalo entre tentativas usa <strong class="text-slate-300">backoff exponencial</strong> (30s, 60s, 120s).
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-primary">•</span>
                        Timeout de conexão: <strong class="text-slate-300">30 segundos</strong>.
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="text-primary">•</span>
                        Você pode verificar o histórico de envios na aba <NuxtLink to="/integracao/webhooks" class="text-primary hover:underline">Webhooks > Logs</NuxtLink> do painel.
                    </li>
                </ul>
            </div>
        </section>

        <!-- Boas Práticas -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Boas Práticas</h2>
            <div class="grid sm:grid-cols-2 gap-4">
                <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <h3 class="font-medium text-slate-200 mb-2 flex items-center gap-2">
                        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Valide a origem
                    </h3>
                    <p class="text-sm text-slate-400">
                        Verifique se a requisição vem dos nossos IPs ou valide usando o header <code class="bg-slate-800 px-1 rounded">X-Webhook-Event</code>.
                    </p>
                </div>
                <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <h3 class="font-medium text-slate-200 mb-2 flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        Idempotência
                    </h3>
                    <p class="text-sm text-slate-400">
                        Use o <code class="bg-slate-800 px-1 rounded">transaction.id</code> para evitar processar o mesmo evento duas vezes.
                    </p>
                </div>
                <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <h3 class="font-medium text-slate-200 mb-2 flex items-center gap-2">
                        <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Responda rápido
                    </h3>
                    <p class="text-sm text-slate-400">
                        Retorne HTTP 200 imediatamente e processe os dados em background (fila) se necessário.
                    </p>
                </div>
                <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <h3 class="font-medium text-slate-200 mb-2 flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Use HTTPS
                    </h3>
                    <p class="text-sm text-slate-400">
                        Sempre configure URLs com HTTPS para garantir que os dados sejam transmitidos de forma segura.
                    </p>
                </div>
            </div>
        </section>

        <!-- Como Configurar -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Como Configurar</h2>
            <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <ol class="space-y-4 text-sm text-slate-400">
                    <li class="flex items-start gap-3">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                        <span>Acesse o painel e vá em <NuxtLink to="/integracao/webhooks" class="text-primary hover:underline">Integração > Webhooks</NuxtLink>.</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                        <span>Clique em <strong class="text-slate-300">"Criar webhook"</strong>.</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                        <span>Preencha o nome, URL de destino e selecione o evento desejado.</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</span>
                        <span>Ative o webhook e clique em <strong class="text-slate-300">"Criar"</strong>.</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                        <span>Pronto! Você receberá notificações na URL configurada quando o evento ocorrer.</span>
                    </li>
                </ol>
                <p class="text-xs text-slate-500 mt-4">
                    Você pode cadastrar até 5 webhooks por conta.
                </p>
            </div>
        </section>

        <!-- Exemplo de Recebimento -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Exemplo de Recebimento (PHP)</h2>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">PHP</span>
                    <button
                        type="button"
                        class="text-slate-400 hover:text-white text-xs"
                        @click="copyPhpExample"
                    >
                        Copiar
                    </button>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ phpExample }}</code></pre>
            </div>
        </section>

        <!-- Exemplo Node.js -->
        <section class="mb-10">
            <h2 class="text-lg font-semibold text-slate-200 mb-4">Exemplo de Recebimento (Node.js / Express)</h2>
            <div class="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                <div class="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-800/50">
                    <span class="text-xs text-slate-500">JavaScript</span>
                    <button
                        type="button"
                        class="text-slate-400 hover:text-white text-xs"
                        @click="copyNodeExample"
                    >
                        Copiar
                    </button>
                </div>
                <pre class="p-4 text-sm text-slate-300 overflow-x-auto"><code>{{ nodeExample }}</code></pre>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'docs',
    middleware: false,
});

const payloadPaidExample = `{
  "event": "EVENT:CHARGE_PAID",
  "transaction": {
    "id": "01HZXK3NDEKTSV4RRFFQ69G5FA",
    "status": "paid",
    "amount": 15000,
    "payment_method": "pix",
    "customer": {
      "name": "João da Silva",
      "email": "joao@email.com",
      "document": "123.456.789-00",
      "phone": "(11) 99999-9999"
    },
    "paid_at": "2026-02-06T14:30:00.000Z",
    "created_at": "2026-02-06T14:25:00.000Z"
  },
  "sent_at": "2026-02-06T14:30:01.000Z"
}`;

const payloadExpiredExample = `{
  "event": "EVENT:CHARGE_EXPIRED",
  "transaction": {
    "id": "01HZXK3NDEKTSV4RRFFQ69G5FA",
    "status": "expired",
    "amount": 15000,
    "payment_method": "pix",
    "customer": {
      "name": "João da Silva",
      "email": "joao@email.com",
      "document": "123.456.789-00",
      "phone": "(11) 99999-9999"
    },
    "paid_at": null,
    "created_at": "2026-02-06T14:25:00.000Z"
  },
  "sent_at": "2026-02-06T14:55:00.000Z"
}`;

const payloadRefundExample = `{
  "event": "EVENT:CHARGE_REFUND",
  "transaction": {
    "id": "01HZXK3NDEKTSV4RRFFQ69G5FA",
    "status": "refunded",
    "amount": 15000,
    "payment_method": "pix",
    "customer": {
      "name": "João da Silva",
      "email": "joao@email.com",
      "document": "123.456.789-00",
      "phone": "(11) 99999-9999"
    },
    "paid_at": "2026-02-06T14:30:00.000Z",
    "created_at": "2026-02-06T14:25:00.000Z",
    "refund_amount": 15000,
    "refund_reason": "Solicitação do cliente",
    "refunded_at": "2026-02-06T15:00:00.000Z"
  },
  "sent_at": "2026-02-06T15:00:01.000Z"
}`;

const phpExample = `<?php
// webhook.php - Endpoint para receber webhooks

// Lê o corpo da requisição
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

// Valida se é JSON válido
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    exit('Invalid JSON');
}

// Obtém o evento do header ou do payload
$event = $_SERVER['HTTP_X_WEBHOOK_EVENT'] ?? $data['event'] ?? null;

// Log para debug (opcional)
error_log("Webhook recebido: " . $event);
error_log("Payload: " . $payload);

// Processa conforme o evento
switch ($event) {
    case 'EVENT:CHARGE_PAID':
        $transactionId = $data['transaction']['id'];
        $amount = $data['transaction']['amount']; // centavos
        
        // Sua lógica aqui: atualizar pedido, liberar produto, etc.
        // updateOrder($transactionId, 'paid');
        
        break;
        
    case 'EVENT:CHARGE_EXPIRED':
        $transactionId = $data['transaction']['id'];
        
        // Sua lógica: marcar pedido como expirado
        // updateOrder($transactionId, 'expired');
        
        break;
        
    case 'EVENT:CHARGE_REFUND':
        $transactionId = $data['transaction']['id'];
        $refundAmount = $data['transaction']['refund_amount'] ?? null;
        $refundReason = $data['transaction']['refund_reason'] ?? null;
        
        // Sua lógica: processar estorno
        // processRefund($transactionId, $refundAmount, $refundReason);
        
        break;
        
    default:
        error_log("Evento desconhecido: " . $event);
}

// IMPORTANTE: Retornar 200 para confirmar recebimento
http_response_code(200);
echo json_encode(['received' => true]);`;

const nodeExample = `// webhook.js - Endpoint para receber webhooks (Express)
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const event = req.headers['x-webhook-event'] || req.body.event;
    const { transaction } = req.body;
    
    console.log('Webhook recebido:', event);
    console.log('Transaction ID:', transaction?.id);
    
    switch (event) {
        case 'EVENT:CHARGE_PAID':
            // Pagamento confirmado
            console.log(\`Pagamento de R$ \${(transaction.amount / 100).toFixed(2)} confirmado!\`);
            
            // Sua lógica aqui: atualizar pedido, liberar produto, etc.
            // await updateOrder(transaction.id, 'paid');
            break;
            
        case 'EVENT:CHARGE_EXPIRED':
            // Cobrança expirou
            console.log(\`Cobrança \${transaction.id} expirou\`);
            
            // Sua lógica: marcar pedido como expirado
            // await updateOrder(transaction.id, 'expired');
            break;
            
        case 'EVENT:CHARGE_REFUND':
            // Pagamento estornado
            const refundAmount = transaction.refund_amount;
            const refundReason = transaction.refund_reason;
            console.log(\`Pagamento \${transaction.id} foi estornado - R$ \${(refundAmount / 100).toFixed(2)}\`);
            console.log(\`Motivo: \${refundReason || 'Não informado'}\`);
            
            // Sua lógica: processar estorno
            // await processRefund(transaction.id, refundAmount, refundReason);
            break;
            
        default:
            console.log('Evento desconhecido:', event);
    }
    
    // IMPORTANTE: Retornar 200 para confirmar recebimento
    res.status(200).json({ received: true });
});

app.listen(3000, () => {
    console.log('Servidor de webhooks rodando na porta 3000');
});`;

function copyPayloadPaid() {
    navigator.clipboard.writeText(payloadPaidExample);
}

function copyPayloadExpired() {
    navigator.clipboard.writeText(payloadExpiredExample);
}

function copyPayloadRefund() {
    navigator.clipboard.writeText(payloadRefundExample);
}

function copyPhpExample() {
    navigator.clipboard.writeText(phpExample);
}

function copyNodeExample() {
    navigator.clipboard.writeText(nodeExample);
}
</script>
