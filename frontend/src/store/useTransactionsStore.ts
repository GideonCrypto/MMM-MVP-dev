// @ts-nocheck
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAssetMetrics } from '../composable/useAssetMetrics'
import { api } from '../components/api/api'
import { useLoginStore } from '@/store/useLoginStore.ts'

export const useTransactionsStore = defineStore('useTransactionsStore', () => {
  const round3 = (num: number) => Math.round(num * 1000) / 1000// round func for 3 sighns
  // -------------------------------login store
  const loginStore = useLoginStore()
  const { userLS } = storeToRefs(loginStore)
  // -------------------------------state
  const portfolioNames = ref([])
  const allAssets = ref([])
  const allTransactions = ref([])

  const selectedAsset = ref(null)
  const assetTransactions = ref([])
  const selectedAssetTransactionsFormatted = ref([])
  const topProfitableAssets = ref([])
  const portfolio = ref([])

  const currentPrice = ref(0)
  const selectedTransaction = ref(null)

  const portfolioFilter = ref('all')
  const sortKey = ref('')
  const sortAsc = ref(true)

  //--------------------------------derived
  const portfolioMap = computed(() => {
    const map = new Map()
    portfolioNames.value.forEach(p => map.set(p.id, p.name))
    return map
  })

  // metrics current asset+portfolio
  const filteredFormattedAssetTransactions = computed(() => {
    const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))

    return assetTransactions.value
      .filter(tx => portfolioFilter.value === 'all' || tx.portfolio === portfolioName)
      .map(tx => ({
        ...tx,
        // round for view
        quantity: round3(tx.totalCoins),
      }))
  })

  const metrics = computed(() =>
    useAssetMetrics(filteredFormattedAssetTransactions.value, currentPrice.value)
  )

  // filters/sort
  const filteredSortedAssets = computed(() => {
    let filtered = allAssets.value

    if (portfolioFilter.value !== 'all') {
      filtered = filtered.filter(asset =>
        asset.portfoliosList.includes(portfolioMap.value.get(Number(portfolioFilter.value)))
      )
    }

    if (sortKey.value) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        return sortAsc.value
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1
      })
    }

    return filtered
  })

  // filter/sort current asset
  const filteredSortedTransactions = computed(() => {
    let filtered = assetTransactions.value

    if (portfolioFilter.value !== 'all') {
      const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))
      filtered = filtered.filter(tx => tx.portfolio === portfolioName)
    }

    if (sortKey.value) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        return sortAsc.value
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1
      })
    }

    return filtered
  })

  // filter all transactions by portfolio
  const filteredAllTransactions = computed(() => {
    if (portfolioFilter.value === 'all') return allTransactions.value

    const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))
    return allTransactions.value.filter(tx => tx.portfolio === portfolioName)
  })

  function updateTopProfitableAssets() {
    const sorted = [...allAssets.value].sort((a, b) => b.profitLoss - a.profitLoss)
    topProfitableAssets.value = sorted.slice(0, 5)
  }

  function updatePortfolioDistribution() {
    const sorted = [...allAssets.value].sort((a, b) => b.profitLoss - a.profitLoss)
    const top5 = sorted.slice(0, 5)
    const others = sorted.slice(5)

    const topItems = top5.map(asset => ({
      name: asset.name,
      value: asset.totalValue,
    }))

    const otherValue = others.reduce((sum, asset) => sum + asset.totalValue, 0)

    if (otherValue > 0) {
      topItems.push({
        name: 'Other Coin',
        value: Math.round(otherValue * 1000) / 1000,
      })
    }

    portfolio.value = topItems
  }

  // --------------------------API
  async function getPortfolios() {
    try {
      const response = await api.get(`portfolioData/portfolio/${userLS.value.id}`)
      portfolioNames.value = [...response.data]
    } catch (error) {
      console.error('Get portfolio names error:', error.message)
    }
  }

  async function getData() {
    try {
      const response = await api.get(`transactionData/getAssets/${userLS.value.id}`)
      const assets = response.data

      allAssets.value = []
      allTransactions.value = []

      const assetIds = assets.map(asset => asset.marketId)

      const priceResponse = await api.get('marketData/assetPrice', {
        params: {
          names: assetIds.join(','),
        },
      })

      const pricesMap = new Map(
        priceResponse.data.map(p => [p.assetName, p.currentPrice])
      )

      assets.forEach(asset => {
        if (!asset.transactions?.length) return

        const portfoliosSet = new Set()
        const formattedTransactions = []
        const currentPriceLocal = round3(Number(pricesMap.get(asset.marketId)) || 0)

        // FIFO queue
        const buyQueue = []

        asset.transactions.forEach(tx => {
          const quantity = Number(tx.quantity) // no round
          const price = round3(Number(tx.price))
          const totalTxValue = round3(quantity * price)

          const dateObj = new Date(tx.timestamp)
          const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`
          const portfolioName = portfolioMap.value.get(tx.portfolioId) ?? ''

          let txProfitLoss = 0

          if (tx.type === 'buy') {
            // unrealised profit by current price
            txProfitLoss = round3((currentPriceLocal - price) * quantity)
            buyQueue.push({ price, quantity })
          } else if (tx.type === 'sell') {
            let sellQty = quantity
            let realized = 0

            while (sellQty > 0 && buyQueue.length > 0) {
              const lot = buyQueue[0]
              const qtyUsed = Math.min(lot.quantity, sellQty)
              realized += round3((price - lot.price) * qtyUsed)
              lot.quantity = round3(lot.quantity - qtyUsed)
              sellQty = round3(sellQty - qtyUsed)

              if (lot.quantity === 0) {
                buyQueue.shift()
              }
            }

            if (sellQty > 0) {
              realized += round3(sellQty * price)
            }

            txProfitLoss = round3(realized)
          }

          formattedTransactions.push({
            id: tx.id,
            name: asset.name,
            price,
            totalValue: totalTxValue,
            totalCoins: quantity,
            date: formattedDate,
            portfolio: portfolioName,
            type: tx.type,
            profitLoss: txProfitLoss,
            currentPrice: currentPriceLocal,
          })

          allTransactions.value.push({
            id: tx.id,
            assetName: asset.name,
            portfolio: portfolioName,
            timestamp: Math.floor(new Date(tx.timestamp).getTime() / 1000),
            type: tx.type,
            amount: totalTxValue,
            coins: quantity,
          })

          if (portfolioName) portfoliosSet.add(portfolioName)
        })

        const assetMetrics = useAssetMetrics(
          formattedTransactions.map(tx => ({
            price: tx.price,
            quantity: tx.totalCoins,
            type: tx.type,
            portfolio: tx.portfolio,
            id: tx.id,
            name: tx.name,
          })),
          currentPriceLocal
        )

        allAssets.value.push({
          id: asset.id,
          name: asset.name,
          currentPrice: currentPriceLocal,
          totalValue: round3(assetMetrics.currentValue),
          totalCoins: round3(assetMetrics.remainingCoins),
          totalInvested: round3(assetMetrics.totalInvested),
          profitLoss: round3(assetMetrics.totalProfit),
          totalTransactions: asset.transactions.length,
          portfoliosList: Array.from(portfoliosSet).join(', '),
          transactions: formattedTransactions,
        })
      })
      updateTopProfitableAssets()
      updatePortfolioDistribution()
    } catch (error) {
      console.error('Error during get data:', error)
    }
  }

  //-----------------------------watchers
  // watch for choose assets and portfolio
  watch([selectedAsset, portfolioFilter], ([newAsset, currentFilter]) => {
    if (!newAsset) {
      assetTransactions.value = []
      currentPrice.value = 0
      selectedAssetTransactionsFormatted.value = []
      return
    }

    currentPrice.value = newAsset.currentPrice || 0

    const portfolioName = portfolioMap.value.get(Number(currentFilter))
    const allTx = newAsset.transactions || []

    const filteredTx =
      currentFilter === 'all'
        ? allTx
        : allTx.filter(tx => tx.portfolio === portfolioName)

    assetTransactions.value = filteredTx

    const baseFormatted = filteredTx.map(tx => ({
      timestamp: Math.floor(
        new Date(tx.date.split('.').reverse().join('-')).getTime() / 1000
      ),
      type: tx.type,
      amount: round3(tx.totalValue),
      coins: tx.totalCoins,
    }))

    const now = Math.floor(Date.now() / 1000)
    const currentValue = round3((newAsset.totalCoins || 0) * (newAsset.currentPrice || 0))

    const withCurrentPoint = [
      ...baseFormatted,
      {
        timestamp: now,
        type: 'current',
        amount: currentValue,
        coins: newAsset.totalCoins || 0,
        isCurrent: true,
      },
    ]

    selectedAssetTransactionsFormatted.value = withCurrentPoint
  },
    { immediate: true }
  )

  //--------------------------- actions
  function addAsset(asset) {
    selectedAsset.value = asset
  }

  function selectTransaction(transaction) {    
    selectedTransaction.value = {
      ...transaction,
      marketId: selectedAsset.value.id,
    }
  }

  function setTransactions(newTransactions) {
    assetTransactions.value = newTransactions
  }

  function setPortfolioFilter(id) {
    portfolioFilter.value = id
  }

  function setSorting(key) {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

  function setCurrentPrice(price) {
    currentPrice.value = price
  }

  function setAllTransactionsFromAsset(asset) {
    if (!asset || !asset.transactions) return

    const baseFormatted = asset.transactions.map(tx => ({
      timestamp: Math.floor(new Date(tx.date.split('.').reverse().join('-')).getTime() / 1000),
      type: tx.type,
      amount: round3(tx.totalValue),
      coins: tx.totalCoins,
    }))

    const now = Math.floor(Date.now() / 1000)
    const currentValue = round3((asset.totalCoins || 0) * (asset.currentPrice || 0))

    const withCurrentPoint = [
      ...baseFormatted,
      {
        timestamp: now,
        type: 'current',
        amount: currentValue,
        coins: asset.totalCoins || 0,
        isCurrent: true,
      },
    ]

    selectedAssetTransactionsFormatted.value = withCurrentPoint
  }

  return {
    // State
    portfolioNames,
    allAssets,
    allTransactions,
    selectedAsset,
    assetTransactions,
    currentPrice,
    selectedTransaction,
    selectedAssetTransactionsFormatted,
    topProfitableAssets,
    portfolio,
    // Derived
    metrics,
    filteredSortedAssets,
    filteredSortedTransactions,
    filteredAllTransactions,
    // Actions
    getPortfolios,
    getData,
    addAsset,
    selectTransaction,
    setTransactions,
    setAllTransactionsFromAsset,
    setPortfolioFilter,
    setSorting,
    setCurrentPrice,
    updateTopProfitableAssets,
    updatePortfolioDistribution,
  }
})
