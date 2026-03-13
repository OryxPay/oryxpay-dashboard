<template>
    <div class="relative min-h-screen overflow-hidden bg-[#050B1B]">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(67,97,238,0.25),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(24,189,154,0.2),transparent_40%)]"></div>
        <div class="relative z-10 flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
            <div class="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B1532]/95 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
                <h1 class="text-3xl font-extrabold leading-tight text-primary">Verificação em 2 etapas</h1>
                <p class="mt-2 text-base text-white/70">
                    Digite o código de 6 dígitos enviado para <strong class="text-white/90">{{ maskedEmail }}</strong>.
                </p>

                <div v-if="localError || error" class="mt-5 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                    {{ localError || error }}
                </div>
                <div v-if="successMessage" class="mt-5 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success">
                    {{ successMessage }}
                </div>

                <form class="mt-6 space-y-4" @submit.prevent="handleVerify">
                    <div>
                        <label for="code" class="mb-2 block text-sm font-semibold text-white/85">Código</label>
                        <input
                            id="code"
                            v-model="code"
                            type="text"
                            inputmode="numeric"
                            maxlength="6"
                            class="form-input h-14 text-center text-2xl tracking-[0.35em]"
                            placeholder="000000"
                            :disabled="loading"
                        />
                    </div>

                    <button type="submit" class="btn btn-primary w-full h-12 text-base" :disabled="loading || code.length !== 6">
                        {{ loading ? 'Validando...' : 'Confirmar código' }}
                    </button>
                </form>

                <button
                    type="button"
                    class="btn btn-outline-secondary w-full mt-3 h-12 text-base"
                    :disabled="loading || resendLoading || cooldown > 0"
                    @click="handleResend"
                >
                    <span v-if="resendLoading">Reenviando...</span>
                    <span v-else-if="cooldown > 0">Reenviar código em {{ cooldown }}s</span>
                    <span v-else>Reenviar código</span>
                </button>

                <button
                    v-if="showBackToLogin"
                    type="button"
                    class="btn btn-outline-danger w-full mt-3 h-12 text-base"
                    @click="goToLogin"
                >
                    Voltar para o login
                </button>

                <p class="mt-5 text-center text-sm text-white/60">
                    Problemas para receber? Verifique spam/lixeira ou volte para fazer login novamente.
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { verify2fa, resend2fa, loading, error, clearError } = useAuth();
const code = ref('');
const resendLoading = ref(false);
const cooldown = ref(0);
const localError = ref('');
const successMessage = ref('');
let cooldownTimer: ReturnType<typeof setInterval> | null = null;

const challengeToken = computed(() => String(route.query.challenge_token || ''));
const showBackToLogin = computed(() => {
    const message = `${localError.value || ''} ${error.value || ''}`.toLowerCase();
    return message.includes('sessão expirada') || message.includes('sessao expirada') || !challengeToken.value;
});
const maskedEmail = computed(() => {
    const raw = String(route.query.email || '');
    if (!raw.includes('@')) return 'seu e-mail';
    const [user, domain] = raw.split('@');
    if (!user) return raw;
    const visible = user.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(2, user.length - 2))}@${domain}`;
});

watch(code, (next) => {
    const sanitized = next.replace(/\D/g, '').slice(0, 6);
    if (sanitized !== next) code.value = sanitized;
});

function startCooldown(seconds: number) {
    cooldown.value = Math.max(0, seconds);
    if (cooldownTimer) clearInterval(cooldownTimer);
    if (cooldown.value <= 0) return;
    cooldownTimer = setInterval(() => {
        cooldown.value = Math.max(0, cooldown.value - 1);
        if (cooldown.value === 0 && cooldownTimer) {
            clearInterval(cooldownTimer);
            cooldownTimer = null;
        }
    }, 1000);
}

function parseRemainingSeconds(message: string): number | null {
    const match = message.match(/Aguarde\s+([\d.,]+)/i);
    if (!match?.[1]) return null;
    const value = Number.parseFloat(match[1].replace(',', '.'));
    if (!Number.isFinite(value)) return null;
    return Math.max(1, Math.ceil(value));
}

async function handleVerify() {
    clearError();
    localError.value = '';
    successMessage.value = '';
    if (!challengeToken.value || code.value.length !== 6) return;

    const result = await verify2fa({
        challenge_token: challengeToken.value,
        code: code.value,
    });

    if (!result.success) return;
}

async function handleResend() {
    clearError();
    localError.value = '';
    successMessage.value = '';
    if (!challengeToken.value) return;
    resendLoading.value = true;
    try {
        const result = await resend2fa(challengeToken.value);
        if (result.success) {
            successMessage.value = 'Novo código enviado. Verifique sua caixa de entrada e spam.';
            startCooldown(60);
            return;
        }

        const message = (result as any)?.error?.data?.message || (result as any)?.error?.message || 'Não foi possível reenviar o código.';
        localError.value = message;
        const remaining = parseRemainingSeconds(message);
        if (remaining) startCooldown(remaining);
    } finally {
        resendLoading.value = false;
    }
}

function goToLogin() {
    router.push('/auth/login');
}

onMounted(() => {
    if (!challengeToken.value) {
        router.push('/auth/login');
    }
});

onBeforeUnmount(() => {
    if (cooldownTimer) clearInterval(cooldownTimer);
});

useHead({ title: 'Verificar 2FA' });
definePageMeta({
    layout: 'auth-layout',
    middleware: 'auth',
});
</script>
