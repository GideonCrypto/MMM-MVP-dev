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
                            <li>Current price: {{ currentPrice }} USDT</li>
                            <li>Current value: {{ metrics.currentValue }} USDT</li>
                            <li>Total coins: {{ metrics.remainingCoins}}</li>
                            <li>ROI: {{ metrics.roi }}</li>
                            <li>Average buy price: {{ metrics.averageBuyPrice }} USDT</li>
                            <li>Total Invested: {{ metrics.totalInvested }} USDT</li>
                            <li>Total Realized: {{ metrics.totalSold }} USDT</li>
                            <li>U/R profit: {{ metrics.unrealizedProfit }} / {{ metrics.realizedProfit }} USDT</li>
                            <li>Coin/Usdt value: {{ metrics.remainingCoins }} / {{ metrics.currentValue }} USDT</li>

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
                    <span @click="sortBy('name')" class="clickable">name</span>
                    <span @click="sortBy('currentPrice')" class="clickable">current price</span>
                    <span @click="sortBy('totalValue')" class="clickable">total value/total coins</span>
                    <span @click="sortBy('totalInvested')" class="clickable">total invested</span>
                    <span @click="sortBy('profitLoss')" class="clickable">profit/loss</span>
                    <span @click="sortBy('totalTransactions')" class="clickable">total transactions</span>
                    <span @click="sortBy('portfoliosList')" class="clickable">portfolios list</span>
                </li>
                <PortfolioListItem
                    v-for="item in TransactionsStore.filteredSortedAssets"
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
                    <span @click="sortBy('name')" class="clickable">name</span>
                    <span @click="sortBy('price')" class="clickable">price</span>
                    <span @click="sortBy('totalValue')" class="clickable">total value/total coins</span>
                    <span @click="sortBy('date')" class="clickable">date</span>
                    <span @click="sortBy('profitLoss')" class="clickable">profit/loss</span>
                    <span @click="sortBy('transaction type')" class="clickable">transaction type</span>
                    <span @click="sortBy('portfolio')" class="clickable">portfolio</span>
                </li>
                <PortfolioListItem
                    v-for="item in TransactionsStore.filteredSortedTransactions"
                    :key="item.id"
                    :name="item.name"
                    :currentPrice="item.price"
                    :totalValue="item.totalValue"
                    :totalCoins="item.totalCoins"
                    :totalInvested="item.date"
                    :profitLoss="item.profitLoss"
                    :portfoliosList="item.portfolio"
                    :type="item.type"
                    @click="onSelectUpdate(item)"
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
    import { api } from '@/components/api/api'

    //------------------------------- store
    // -------transaction
    const TransactionsStore = useTransactionsStore()
    const {
        metrics,
        assetTransactions,
        currentPrice,
    } = storeToRefs(TransactionsStore)

    const {
        addAsset,
        setTransactions,
        setCurrentPrice,
        selectTransaction,
    } = TransactionsStore
    // -------toggler
    
    const toggler = usePageToggler()

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
        TransactionsStore.setTransactions(item.transactions)//set list for selected asset
        TransactionsStore.setCurrentPrice(item.currentPrice)//set current price for selected asset/all assets
    }

    function onSelectUpdate(item) {
        const rawItem = toRaw(item)
        toggler.toggleCountUpdateItem(rawItem)
        TransactionsStore.selectTransaction(rawItem);
    }

    
    function sortBy(key) {
        TransactionsStore.setSorting(key)
    }

    onMounted(async () => {
        await TransactionsStore.getPortfolios()
        await TransactionsStore.getData()// get assets + transactions, portfolio names

        if (TransactionsStore.allAssets.length > 0) {
            const firstAsset = TransactionsStore.allAssets[0]
            TransactionsStore.addAsset(firstAsset)
            TransactionsStore.setTransactions(firstAsset.transactions)
            TransactionsStore.setCurrentPrice(firstAsset.currentPrice)
        }
    })
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
        grid-template-columns: repeat(8, minmax(0, 1fr));
        border-bottom: 2px solid black;
    }

    .clickable{
        cursor: pointer;
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
