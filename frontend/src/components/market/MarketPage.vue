<template>
    <div class="market-main-container">
        <div class="top-container">
            <div class="search-container">
                <h3>Market data from CoinGecko api</h3>
                <div class="search-wrapper">
                    <label>Search your coin by name:</label>
                    <input type="text">
                </div>
            </div>
            <div class="settings-container">
                <h5>Last sync: {{lastUpdated}}</h5>
                <button class="market-sync" @click="onSync" :disabled="sync">Sync data with CoinGecko</button>
            </div>
        </div>
        <div class="bot-container">
            <Spiner :fetchData="loadData" v-if="sync">
                <template #error="{ error }">
                    <p style="color: red;">Error: {{ error.message }}</p>
                </template>
            </Spiner>
            <template v-else>
                <ul class="list-container">
                    <li class="list-item sorting">
                        <span>logo</span>
                        <span>name/tiker</span>
                        <span>current price</span>
                        <span>market cap</span>
                        <span>high 24h</span>
                        <span>low 24h</span>
                        <span>price change 24h</span>
                        <span>price change percent 24h</span>
                    </li>
                    <MarketListItem
                        v-for="item in allAssets"
                        :key="item.id"
                        :name="item.name"
                        :tiker="item.tiker"
                        :currentPrice="item.currentPrice"
                        :marketCap="item.marketCap"
                        :high24h="item.high24h"
                        :low24h="item.low24h"
                        :priceChange24H="item.priceChange24H"
                        :priceChangePercent24H="item.priceChangePercent24H"
                    />
                </ul>
                <div class="pages-container">
                    <button class="page-btn">Previous page</button>
                    <input type="number" class="page-number">
                    <button class="page-btn">Next page</button>
                </div>
            </template>
            
        </div>
    </div>
</template>

<script setup>
    import MarketListItem from '@/components/market/items/MarketListItem.vue'
    import { ref } from 'vue';
    import useDate from '../../composable/useTimestampToDate.ts'
    import Spiner from '../../ui/common/Spiner.vue'
    const { getDate } = useDate();
    const lastUpdated = getDate(1750933798508)
    const sync = ref(false)

    function onSync() {
        sync.value = !sync.value
    }

    async function loadData() {
        await new Promise(resolve => setTimeout(resolve, 10000))
        sync.value = !sync.value
        return 
    }
    
    const allAssets = [{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },{
            id: 1,
            name: `bitcoin`,
            tiker: 'btc',
            currentPrice: '112000',
            marketCap: '29000000',
            high24h: '200',
            low24h: '167',
            priceChange24H: '-33',
            priceChangePercent24H: '-9',
        },]
</script>

<style scoped>
    .market-main-container {
        display: grid;
        width: 100%;
        grid-template-rows: 1fr 6fr;
        margin: 10px;
        gap: 5px;
    }
/* ------------------------top */
    .top-container {
        display: grid;
        gap: 10px;
        grid-template-columns: 3fr 1fr;
        border: 2px solid black;
        justify-content: center;
    }

    .search-container {
        display: flex;
        flex-direction: column;
        
        padding: 5px;
    }

    .search-wrapper {
        margin: auto;
    }

    label {
        margin-right: 10px;
    }

    .settings-container {
        border-left: 2px solid black;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .market-sync {
        padding: 5px;
    }
/* ------------------------------bot */
    .bot-container {
        display: grid;
        grid-template-rows:1fr auto ;
        border: 2px solid black;
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
        background: lightgray;
    }

    .pages-container {
        display: flex;
        justify-content: center;
        padding: 5px;
    }

    button, .page-number {
        background: none;
        border-radius: 5px;
        border: 1px solid black;
        text-align: center;
        padding: 5px;
        margin: 0px 5px;
    }

    button:hover {
        background-color: lightgray;
    }

    .page-number {
        width: 50px;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>