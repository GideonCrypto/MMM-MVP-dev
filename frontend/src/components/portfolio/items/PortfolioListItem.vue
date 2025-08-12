<template>
    <li :class="['list-item', { 'type-buy': type === 'buy', 'type-sell': type === 'sell' }]" @click="$emit('click')">
        <span :title="name">{{ name }}</span>
        <span :title="currentPrice">{{ currentPrice }}</span>
        <span :title="`${totalValue} / ${totalCoins}`">{{ totalValue }} / {{ totalCoins }}</span>
        <span :title="totalInvested">{{ totalInvested }}</span>
        <span :title="profitLoss">{{ profitLoss }}</span>
        <span :title="type" v-if="!totalTransactions">{{ type }}</span>
        <span :title="totalTransactions" v-else>{{ totalTransactions }}</span>
        <span :title="portfoliosList">{{ portfoliosList }}</span>
    </li>
</template>

<script setup>
    defineProps({
        name: String,
        currentPrice: Number,
        totalValue: Number,
        totalCoins: Number,
        totalInvested: [Number, String],
        profitLoss: Number,
        totalTransactions: Number,
        portfoliosList: String,
        type: String,
    })
    defineEmits(['select', 'click'])
</script>

<style scoped>
    span {
        max-width: 100%;
        border-left: 2px solid #000;
        padding: 5px;
        place-items: center;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .list-item :first-child {
        margin: auto;
        padding: 1px;
    }

    .list-item:hover {
        background-color: lightgray;
        cursor: pointer;
    }

    .type-buy {
        background-color: #e0f8e0;
    }

    .type-sell {
        background-color: #f8e0e0;
    }
</style>
