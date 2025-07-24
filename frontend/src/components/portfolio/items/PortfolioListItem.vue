<template>
    <li
        class="list-item"
    >
        <VueCryptocurrencyIcons :name='name' width='25px'/>
        <span>{{ name }}</span>
        <span>{{ currentPrice }}</span>
        <span>{{ totalValue }} / {{ totalCoins }}</span>
        <span>{{ totalInvested }}</span>
        <span>{{ profitLoss }}</span>
        <span v-if="!totalTransactions">{{ type }}</span>
        <span v-else>{{ totalTransactions }}</span>
        <span>{{ portfoliosList }}</span>
    </li>
</template>

<script setup>
    defineProps({
        name: String,
        currentPrice: String,
        totalValue: String,
        totalCoins: String,
        totalInvested: String,
        profitLoss: String,
        totalTransactions: String,
        portfoliosList: String,
        type: String,
    })
    defineEmits(['select'])
</script>

<style scoped>
    span {
        border-left: 2px solid #000;
        padding: 5px;
        place-items: center;
        text-align: center;
    }

    .list-item :first-child {
        margin: auto;
        padding: 1px;
    }

    .list-item:hover {
        background-color: lightgray;
    }
</style>
