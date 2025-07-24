<template>
    <div class="dashboard-main-container">
        <!-- <h1>Dashboard</h1> -->
        <div class="top-container">
            <div class="container-item portfolio">
                <TotalPortfolio/>
            </div>
            <div class="container-item">
                <h4>Market data</h4>
                <ul class="list-container">
                    <AssetListItem
                        v-for="item in listItems"
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
                <h4>Assets</h4>
                <ul class="list-container">
                    <AssetListItem
                    v-for="item in listItems"
                    :key="item.id"
                    :name="item.name"
                    :img="item.img"
                    :price="item.price"
                    :change="item.change"
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
    import AssetListItem from '@/ui/common/AssetListItem.vue'
    import FearGreed from '@/components/dashboard/items/FearGreed.vue'
    import TotalPortfolio from '@/components/dashboard/items/TotalPortfolio.vue'

    const listItems = [{
            id:0,
            name: 'bitcoin',
            price: '112000',
            change: '29'
        },{
            id:1,
            name: 'solana',
            price: '112000',
            change: '29'
        },{
            id:2,
            name: 'cardano',
            price: '112000',
            change: '-29'
        },{
            id:3,
            name: 'ethereum',
            price: '112000',
            change: '+29'
        },{
            id:4,
            name: 'ripple',
            price: '112000',
            change: '29'
        }];
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

    .list-container > li {
        padding: 5px;
        border-top: 1px solid black;
    }

    .index > *:last-child {
        flex: 1;
        justify-content: center;
    }
</style>