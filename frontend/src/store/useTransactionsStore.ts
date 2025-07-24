import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAssetMetrics } from '../composable/useAssetMetrics'

export const useTransactionsStore = defineStore('useTransactionsStore', () => {
    // 1. STATE
    const allTransactions = ref([{ timestamp: 1718323200, type: 'buy', amount: 1000 },
        { timestamp: 1718409600, type: 'buy', amount: 300 },
        { timestamp: 1718496000, type: 'sell', amount: 200 },
        { timestamp: 1718582400, type: 'buy', amount: 150 },
        { timestamp: 1689292800, type: 'buy', amount: 700 },
        { timestamp: 1690502400, type: 'sell', amount: 450 },
        { timestamp: 1691625600, type: 'buy', amount: 200 },
        { timestamp: 1692912000, type: 'buy', amount: 1200 },
        { timestamp: 1694121600, type: 'sell', amount: 600 },
        { timestamp: 1695408000, type: 'buy', amount: 900 },
        { timestamp: 1696368000, type: 'sell', amount: 350 },
        { timestamp: 1697587200, type: 'buy', amount: 1000 },
        { timestamp: 1698700800, type: 'buy', amount: 400 },
        { timestamp: 1699900800, type: 'sell', amount: 300 },
        { timestamp: 1701187200, type: 'buy', amount: 800 },
        { timestamp: 1702473600, type: 'buy', amount: 500 },
        { timestamp: 1703760000, type: 'sell', amount: 200 },
        { timestamp: 1705084800, type: 'buy', amount: 1000 },
        { timestamp: 1609459200, type: 'buy', amount: 1200 },
        { timestamp: 1577836800, type: 'sell', amount: 300 },
        { timestamp: 1546300800, type: 'buy', amount: 450 },
        { timestamp: 1514764800, type: 'buy', amount: 700 },
        { timestamp: 1501545600, type: 'sell', amount: 500 },
        { timestamp: 1491004800, type: 'buy', amount: 1000 },
        { timestamp: 1517443200, type: 'sell', amount: 650 },
        { timestamp: 1522540800, type: 'buy', amount: 900 },
        { timestamp: 1530403200, type: 'sell', amount: 200 },
        { timestamp: 1538352000, type: 'buy', amount: 750 },
        { timestamp: 1543622400, type: 'buy', amount: 400 },
        { timestamp: 1551398400, type: 'sell', amount: 550 },
        { timestamp: 1561939200, type: 'buy', amount: 300 },
        { timestamp: 1572393600, type: 'sell', amount: 250 },
        { timestamp: 1580515200, type: 'buy', amount: 1100 },
        { timestamp: 1588291200, type: 'sell', amount: 600 },
        { timestamp: 1596240000, type: 'buy', amount: 1300 },
        { timestamp: 1601510400, type: 'sell', amount: 500 },
        { timestamp: 1612051200, type: 'buy', amount: 800 },
        { timestamp: 1622505600, type: 'sell', amount: 1000 },
        { timestamp: 1630454400, type: 'buy', amount: 600 },
        { timestamp: 1640995200, type: 'sell', amount: 400 },
        { timestamp: 1651449600, type: 'buy', amount: 900 },
        { timestamp: 1661904000, type: 'sell', amount: 200 },
        { timestamp: 1672444800, type: 'buy', amount: 300 },
        { timestamp: 1682899200, type: 'sell', amount: 550 },
        { timestamp: 1506816000, type: 'buy', amount: 750 },
        { timestamp: 1496275200, type: 'sell', amount: 450 },
        { timestamp: 1488326400, type: 'buy', amount: 1000 },
        { timestamp: 1483228800, type: 'sell', amount: 350 },])//get by crud
    const allAssets = ref([{
            id: 1,
            name: `bitcoin`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '9',
            portfoliosList: 'text34'
        },{
            id: 2,
            name: `monero`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '6',
            portfoliosList: 'text'
        },{
            id: 3,
            name: `starknet`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '3',
            portfoliosList: 'text'
        },{
            id: 4,
            name: `solana`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '2',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        },{
            id:6,
            name: `tron`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '23',
            portfoliosList: 'text'
        },{
            id: 7,
            name: `cardano`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '13',
            portfoliosList: 'text'
        },{
            id: 1,
            name: `bitcoin`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '9',
            portfoliosList: 'text34'
        },{
            id: 2,
            name: `monero`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '6',
            portfoliosList: 'text'
        },{
            id: 3,
            name: `starknet`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '3',
            portfoliosList: 'text'
        },{
            id: 4,
            name: `solana`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '2',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        },{
            id:6,
            name: `tron`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '23',
            portfoliosList: 'text'
        },{
            id: 7,
            name: `cardano`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '13',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        },{
            id:6,
            name: `tron`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '23',
            portfoliosList: 'text'
        },{
            id: 7,
            name: `cardano`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '13',
            portfoliosList: 'text'
        },{
            id: 1,
            name: `bitcoin`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '9',
            portfoliosList: 'text34'
        },{
            id: 2,
            name: `monero`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '6',
            portfoliosList: 'text'
        },{
            id: 3,
            name: `starknet`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '3',
            portfoliosList: 'text'
        },{
            id: 4,
            name: `solana`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '2',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        },{
            id:6,
            name: `tron`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '23',
            portfoliosList: 'text'
        },{
            id: 7,
            name: `cardano`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '13',
            portfoliosList: 'text'
        },{
            id: 1,
            name: `bitcoin`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '9',
            portfoliosList: 'text34'
        },{
            id: 2,
            name: `monero`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '6',
            portfoliosList: 'text'
        },{
            id: 3,
            name: `starknet`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '3',
            portfoliosList: 'text'
        },{
            id: 4,
            name: `solana`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '2',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        },{
            id:6,
            name: `tron`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '23',
            portfoliosList: 'text'
        },{
            id: 7,
            name: `cardano`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '13',
            portfoliosList: 'text'
        },{
            id: 5,
            name: `ethereum`,
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            totalTransactions: '87',
            portfoliosList: 'text'
        }])//get by crud
    const selectedAsset = ref({})//get by click in table
    
    const assetTransactions = ref([
        {
            id: 1,
            name: 'bitcoin',
            price: 10500,
            quantity: 0.5,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 2,
            name: 'bitcoin',
            price: 11000,
            quantity: 0.3,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 3,
            name: 'bitcoin',
            price: 11500,
            quantity: 0.2,
            // totalTransactions: 'sell',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'sell',
        },
        {
            id: 4,
            name: 'bitcoin',
            price: 10800,
            quantity: 0.4,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 5,
            name: 'bitcoin',
            price: 12000,
            quantity: 0.1,
            // totalTransactions: 'sell',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'sell',
        },
        {
            id: 6,
            name: 'bitcoin',
            price: 9500,
            quantity: 0.6,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 7,
            name: 'bitcoin',
            price: 9900,
            quantity: 0.25,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 8,
            name: 'bitcoin',
            price: 10200,
            quantity: 0.3,
            // totalTransactions: 'sell',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'sell',
        },
        {
            id: 9,
            name: 'bitcoin',
            price: 9800,
            quantity: 0.7,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        },
        {
            id: 10,
            name: 'bitcoin',
            price: 10100,
            quantity: 0.15,
            // totalTransactions: 'buy',
            portfolio: 'main',
            currentPrice: '112000',
            totalValue: '29',
            totalCoins: '200',
            totalInvested: '29000',
            profitLoss: '-29',
            type: 'buy',
        }
        ]
    )
    // const assetTransactionsMoc = ref([
    //     { id: 1, name: 'bitcoin', price: 10, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 2, name: 'bitcoin', price: 11, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 3, name: 'bitcoin', price: 11, quantity: 1, type: 'sell', portfolio: 'main' },
    //     { id: 4, name: 'bitcoin', price: 10, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 5, name: 'bitcoin', price: 12, quantity: 1, type: 'sell', portfolio: 'main' },
    //     { id: 6, name: 'bitcoin', price: 9, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 7, name: 'bitcoin', price: 9, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 8, name: 'bitcoin', price: 10, quantity: 1, type: 'sell', portfolio: 'main' },
    //     { id: 9, name: 'bitcoin', price: 9, quantity: 1, type: 'buy', portfolio: 'main' },
    //     { id: 10, name: 'bitcoin', price: 10, quantity: 1, type: 'buy', portfolio: 'main' },
    // ])

    // const assetAnalitics = ref({})//create from others
    const currentPrice = ref(10500) 

    function addAsset (asset: object) {
        selectedAsset.value = asset
    }

     // 🧠 Компьютед: Автоматически рассчитывает метрики
    const metrics = computed(() => {
        return useAssetMetrics(assetTransactions.value, currentPrice.value)
    })

    // 🛠 Методы (если нужно обновлять транзакции или цену)
    function setTransactions(newTransactions: typeof assetTransactions.value) {
        assetTransactions.value = newTransactions
    }

    function setCurrentPrice(price: number) {
        currentPrice.value = price
    }
    
    return {
        allTransactions,
        allAssets,
        selectedAsset,
        assetTransactions,
        addAsset,
        metrics,
        setTransactions,
        setCurrentPrice,
    }
})