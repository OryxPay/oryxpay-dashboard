<template>
    <div>
        <label v-if="label" :for="inputId">{{ label }}</label>
        <div class="relative">
            <span class="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark">R$</span>
            <input
                :id="inputId"
                v-model="displayValue"
                type="text"
                :class="['form-input', 'ps-10', { 'border-danger': error }]"
                :placeholder="placeholder || '0,00'"
                :disabled="disabled"
                @input="handleInput"
                @blur="handleBlur"
            />
        </div>
        <p v-if="error" class="mt-1 text-sm text-danger">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue';

    interface Props {
        modelValue?: number | null;
        label?: string;
        placeholder?: string;
        error?: string;
        disabled?: boolean;
    }

    const props = withDefaults(defineProps<Props>(), {
        modelValue: null,
        label: '',
        placeholder: '',
        error: '',
        disabled: false,
    });

    const emit = defineEmits<{
        'update:modelValue': [value: number | null];
    }>();

    const inputId = `amount-input-${Math.random().toString(36).substr(2, 9)}`;
    const displayValue = ref('');

    const formatCurrency = (value: number | null): string => {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    /** Interpreta apenas dígitos como valor em centavos (ex.: "12345" → 123,45). */
    const parseDigitsAsCents = (digits: string): number | null => {
        if (!digits) return null;
        const cents = parseInt(digits, 10);
        return isNaN(cents) ? null : cents / 100;
    };

    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const digits = target.value.replace(/\D/g, '');

        if (!digits) {
            displayValue.value = '';
            emit('update:modelValue', null);
            return;
        }

        const value = parseDigitsAsCents(digits);
        if (value === null) {
            displayValue.value = '';
            emit('update:modelValue', null);
            return;
        }

        displayValue.value = formatCurrency(value);
        emit('update:modelValue', value);
    };

    const handleBlur = () => {
        const digits = displayValue.value.replace(/\D/g, '');
        const value = parseDigitsAsCents(digits);
        if (value !== null) {
            displayValue.value = formatCurrency(value);
        } else {
            displayValue.value = '';
        }
    };

    watch(() => props.modelValue, (newValue) => {
        if (newValue !== null && newValue !== undefined && !isNaN(newValue)) {
            const digits = displayValue.value.replace(/\D/g, '');
            const currentParsed = parseDigitsAsCents(digits);
            if (currentParsed !== newValue) {
                displayValue.value = formatCurrency(newValue);
            }
        } else {
            displayValue.value = '';
        }
    }, { immediate: true });
</script>
