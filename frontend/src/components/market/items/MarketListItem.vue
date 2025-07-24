<template>
    <li
        class="list-item"
    >
        <VueCryptocurrencyIcons :name='name' width='25px'/>
        <span>{{ name }}/{{tiker}}</span>
        <span>{{ currentPrice }}</span>
        <span>{{ marketCap }}</span>
        <span>{{ high24h }}</span>
        <span>{{ low24h }}</span>
        <span>{{ priceChange24H }}</span>
        <span>{{ priceChangePercent24H }}</span>
    </li>
</template>

<script setup>
    defineProps({
        name: String,
        tiker: String,
        currentPrice: String,
        marketCap: String,
        high24h: String,
        low24h: String,
        priceChange24H: String,
        priceChangePercent24H: String,
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
