<template>
    <div class="market-main-container">
        <div class="top-container">
            <div class="search-container">
                <h3>Market data from CoinGecko api</h3>
                <div class="search-wrapper">
                    <label>Search your coin by name:</label>
                    <input
                        type="text"
                        v-model="filters.name"
                        @keydown="onSearchEnter"
                        :disabled="toggleSyncMarket"
                    />
                </div>
            </div>

            <div class="settings-container">
                <h5>Last sync: {{ lastUpdated }}</h5>
                <button class="market-sync" @click="loadDataSync" :disabled="toggleSyncMarket">
                Sync data with CoinGecko
                </button>
            </div>
        </div>

        <div class="bot-container">
            <template v-if="toggleSyncMarket">
                <div class="loading">
                    <p>
                        Table sync job is running. Estimated time: 15 minutes.
                        <br>
                        You can work with other pages of the app and come back later.
                    </p>
                </div>

            </template>
            <template v-else>
                <ul class="list-container">
                    <li class="list-item sorting">
                        <span>logo</span>
                        <span @click="sortBy('name')">name</span>
                        <span @click="sortBy('currentPrice')">current price</span>
                        <span @click="sortBy('marketCap')">market cap</span>
                        <span>high 24h</span>
                        <span>low 24h</span>
                        <span>price change 24h</span>
                        <span>price change percent 24h</span>
                    </li>

                    <MarketListItem
                        v-for="(item, index) in paddedData"
                        :key="item.id || `empty-${index}`"
                        v-bind="item.__empty ? {} : item"
                    />
                </ul>

                <div class="pages-container">
                    <button class="page-btn" @click="onPageDecr">Previous page</button>
                    <input
                        type="number"
                        class="page-number"
                        v-model.number="page"
                        @change="validatePage"
                        :min="1"
                        :max="totalPages"
                    />
                    <button class="page-btn" @click="onPageInc">Next page</button>
                    <button class="page-btn" @click="resetSorting">Reset</button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import MarketListItem from '@/components/market/items/MarketListItem.vue'
    import { computed, onMounted, ref } from 'vue'
    import useDate from '../../composable/useTimestampToDate.ts'
    import { useTableData } from '@/components/api/sortedFilteredReq.vue'
    import { api } from '@/components/api/api.ts'
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { storeToRefs } from 'pinia'

    const toggler = usePageToggler()
    const { toggleSyncMarket, toggleCountSyncMarket } = storeToRefs(toggler)

    

    async function loadDataSync() {        
        try {
            toggleSyncMarket.value = true
            await api.get('marketData/sync') // sunc
            await loadData() // reset table
        } catch (e) {
            console.error(e)
        } finally {
            toggleSyncMarket.value = false
        }
    }

    function onPageDecr() {
        if (page.value > 1) page.value--
    }

    function onPageInc() {
        if (page.value < totalPages.value) page.value++
    }

    function validatePage() {
        if (page.value < 1) page.value = 1
        if (page.value > totalPages.value) page.value = totalPages.value
    }

    function onSearchEnter() {
        page.value = 1
    }

    const {
        data: marketData,
        total,
        loading,
        error,
        page,
        limit,
        filters,
        loadData,
        resetSorting,
        totalPages,
    } = useTableData({
        url: 'marketData/market',
        initialFilters: {
            name: '',
            marketCap: null,
        },
        defaultSort: {
            orderBy: 'marketCap',
            orderDirection: 'desc',
        },
    })

    const paddedData = computed(() => {
        const items = [...marketData.value]
        const missing = limit.value - items.length
        for (let i = 0; i < missing; i++) {
            items.push({ __empty: true })
        }
    return items
    })

    function sortBy(field) {
        if (filters.orderBy === field) {
            filters.orderDirection = filters.orderDirection === 'asc' ? 'desc' : 'asc'
        } else {
            filters.orderBy = field
            filters.orderDirection = 'asc'
        }
    }

    const { getDate } = useDate()
    const lastUpdated = computed(() => {
        if (marketData.value?.[0]?.lastUpdated) {
            return getDate(marketData.value[0].lastUpdated);
        }
        return 'Date unknown';
    });

    onMounted(() => {
        loadData()
    })
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

    .loading {
        display: flex;
        justify-content: center;
        width: 50%;
        margin: auto;
        font-size: 20px;
        text-align: center;
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