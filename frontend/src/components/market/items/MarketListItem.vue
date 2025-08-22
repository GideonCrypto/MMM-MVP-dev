<template>
    <li class="list-item" :class="{ 'empty-item': isEmpty }">
        <template v-if="!isEmpty">
            <span :title="name">{{ name }}</span>
            <span :title="currentPrice">{{ currentPrice }}</span>
            <span :title="marketCap">{{ marketCap }}</span>
            <span :title="high24h">{{ high24h }}</span>
            <span :title="low24h">{{ low24h }}</span>
            <span :title="priceChange24h">{{ priceChange24h }}</span>
            <span :title="priceChangePercentage24h">{{ priceChangePercentage24h }}</span>
        </template>
        <template v-else>
            <span v-for="i in 8" :key="i">&nbsp;</span>
        </template>
    </li>
</template>

<script setup>
    const props = defineProps({
        name: String,
        currentPrice: [String, Number],
        marketCap: [String, Number],
        high24h: [String, Number],
        low24h: [String, Number],
        priceChange24h: [String, Number],
        priceChangePercentage24h: [String, Number],
        __empty: Boolean,
    })

    const isEmpty = props.__empty === true
</script>

<style scoped>
    span {
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
        padding: 4px;
        text-align: center;
        height: 100%;
        margin: auto 0;
        border-left: 2px solid var(--border-color);
        overflow-wrap: break-word;
        white-space: normal;
        justify-content: center;
        align-items: center;
    }

    .list-item {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        font-size: 15px;
    }

    .list-item :first-child {
        border-left: none;
        margin: auto;
        padding: 1px;
    }

    .list-item:hover {
        background-color: var(--hover-bg-color);
        color: black;
    }

    .list-item:hover > span {
        border-left: 1px solid black;
    }

    .list-item:hover > span:first-child {
        border-left: none;
    }
</style>
