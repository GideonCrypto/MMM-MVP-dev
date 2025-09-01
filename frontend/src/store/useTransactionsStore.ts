// @ts-nocheck
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAssetMetrics } from '../composable/useAssetMetrics'
import { api } from '../components/api/api'
import { useLoginStore } from '@/store/useLoginStore.ts'

export const useTransactionsStore = defineStore('useTransactionsStore', () => {
  const round3 = (num: number) => Math.round(num * 1000) / 1000// round func for 3 sighns

  function trimTrailingZeros(s: string) {
    return s.replace(/(\.\d*?[1-9])0+$|\.0+$/g, '$1').replace(/\.$/, '')
  }

  function formatDisplay(num: number): string {
    const n = Number(num)
    if (!isFinite(n)) return String(num)
    if (n === 0) return '0'
    const abs = Math.abs(n)
    if (abs < 1e-6) return trimTrailingZeros(n.toFixed(12))
    if (abs < 1e-2) return trimTrailingZeros(n.toFixed(8))
    return trimTrailingZeros(Number(n.toPrecision(12)).toString())
  }//normalise numbers

  function parseDateToTimestampSec(input: any): number {
    try {
      const asSec = (n: number) => Math.floor(n > 1e12 ? n / 1000 : n)

      if (typeof input === 'number' && Number.isFinite(input)) {
        return asSec(input)
      }

      if (typeof input === 'string') {
        const s = input.trim()
        if (/^\d+$/.test(s)) {
          const p = Number(s)
          if (!Number.isNaN(p)) return asSec(p)
        }
        const parsed = Date.parse(s)
        if (!Number.isNaN(parsed)) return Math.floor(parsed / 1000)
      }

      if (input && typeof input === 'object') {
        for (const f of ['timestamp', 'time', 'createdAt', 'dateTime']) {
          const v = input[f]
          if (v === undefined || v === null) continue
          if (typeof v === 'number' && Number.isFinite(v)) return asSec(v)
          if (typeof v === 'string') {
            const s = v.trim()
            if (/^\d+$/.test(s)) {
              const p = Number(s)
              if (!Number.isNaN(p)) return asSec(p)
            }
            const parsed = Date.parse(s)
            if (!Number.isNaN(parsed)) return Math.floor(parsed / 1000)
          }
        }

        if (typeof input.date === 'string') {
          const s = input.date.trim()
          if (s.includes('.')) {
            const parts = s.split(' ')
            const datePart = parts[0]
            const dmy = datePart.split('.').map(p => p.trim())
            if (dmy.length >= 3) {
              let [d, m, y] = dmy
              if (y.length === 2) y = '20' + y
              const day = Number(d), month = Number(m), year = Number(y)
              if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                let hours = 0, minutes = 0, seconds = 0
                if (parts.length > 1) {
                  const t = parts[1].split(':')
                  hours = Number(t[0] || 0)
                  minutes = Number(t[1] || 0)
                  seconds = Number(t[2] || 0)
                }
                return Math.floor(Date.UTC(year, month - 1, day, hours, minutes, seconds) / 1000)
              }
            }
          }
          const parsed = Date.parse(s)
          if (!Number.isNaN(parsed)) return Math.floor(parsed / 1000)
        }
      }
    } catch (e) {
      console.debug('parseDateToTimestampSec error', e)
    }

    return Math.floor(Date.now() / 1000)
  }
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

  const filteredFormattedAssetTransactions = computed(() => {
    const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))
    return assetTransactions.value
      .filter(tx => portfolioFilter.value === 'all' || tx.portfolio === portfolioName)
      .map(tx => {
        const quantity = tx.totalCoins ?? tx.totalCoinsRaw ?? tx.coins ?? Number(tx.quantity ?? 0)
        const price = tx.priceRaw ?? (tx.totalValue && quantity ? tx.totalValue / quantity : 0)
        return { ...tx, quantity, price }
      })
  })// metrics current asset+portfolio

  const metrics = computed(() => {
    const base = useAssetMetrics(filteredFormattedAssetTransactions.value, currentPrice.value)
    return {
      ...base,
      currentPriceRaw: currentPrice.value,
      currentPriceDisplay: formatDisplay(currentPrice.value),
    }
  })

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
        if (typeof aVal === 'number' && typeof bVal === 'number') return sortAsc.value ? aVal - bVal : bVal - aVal
        return sortAsc.value ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
      })
    }
    return filtered
  })// filters/sort

  function parseDateToTimestampSecSort(objOrDate) {
    const dateStr = typeof objOrDate === 'string' ? objOrDate : objOrDate.date
    if (!dateStr) return 0
    const [day, month, year] = dateStr.split('.').map(Number)
    return new Date(year, month - 1, day).getTime() / 1000
  }//func for sorting by timestamp

  const filteredSortedTransactions = computed(() => {
    let filtered = assetTransactions.value
    if (portfolioFilter.value !== 'all') {
      const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))
      filtered = filtered.filter(tx => tx.portfolio === portfolioName)
    }
    if (sortKey.value) {
      filtered = [...filtered].sort((a, b) => {
        if (sortKey.value === 'date') {
          const aDate = parseDateToTimestampSecSort(a)
          const bDate = parseDateToTimestampSecSort(b)
          return sortAsc.value ? aDate - bDate : bDate - aDate
        }
        const aVal = a[sortKey.value]
        const bVal = b[sortKey.value]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortAsc.value ? aVal - bVal : bVal - aVal
        }
        return sortAsc.value
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    }
    return filtered
  })// filter/sort current asset

  const filteredAllTransactions = computed(() => {
    let filtered = allTransactions.value
    if (portfolioFilter.value !== 'all') {
      const portfolioName = portfolioMap.value.get(Number(portfolioFilter.value))
      filtered = filtered.filter(tx => tx.portfolio === portfolioName)
    }

    return [...filtered].sort((a, b) => {
      const ta = Number.isFinite(a?.timestamp) ? a.timestamp : parseDateToTimestampSecSort(a)
      const tb = Number.isFinite(b?.timestamp) ? b.timestamp : parseDateToTimestampSecSort(b)
      return sortAsc.value ? ta - tb : tb - ta
    })
  })// filter all transactions by portfolio

  const portfolioSummary = computed(() => {
    const summaryMap: Record<string, any> = {}

    function ensurePortfolio(id: number | null, name: string) {
      if (!summaryMap[name]) {
        summaryMap[name] = {
          portfolioId: id,
          portfolioName: name,
          currentBalance: 0,
          totalProfit: 0,
          realisedProfit: 0,
          unrealisedProfit: 0,
          totalInvested: 0,
          raw: {
            currentBalance: 0,
            totalProfit: 0,
            realisedProfit: 0,
            unrealisedProfit: 0,
            totalInvested: 0,
          },
        }
      }
      return summaryMap[name]
    }

    allAssets.value.forEach(asset => {
      const currentPriceRaw = asset.currentPriceRaw ?? asset.currentPrice ?? 0
      if (!asset.transactions) return
      const txByPortfolio: Record<string, any[]> = {}
      asset.transactions.forEach(tx => {
        if (!txByPortfolio[tx.portfolio]) txByPortfolio[tx.portfolio] = []
        txByPortfolio[tx.portfolio].push(tx)
      })
      for (const [portfolioName, txs] of Object.entries(txByPortfolio)) {
        const idEntry = [...portfolioMap.value.entries()].find(([id, name]) => name === portfolioName)
        const portfolioId = idEntry ? idEntry[0] : null
        const summary = ensurePortfolio(portfolioId, portfolioName)
        let invested = 0, realised = 0, remainingCoins = 0, remainingCost = 0
        const fifo: { qty: number; price: number }[] = []

        for (const tx of txs.sort((a, b) => parseDateToTimestampSec(a) - parseDateToTimestampSec(b))) {
          const qty = tx.totalCoinsRaw ?? tx.totalCoins ?? tx.coins ?? Number(tx.quantity ?? 0)
          const priceRaw = tx.priceRaw ?? tx.price ?? 0
          if (tx.type === 'buy') {
            invested += priceRaw * qty
            fifo.push({ qty, price: priceRaw })
          } else if (tx.type === 'sell') {
            let sellQty = qty
            while (sellQty > 0 && fifo.length > 0) {
              const lot = fifo[0]
              const useQty = Math.min(lot.qty, sellQty)
              realised += (priceRaw - lot.price) * useQty
              lot.qty -= useQty
              sellQty -= useQty
              if (lot.qty === 0) fifo.shift()
            }
            if (sellQty > 0) realised += priceRaw * sellQty
          }
        }

        fifo.forEach(lot => {
          remainingCoins += lot.qty
          remainingCost += lot.price * lot.qty
        })

        const currentBalance = remainingCoins * currentPriceRaw
        const unrealised = currentBalance - remainingCost
        const totalProfit = realised + unrealised

        summary.raw.totalInvested += invested
        summary.raw.realisedProfit += realised
        summary.raw.unrealisedProfit += unrealised
        summary.raw.currentBalance += currentBalance
        summary.raw.totalProfit += totalProfit

        summary.totalInvested = round3(summary.raw.totalInvested)
        summary.realisedProfit = round3(summary.raw.realisedProfit)
        summary.unrealisedProfit = round3(summary.raw.unrealisedProfit)
        summary.currentBalance = round3(summary.raw.currentBalance)
        summary.totalProfit = round3(summary.raw.totalProfit)
      }
    })

    const allSummary = {
      portfolioId: null,
      portfolioName: 'all',
      currentBalance: 0,
      totalProfit: 0,
      realisedProfit: 0,
      unrealisedProfit: 0,
      totalInvested: 0,
      raw: {
        currentBalance: 0,
        totalProfit: 0,
        realisedProfit: 0,
        unrealisedProfit: 0,
        totalInvested: 0,
      },
    }

    for (const s of Object.values(summaryMap)) {
      allSummary.raw.currentBalance += s.raw.currentBalance
      allSummary.raw.totalProfit += s.raw.totalProfit
      allSummary.raw.realisedProfit += s.raw.realisedProfit
      allSummary.raw.unrealisedProfit += s.raw.unrealisedProfit
      allSummary.raw.totalInvested += s.raw.totalInvested
    }

    allSummary.currentBalance = round3(allSummary.raw.currentBalance)
    allSummary.totalProfit = round3(allSummary.raw.totalProfit)
    allSummary.realisedProfit = round3(allSummary.raw.realisedProfit)
    allSummary.unrealisedProfit = round3(allSummary.raw.unrealisedProfit)
    allSummary.totalInvested = round3(allSummary.raw.totalInvested)

    summaryMap['all'] = allSummary
    return summaryMap
  })// portfolio summary

  function updateTopProfitableAssets() {
    const sorted = [...allAssets.value].sort((a, b) => b.profitLoss - a.profitLoss)
    topProfitableAssets.value = sorted.slice(0, 5)
  }

  function updatePortfolioDistribution() {
    const agg = new Map<string, number>()
    for (const asset of allAssets.value || []) {
      const name = asset.name ?? asset.marketId ?? 'Unknown'
      const value = Number(asset.totalValue ?? asset.totalValueRaw ?? asset.currentValue ?? 0) || 0
      agg.set(name, (agg.get(name) || 0) + value)
    }

    const aggregated = Array.from(agg.entries()).map(([name, totalValue]) => ({ name, totalValue }))
    aggregated.sort((a, b) => b.totalValue - a.totalValue)

    const top5 = aggregated.slice(0, 5)
    const others = aggregated.slice(5)
    const otherValue = others.reduce((s, x) => s + x.totalValue, 0)

    const result = top5.map(a => ({ name: a.name, value: round3(a.totalValue) }))
    if (otherValue > 0) result.push({ name: 'Other Coin', value: round3(otherValue) })

    portfolio.value = JSON.parse(JSON.stringify(result))
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
      const priceResponse = await api.get('marketData/assetPrice', { params: { names: assetIds.join(',') } })
      const pricesMap = new Map(priceResponse.data.map(p => [p.assetName, Number(p.currentPrice)]))

      assets.forEach(asset => {
        if (!asset.transactions?.length) return
        const portfoliosSet = new Set()
        const formattedTransactions: any[] = []
        const currentPriceRaw = Number(pricesMap.get(asset.marketId)) || 0
        const buyQueue: { price: number; quantity: number }[] = []

        asset.transactions.forEach(tx => {
          const quantityRaw = Number(tx.quantity)
          const priceRaw = Number(tx.price)
          const totalValueRaw = quantityRaw * priceRaw
          const timestampSec = Math.floor(parseDateToTimestampSec(tx))
          const dateObj = new Date(timestampSec * 1000)
          const formattedDate = typeof tx.date === 'string'
            ? tx.date
            : `${String(dateObj.getUTCDate()).padStart(2, '0')}.${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}.${dateObj.getUTCFullYear()}`

          const portfolioName = portfolioMap.value.get(tx.portfolioId) ?? (tx.portfolio ?? '')

          let txProfitLoss = 0
          if (tx.type === 'buy') {
            txProfitLoss = (currentPriceRaw - priceRaw) * quantityRaw
            buyQueue.push({ price: priceRaw, quantity: quantityRaw })
          } else if (tx.type === 'sell') {
            let sellQty = quantityRaw
            let realized = 0
            while (sellQty > 0 && buyQueue.length > 0) {
              const lot = buyQueue[0]
              const qtyUsed = Math.min(lot.quantity, sellQty)
              realized += (priceRaw - lot.price) * qtyUsed
              lot.quantity -= qtyUsed
              sellQty -= qtyUsed
              if (lot.quantity === 0) buyQueue.shift()
            }
            if (sellQty > 0) realized += priceRaw * sellQty
            txProfitLoss = realized
          }

          const priceDisplay = formatDisplay(priceRaw)
          const currentPriceDisplay = formatDisplay(currentPriceRaw)
          const totalValueDisplay = round3(totalValueRaw)

          formattedTransactions.push({
            id: tx.id,
            name: asset.name,
            priceRaw,
            price: priceDisplay,
            priceDisplay,
            totalValueRaw,
            totalValue: totalValueRaw,
            totalValueDisplay,
            totalCoinsRaw: quantityRaw,
            totalCoins: quantityRaw,
            date: formattedDate,
            portfolio: portfolioName,
            type: tx.type,
            profitLossRaw: txProfitLoss,
            profitLoss: round3(txProfitLoss),
            currentPriceRaw,
            currentPrice: currentPriceDisplay,
            currentPriceDisplay,
          })

          allTransactions.value.push({
            id: tx.id,
            assetName: asset.name,
            portfolio: portfolioName,
            timestamp: timestampSec,
            type: tx.type,
            amount: totalValueRaw,
            coins: quantityRaw,
          })

          if (portfolioName) portfoliosSet.add(portfolioName)
        })

        const assetMetrics = useAssetMetrics(
          formattedTransactions.map(tx => ({ price: tx.priceRaw, quantity: tx.totalCoinsRaw, type: tx.type, portfolio: tx.portfolio, id: tx.id, name: tx.name })),
          currentPriceRaw
        )

        allAssets.value.push({
          id: asset.id,
          name: asset.name,
          currentPriceRaw,
          currentPrice: currentPriceRaw,
          currentPriceDisplay: formatDisplay(currentPriceRaw),
          totalValue: assetMetrics.currentValue,
          totalCoins: assetMetrics.remainingCoins,
          totalInvested: assetMetrics.totalInvested,
          profitLoss: assetMetrics.totalProfit,
          totalTransactions: asset.transactions.length,
          portfoliosList: Array.from(portfoliosSet),
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
  watch([selectedAsset, portfolioFilter], ([newAsset, currentFilter]) => {
    if (!newAsset) {
      assetTransactions.value = []
      currentPrice.value = 0
      selectedAssetTransactionsFormatted.value = []
      return
    }

    currentPrice.value = newAsset.currentPrice ?? newAsset.currentPriceRaw ?? 0
    const portfolioName = portfolioMap.value.get(Number(currentFilter))
    const allTx = newAsset.transactions || []

    const filteredTx = currentFilter === 'all' ? allTx : allTx.filter(tx => (tx.portfolio ?? tx.portfolioName ?? '') === portfolioName)
    assetTransactions.value = filteredTx

    const baseFormatted = filteredTx.map(tx => {
      const timestampSec = parseDateToTimestampSec(tx)
      const amount = tx.totalValue ?? tx.totalValueRaw ?? tx.amount ?? (tx.priceRaw && (tx.totalCoins ?? tx.totalCoinsRaw ?? tx.coins ?? Number(tx.quantity ?? 0)) ? (Number(tx.priceRaw) * (tx.totalCoins ?? tx.totalCoinsRaw ?? tx.coins ?? Number(tx.quantity ?? 0))) : 0)
      const coins = tx.totalCoins ?? tx.totalCoinsRaw ?? tx.coins ?? Number(tx.quantity ?? 0) ?? 0
      const portfolioField = tx.portfolio ?? tx.portfolioName ?? (tx.portfolioId ? portfolioMap.value.get(tx.portfolioId) ?? '' : '')
      const assetName = tx.name ?? newAsset.name ?? tx.assetName ?? ''
      const id = tx.id ?? tx.transactionId ?? null

      return {
        id,
        assetName,
        portfolio: portfolioField,
        timestamp: Math.floor(timestampSec),
        type: tx.type,
        amount: round3(Number(amount ?? 0)),
        coins: round3(Number(coins ?? 0)),
      }
    })

    selectedAssetTransactionsFormatted.value = baseFormatted
  }, { immediate: true })// watch for choose assets and portfolio
//--------------------------- actions
  function addAsset(asset) { selectedAsset.value = asset }
  function selectTransaction(transaction) { selectedTransaction.value = { ...transaction, marketId: selectedAsset.value?.id ?? null } }
  function setTransactions(newTransactions) { assetTransactions.value = newTransactions }
  function setPortfolioFilter(id) { portfolioFilter.value = id }
  function setSorting(key) { sortKey.value === key ? (sortAsc.value = !sortAsc.value) : (sortKey.value = key, sortAsc.value = true) }
  function setCurrentPrice(price) { currentPrice.value = price }

  function setAllTransactionsFromAsset(asset) {
    if (!asset || !asset.transactions) return
    const baseFormatted = asset.transactions.map(tx => {
      const timestamp = Math.floor(parseDateToTimestampSec(tx))
      const amount = tx.totalValue ?? tx.totalValueRaw ?? tx.amount ?? 0
      const coins = tx.totalCoins ?? tx.totalCoinsRaw ?? tx.coins ?? Number(tx.quantity ?? 0) ?? 0
      return { timestamp, type: tx.type, amount: round3(Number(amount)), coins: round3(Number(coins)) }
    })
    selectedAssetTransactionsFormatted.value = baseFormatted
  }

  return {
    portfolioNames, allAssets, allTransactions,
    selectedAsset, assetTransactions, currentPrice, selectedTransaction, selectedAssetTransactionsFormatted, topProfitableAssets, portfolio,
    metrics, filteredSortedAssets, filteredSortedTransactions, filteredAllTransactions, portfolioSummary,
    getPortfolios, getData, addAsset, selectTransaction, setTransactions, setAllTransactionsFromAsset,
    setPortfolioFilter, setSorting, setCurrentPrice, updateTopProfitableAssets, updatePortfolioDistribution,
  }
})
