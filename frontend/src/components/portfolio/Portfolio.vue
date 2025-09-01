<template>
  <div class="portfolio-main-container">
    <AddTransactionMenu v-show="isToggleAddItem || isToggleUpdateItem"/>
    <div class="top-container">
      <div class="grafs-container" v-if="!isToggled">
        <PortfolioGrowth class="graf-wrapper"/>
      </div>
      <div class="grafs-container" v-else>
        <div class="asset-data-container">
          <div class="graf-wrapper">
            <PortfolioGrowth/>
          </div>
          <div class="calc-wrapper">
            <ul class="calc-list">
              <li>{{t('portfolio.metrics.currentPrice')}} {{ metrics.currentPriceDisplay }} USDT</li>
              <li>{{t('portfolio.metrics.currentValue')}}  {{ metrics.currentValue }} USDT</li>
              <li>{{t('portfolio.metrics.totalCoins')}}  {{ metrics.remainingCoins}}</li>
              <li>{{t('portfolio.metrics.ROI')}}  {{ metrics.roi }}</li>
              <li>{{t('portfolio.metrics.averageBuyPrice')}}  {{ metrics.averageBuyPrice }} USDT</li>
              <li>{{t('portfolio.metrics.totalInvested')}}  {{ metrics.totalInvested }} USDT</li>
              <li>{{t('portfolio.metrics.totalRealized')}}  {{ metrics.totalSold }} USDT</li>
              <li>{{t('portfolio.metrics.unrealizedProfit')}}  {{ metrics.unrealizedProfit }} / {{ metrics.realizedProfit }} USDT</li>
              <li>{{t('portfolio.metrics.coinsUsdtValue')}}  {{ metrics.remainingCoins }} / {{ metrics.currentValue }} USDT</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="menu-col">
        <PortfolioMenuItem/>
      </div>
    </div>
    <div ref="scrollContainer" class="bot-container" @scroll="handleScroll">
      <ul class="list-container" v-if="!isToggled">
        <li class="list-item sorting">
          <span @click="sortBy('name')" class="clickable">{{t('table.name')}}</span>
          <span @click="sortBy('currentPrice')" class="clickable">{{t('table.currentPrice')}}</span>
          <span @click="sortBy('totalValue')" class="clickable">{{t('table.totalValue')}}/{{t('table.totalCoins')}}</span>
          <span @click="sortBy('totalInvested')" class="clickable">{{t('table.totalInvested')}}</span>
          <span @click="sortBy('profitLoss')" class="clickable">{{t('table.profit')}}/{{t('table.loss')}}</span>
          <span @click="sortBy('totalTransactions')" class="clickable">{{t('table.totalTransactions')}}</span>
          <span @click="sortBy('portfoliosList')" class="clickable">{{t('table.portfoliosList')}}</span>
        </li>
        <PortfolioListItem
          v-for="item in TransactionsStore.filteredSortedAssets"
          :key="item.id"
          :name="item.name"
          :currentPrice="item.currentPriceDisplay"
          :totalValue="item.totalValue"
          :totalCoins="item.totalCoins"
          :totalInvested="item.totalInvested"
          :profitLoss="item.profitLoss"
          :totalTransactions="item.totalTransactions"
          :portfoliosList="item.portfoliosList.toString()"
          @click="onSelect(item)"
        />
      </ul>

      <ul class="list-container" v-else>
        <li class="list-item sorting">
          <span @click="sortBy('name')" class="clickable">{{t('table.name')}}</span>
          <span @click="sortBy('price')" class="clickable">{{t('table.price')}}</span>
          <span @click="sortBy('totalValue')" class="clickable">{{t('table.totalValue')}}/{{t('table.totalCoins')}}</span>
          <span @click="sortBy('date')" class="clickable">{{t('table.date')}}</span>
          <span @click="sortBy('profitLoss')" class="clickable">{{t('table.profit')}}/{{t('table.loss')}}</span>
          <span @click="sortBy('transaction type')" class="clickable">{{t('table.transactionType')}}</span>
          <span @click="sortBy('portfolio')" class="clickable">{{t('table.portfolio')}}</span>
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
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const TransactionsStore = useTransactionsStore()
  const { metrics, currentPrice, selectedAsset } = storeToRefs(TransactionsStore)
  const { addAsset, setTransactions, setCurrentPrice } = TransactionsStore

  const toggler = usePageToggler()
  const { toggle, toggleAddItem, toggleUpdateItem } = storeToRefs(toggler)

  const isToggled = computed(() => toggle.value)
  const isToggleAddItem = computed(() => toggleAddItem.value)
  const isToggleUpdateItem = computed(() => toggleUpdateItem.value)

  function onSelect(item) {
    toggler.toggleCount()
    const rawItem = toRaw(item)
    toggler.selectAsset(rawItem)
    addAsset(item)
    TransactionsStore.setTransactions(item.transactions)
    TransactionsStore.setCurrentPrice(item.currentPrice)
  }

  function onSelectUpdate(item) {
    const rawItem = toRaw(item)
    toggler.toggleCountUpdateItem(rawItem)
    TransactionsStore.selectTransaction(rawItem)
  }

  function sortBy(key) {
    TransactionsStore.setSorting(key)
  }

  onMounted(async () => {
    await TransactionsStore.getPortfolios()
    await TransactionsStore.getData()
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    gap: 5px;
    overflow: hidden;
    width: 100%;
  }

  .top-container {
  flex: 0 0 60%;
  min-height: 0;
  overflow: hidden;
  border: 2px solid var(--border-color);
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 10px;
  align-items: stretch;
}

.bot-container {
  flex: 0 0 40%;
  min-height: 0;
  overflow-y: auto;
  border: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

  .top-container {
    display: grid;
    grid-template-columns: 1fr 250px;
    gap: 10px;
    align-items: stretch;
  }

  .grafs-container,
  .menu-col,
  .asset-data-container {
    min-width: 0;
    min-height: 0;
    height: 100%;
  }

  .grafs-container {
    display: grid;
    padding: 5px;
    overflow: hidden;
  }

  .graf-wrapper {
    background-color: white;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .asset-data-container {
    display: grid;
    gap: 5px;
    grid-template-columns: 3fr 1fr;
    height: 100%;
    min-height: 0;
    align-items: stretch;
  }

  .calc-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    padding: 4px;
    box-sizing: border-box;
  }

  .calc-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    box-sizing: border-box;
    font-size: 13px;
    border: 2px solid var(--border-color);
    border-bottom: none;
  }

  .calc-list > li {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    box-sizing: border-box;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .calc-list > li:last-child {
    border-bottom: 2px solid var(--border-color);
  }

  .menu-col {
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .bot-container {
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
  }

  .list-container {
    display: grid;
    min-height: 0;
  }

  .list-item {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-bottom: 2px solid var(--border-color);
  }

  .clickable { cursor: pointer; }

  .list-item > *:first-child {
    border-left: none;
  }

  span {
    display: grid;
    border-left: 2px solid var(--border-color);
    padding: 2px;
    place-items: center;
    text-align: center;
  }

  .sorting {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--table-header-color);
  }

  .add-transaction-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
  }
</style>