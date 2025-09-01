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
        currentPrice: [Number, String],
        totalValue: [Number, String],
        totalCoins: [Number, String],
        totalInvested: [Number, String],
        profitLoss: [Number, String],
        totalTransactions: [Number, String],
        portfoliosList: String,
        type: String,
    })
    defineEmits(['select', 'click'])
</script>

<style scoped>
    span {
        max-width: 100%;
        border-left: 2px solid var(--border-color);
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
        border-left: none;
    }

    .list-item:hover {
        background-color: lightgrey;
        cursor: pointer;
        color:  black;
    }

    .list-item:hover > span {
        border-left: 2px solid black;
    }

    .list-item:hover > span:first-child {
        border-left: none;
    }

    .type-buy {
        background-color: #e0f8e0;
        color: black;
    }
    .type-buy > span {
        border-left: 2px solid black;
    } 

    .type-sell {
        background-color: #f8e0e0;
        color: black
    }

    .type-sell > span {
        border-left: 2px solid black;
    } 

    .type-sell, .type-buy {
        border-bottom: 2px solid black !important;
    }
</style>
