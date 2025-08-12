<template>
    <div class="dashboard-main-container">
        <div class="top-container">
            <div class="container-item portfolio">
                <TotalPortfolio/>
            </div>
            <div class="container-item">
                <h4>Market data</h4>
                <ul class="list-container">
                    <li class="legend-item">
                        <span>name</span>
                        <span>price</span>
                        <span>change</span>
                    </li>
                    <AssetListItem
                        v-for="item in listItemsApiTop"
                        :key="item.id"
                        :name="item.name"
                        :img="item.img"
                        :price="item.price"
                        :change="item.change"
                    />
                </ul>
            </div>
        </div>
        <div class="bot-container">
            <div class="container-item">
                <h4>Assets from portfolios</h4>
                <ul class="list-container">
                    <li class="legend-item">
                        <span>name</span>
                        <span>price</span>
                        <span>profit</span>
                    </li>
                    <AssetListItem
                        v-for="item in listItems"
                        :key="item.id"
                        :name="item.name"
                        :img="item.img"
                        :price="item.price"
                        :change="item.profit"
                    />
                </ul>
            </div>
            <div class="container-item index">
                <h4>Fear & Greed Index</h4>
                <FearGreed/>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import AssetListItem from '@/ui/common/AssetListItem.vue'
    import FearGreed from '@/components/dashboard/items/FearGreed.vue'
    import TotalPortfolio from '@/components/dashboard/items/TotalPortfolio.vue'
    import { api } from '@/components/api/api.ts'
    import { useLocalCache } from '@/components/utils/useLocalCache'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { storeToRefs } from 'pinia'
    import { useLoginStore } from '@/store/useLoginStore.ts'
    //---------------------store
    const store = useTransactionsStore()
    const { topProfitableAssets } = storeToRefs(store)
    const { getData } = store

    const loginStore = useLoginStore()
    const { userLS } = storeToRefs(loginStore)
    //---------------------

    const listItemsApiTop = ref([])

    const loadingApi = ref(true)
    const errorApi = ref(null)

    const getTopFromApi = async () => {
        try {
            const data = await useLocalCache({
                key: 'marketDataTop',
                ttl: 5 * 60 * 1000, // 5 min
                fetcher: async () => {
                    console.log('⏳ Fetch to API') 
                    const response = await api.get('marketData/top')
                    return response.data.slice(0, 5).map((item, index) => ({
                        id: index,
                        name: item.name,
                        price: Number(item.current_price.toFixed(4)),
                        change: Number(item.price_change_24h.toFixed(4))
                    }))
                }
            })

            listItemsApiTop.value = data
        } catch (err) {
            errorApi.value = err.message || 'Request failed'
        } finally {
            loadingApi.value = false
        }
    } 

    onMounted(async () => {
        await getData()// get assets + transactions, portfolio names
        await getTopFromApi()        
    })

    const listItems = computed(() =>
        topProfitableAssets.value.map((asset, index) => ({
            id: index,
            name: asset.name,
            price: String(asset.currentPrice),
            profit: asset.profitLoss >= 0 ? `+${asset.profitLoss}` : `${asset.profitLoss}`,
    }))
)

</script>

<style scoped>
    .dashboard-main-container {
        display: flex;
        flex-direction: column;
        width: 80vw;
        height: 100vh;
        padding-left: 20px;
        padding-top: 10px;
    }

    .top-container,
    .bot-container {
        max-height: 50vh;
        display: flex;
        justify-content: space-between;
        flex: 1;
    }

    .container-item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 25vh;
        min-width: 20vw;
        max-height: 90%;
        width: 70%;
        border: 2px solid black;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 20px;
        margin-left: 0;
    }

    .portfolio {
        justify-content: center;
        align-items: center;
        border: none;
    }

    .list-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;
    }

    .list-container:last-child {
        border-bottom: 2px solid black;
    }

    .legend-item {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr ;
        height: 100%;
        border: 2px solid black;
        border-bottom: none;
        background-color: lightgray;
    }

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 2px solid black;
    }

    span:first-child {
        border: none;
    }

    .index > *:last-child {
        flex: 1;
        justify-content: center;
    }
</style>