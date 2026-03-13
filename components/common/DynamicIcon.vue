<template>
    <component :is="iconComponent" class="h-6 w-6" />
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import IconHorizontalDots from '@/components/icon/icon-horizontal-dots.vue';
    
    // Importar ícones comuns explicitamente
    import IconShoppingCart from '@/components/icon/icon-shopping-cart.vue';
    import IconShoppingBag from '@/components/icon/icon-shopping-bag.vue';
    import IconHome from '@/components/icon/icon-home.vue';
    import IconHeart from '@/components/icon/icon-heart.vue';
    import IconBook from '@/components/icon/icon-book.vue';
    import IconSettings from '@/components/icon/icon-settings.vue';
    import IconCreditCard from '@/components/icon/icon-credit-card.vue';
    import IconLaptop from '@/components/icon/icon-laptop.vue';
    import IconTrendingUp from '@/components/icon/icon-trending-up.vue';
    import IconDollarSign from '@/components/icon/icon-dollar-sign.vue';
    import IconFolder from '@/components/icon/icon-folder.vue';
    import IconWallet from '@/components/icon/icon-wallet.vue';
    import IconReceipt from '@/components/icon/icon-receipt.vue';
    import IconPiggyBank from '@/components/icon/icon-piggy-bank.vue';
    import IconCardReceive from '@/components/icon/icon-card-receive.vue';
    import IconCardSend from '@/components/icon/icon-card-send.vue';
    import IconChartPie from '@/components/icon/icon-chart-pie.vue';
    import IconWalletMoney from '@/components/icon/icon-wallet-money.vue';
    import IconBox from '@/components/icon/icon-box.vue';
    import IconPlayCircle from '@/components/icon/icon-play-circle.vue';
    import IconAward from '@/components/icon/icon-award.vue';
    import IconBarChart from '@/components/icon/icon-bar-chart.vue';
    import IconChartSquare from '@/components/icon/icon-chart-square.vue';

    interface Props {
        name: string;
    }

    const props = defineProps<Props>();

    // Mapeamento de ícones comuns (baseado no CategorySeeder)
    const iconMap: Record<string, any> = {
        // Ícones de categorias de gastos
        'shopping-cart': IconShoppingCart,
        'shopping-bag': IconShoppingBag,
        'box': IconBox,
        'home': IconHome,
        'heart': IconHeart,
        'book': IconBook,
        'play-circle': IconPlayCircle,
        'settings': IconSettings,
        'credit-card': IconCreditCard,
        // Ícones de categorias de receitas
        'folder': IconFolder,
        'laptop': IconLaptop,
        'trending-up': IconTrendingUp,
        'award': IconAward,
        'dollar-sign': IconDollarSign,
        // Ícones financeiros adicionais
        'wallet': IconWallet,
        'receipt': IconReceipt,
        'piggy-bank': IconPiggyBank,
        'card-receive': IconCardReceive,
        'card-send': IconCardSend,
        'chart-pie': IconChartPie,
        'wallet-money': IconWalletMoney,
        'bar-chart': IconBarChart,
        'chart-square': IconChartSquare,
        // Fallback
        'horizontal-dots': IconHorizontalDots,
    };

    const iconComponent = computed(() => {
        if (!props.name) return IconHorizontalDots;

        let iconName = props.name.startsWith('icon-') 
            ? props.name.replace('icon-', '') 
            : props.name;

        // Normalizar o nome (remover espaços, converter para lowercase)
        iconName = iconName.toLowerCase().trim();

        // Retornar o componente do mapeamento ou fallback
        return iconMap[iconName] || IconHorizontalDots;
    });
</script>
