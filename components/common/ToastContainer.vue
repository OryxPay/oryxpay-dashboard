<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[9999] space-y-2">
            <TransitionGroup name="toast" tag="div">
                <div
                    v-for="toast in toasts"
                    :key="toast.id"
                    class="panel min-w-[300px] max-w-md shadow-lg"
                    :class="getToastClass(toast.type)"
                >
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                            <component :is="getToastIcon(toast.type)" class="h-5 w-5" />
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium">{{ toast.message }}</p>
                        </div>
                        <button
                            type="button"
                            class="flex-shrink-0 text-white-dark hover:text-primary"
                            @click="removeToast(toast.id)"
                        >
                            <icon-x class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
    import { useToast, type Toast } from '@/composables/useToast';
    import IconCircleCheck from '@/components/icon/icon-circle-check.vue';
    import IconXCircle from '@/components/icon/icon-x-circle.vue';
    import IconInfoCircle from '@/components/icon/icon-info-circle.vue';
    import IconInfoTriangle from '@/components/icon/icon-info-triangle.vue';

    const { toasts, removeToast } = useToast();

    const getToastClass = (type: Toast['type']): string => {
        const classes: Record<Toast['type'], string> = {
            success: 'bg-success/10 text-success border-success/20',
            error: 'bg-danger/10 text-danger border-danger/20',
            warning: 'bg-warning/10 text-warning border-warning/20',
            info: 'bg-primary/10 text-primary border-primary/20',
        };
        return classes[type] || '';
    };

    const getToastIcon = (type: Toast['type']) => {
        const icons: Record<Toast['type'], any> = {
            success: IconCircleCheck,
            error: IconXCircle,
            warning: IconInfoTriangle,
            info: IconInfoCircle,
        };
        return icons[type] || IconInfoCircle;
    };
</script>

<style scoped>
    .toast-enter-active,
    .toast-leave-active {
        transition: all 0.3s ease;
    }

    .toast-enter-from {
        opacity: 0;
        transform: translateX(100%);
    }

    .toast-leave-to {
        opacity: 0;
        transform: translateX(100%);
    }
</style>
