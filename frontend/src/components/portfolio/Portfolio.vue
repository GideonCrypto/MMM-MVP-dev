<template>
    <div class="portfolio-main-container">
        <AddTransactionMenu v-show="isToggleAddItem || isToggleUpdateItem"/>
        <div class="top-container">
            <div class="grafs-container" v-if="!isToggled">
                <PortfolioGrowth/>
            </div>
            <div class="grafs-container" v-else>
                <div class="asset-data-container">
                    <div class="graf-wrapper">
                        <PortfolioGrowth/>
                    </div>
                    <div class="calc-wrapper">
                        <ul class="calc-list">
                            <li>Total profit: {{ metrics.totalProfit }} USDT</li>
                            <li>24h change: -24%</li>
                            <li>Unrealised/Realised profit: {{ metrics.unrealizedProfit }}/{{ metrics.realizedProfit }} USDT</li>
                            <li>Average buy price: {{ metrics.averageBuyPrice }} USDT</li>
                            <li>All invested: {{ metrics.totalInvested }} USDT</li>
                            <li>Body/Sell: {{ metrics.totalInvested }}/{{ metrics.totalSold }} USDT</li>
                            <li>Coin/Usdt value: {{ metrics.remainingCoins }}/{{ metrics.currentValue }} USDT</li>

                        </ul>
                    </div>
                </div>
            </div>
            <PortfolioMenuItem/>
        </div>

        <div ref="scrollContainer" class="bot-container" @scroll="handleScroll">
            <ul class="list-container" v-if="!isToggled">
                <li class="list-item sorting">
                    <span>logo</span>
                    <span>name</span>
                    <span>current price</span>
                    <span>total value/total coins</span>
                    <span>total invested</span>
                    <span>profit/loss</span>
                    <span>total transactions</span>
                    <span>portfolios list</span>
                </li>

                <PortfolioListItem
                    v-for="item in allAssets"
                    :key="item.id"
                    :name="item.name"
                    :currentPrice="item.currentPrice"
                    :totalValue="item.totalValue"
                    :totalCoins="item.totalCoins"
                    :totalInvested="item.totalInvested"
                    :profitLoss="item.profitLoss"
                    :totalTransactions="item.totalTransactions"
                    :portfoliosList="item.portfoliosList"
                    @click="onSelect(item)"
                />
            </ul>
            <ul class="list-container" v-else>
                <li class="list-item sorting">
                    <span>logo</span>
                    <span>name</span>
                    <span>price</span>
                    <span>total value/total coins</span>
                    <span>total invested</span>
                    <span>profit/loss</span>
                    <span>transaction type</span>
                    <span>portfolio</span>
                </li>

                <PortfolioListItem
                    v-for="item in assetTransactions"
                    :key="item.id"
                    :name="item.name"
                    :currentPrice="item.currentPrice"
                    :totalValue="item.totalValue"
                    :totalCoins="item.totalCoins"
                    :totalInvested="item.totalInvested"
                    :profitLoss="item.profitLoss"
                    :portfoliosList="item.portfolio"
                    :type="item.type"
                    @click="onSelectUpdate({
                        name: 'Bitcoin',
                        price: 32000,
                        totalValue: 64000,
                        totalCoins: 2,
                        date: '2025-07-21',
                        portfolio: 'Main',
                        type: 'buy'
                    })"
                />
            </ul>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, toRaw } from 'vue'
    import PortfolioListItem from '@/components/portfolio/items/PortfolioListItem.vue'
    import PortfolioGrowth from '@/components/portfolio/items/PortfolioGrowth.vue'
    import PortfolioMenuItem from '@/components/portfolio/items/PortfolioMenuItem.vue'
    import AddTransactionMenu from '@/components/portfolio/items/AddTransactionModal.vue'
    import { storeToRefs } from 'pinia'
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'

    const emit = defineEmits(['click'])

    // store -------------------------------
    const TransactionsStore = useTransactionsStore()
    const { allTransactions,
            allAssets,
            selectedAsset,
            assetAnalitics,
            } = storeToRefs(TransactionsStore)

    const toggler = usePageToggler()
    const { addAsset, 
            assetTransactions,
            toggleCountUpdateItem,
            currentPrice,
            metrics } = TransactionsStore
    const { toggle, asset, toggleAddItem, toggleUpdateItem } = storeToRefs(toggler)

    const isToggled = computed(() => toggle.value)
    const isToggleAddItem = computed(() => toggleAddItem.value)
    const isToggleUpdateItem = computed(() => toggleUpdateItem.value)

    function onSelect(item) {
        // toggler
        toggler.toggleCount()
        const rawItem = toRaw(item)        
        toggler.selectAsset(rawItem)

        // transactions
        addAsset(item)
    }

    function onSelectUpdate(item) {
        const rawItem = toRaw(item)        
        toggler.toggleCountUpdateItem(rawItem)
    }
</script>

<style scoped>
    .portfolio-main-container {
        display: grid;
        width: 100%;
        grid-template-rows: 1fr auto;
        margin: 10px;
        gap: 5px;
    }
/* --------------------head style */
    .top-container {
        display: grid;
        gap: 10px;
        grid-template-columns: 4fr 1fr;
        border: 2px solid black;
        justify-content: center;
    }

    .grafs-container {
        display: grid;
        width: 100%;
        padding: 5px;
    }

    .asset-data-container {
        display: grid;
        gap: 5px;
        grid-template-columns: 1fr auto;
    }

    .calc-wrapper{
        
    }

    .calc-list {
        display: grid;
        height: 100%;
        font-size: 13px;
        border: 2px solid black;
        border-bottom: none;
    }

    .calc-list > li {
        text-align: left;
        align-content: center;
        border-bottom: 2px solid #000;
        padding: 5px;
    }
/* --------------------bot styles */
    .bot-container {
        height: 350px;
        overflow-y: auto;
        border: 2px solid black;
        scrollbar-width: none;
    }

    .list-container {
        display: grid;
    }

    .list-item {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        border-bottom: 2px solid black;
    }

    span {
        display: grid;
        border-left: 2px solid #000;
        padding: 2px;
        place-items: center;
        text-align: center;
    }

    .list-item :first-child {
        border-left: none;
    }

    .sorting {
        position: sticky;
        top: 0;
        z-index: 10;
        background: lightgray;
    }
</style>
