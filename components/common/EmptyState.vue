<template>
    <div class="flex flex-col items-center justify-center py-12 text-center">
        <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            :style="{ backgroundColor: iconColor + '20', color: iconColor }"
        >
            <DynamicIcon :name="iconName" class="h-8 w-8" />
        </div>
        <h3 class="mb-2 text-lg font-semibold dark:text-white-light">{{ title }}</h3>
        <p class="mb-4 text-white-dark">{{ message }}</p>
        <slot name="action">
            <button v-if="actionLabel" class="btn btn-primary" @click="$emit('action')">
                {{ actionLabel }}
            </button>
        </slot>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import DynamicIcon from '@/components/common/DynamicIcon.vue';

    interface Props {
        title?: string;
        message?: string;
        icon?: string;
        iconColor?: string;
        actionLabel?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        title: 'Nenhum item encontrado',
        message: 'Comece adicionando novos itens.',
        icon: 'folder',
        iconColor: '#6b7280',
        actionLabel: '',
    });

    defineEmits<{
        action: [];
    }>();

    const iconName = computed(() => {
        const icon = props.icon || 'folder';
        // Garantir que o nome do ícone está correto
        return icon.startsWith('icon-') ? icon.replace('icon-', '') : icon;
    });
</script>
