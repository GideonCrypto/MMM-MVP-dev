<template>
    <div class="menu-container">
        <AddPortfolioMenu  v-show="isToggleAddPortfolio || isToggleRemovePortfolio"/>
        <div class="portfolio">
            <h4>{{t('portfolio.menu.portfolioTitle')}}</h4>
            <button @click="onAddPortfolio()">{{t('portfolio.menu.addPortfolio')}}</button>
            <button @click="onRemovePortfolio()">{{t('portfolio.menu.delPortfolio')}}</button>
            <div>
                <h5>{{t('portfolio.menu.choseTitle')}}</h5>
                <select v-model="selectedPortfolioId" @change="filterAssetsByPortfolio">
                    <option value="all">All</option>
                    <option v-for="name in portfolioNames" :key="name.id" :value="name.id">
                        {{ name.name }}
                    </option>
                </select>
                <div class="portfolio-metrics" v-if="currentPortfolioData">
                    <div class="metrics-row">
                        <span class="title">{{t('portfolio.portfolioMetrics.currentBalance')}}</span>
                        <span class="value">{{ currentPortfolioData.currentBalance.toFixed(2) }} USDT</span>
                    </div>
                    <div class="metrics-row">
                        <span class="title">{{t('portfolio.portfolioMetrics.totalProfit')}}</span>
                        <span class="value">{{ currentPortfolioData.totalProfit.toFixed(2) }} USDT</span>
                    </div>
                    <div class="metrics-row">
                        <span class="title">{{t('portfolio.portfolioMetrics.realisedProfit')}}</span>
                        <span class="value">{{ currentPortfolioData.realisedProfit.toFixed(2) }} USDT</span>
                    </div>
                    <div class="metrics-row">
                        <span class="title">{{t('portfolio.portfolioMetrics.unrealisedProfit')}}</span>
                        <span class="value">{{ currentPortfolioData.unrealisedProfit.toFixed(2) }} USDT</span>
                    </div>
                    <div class="metrics-row">
                        <span class="title">{{t('portfolio.portfolioMetrics.totalInvested')}}</span>
                        <span class="value">{{ currentPortfolioData.totalInvested.toFixed(2) }} USDT</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="transaction">
            <h4>{{t('portfolio.menu.transactionTitle')}}</h4>
            <button @click="addItemMenu()">{{t('portfolio.menu.addTransaction')}}</button>
            <button @click="onSelect(item)" :disabled="!isToggled">{{t('portfolio.menu.backPortfolio')}}</button>
        </div>
    </div>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import AddPortfolioMenu from '../items/AddPortfolioModal.vue'
    import { ref, computed, watch } from 'vue'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()

    // ---------------------------------- Store
    const TransactionsStore = useTransactionsStore()
    const { portfolioNames, portfolioSummary } = storeToRefs(TransactionsStore)

    // ---------------------------------- Choosed portfolio
    const selectedPortfolioId = ref('all')

    // ---------------------------------- Current portfolio data
    const currentPortfolioData = computed(() => {
    if (selectedPortfolioId.value === 'all') {
        return portfolioSummary.value['all'] || null
    }
    // search portfolio by id
    const portfolios = Object.values(portfolioSummary.value)
    return portfolios.find(p => p.portfolioId === selectedPortfolioId.value) || null
    })

    // ---------------------------------- filter func
    function onFilterChange(e) {
        const val = e.target.value
        selectedPortfolioId.value = val === 'all' ? 'all' : Number(val)
        TransactionsStore.setPortfolioFilter(selectedPortfolioId.value)
    }

    function filterAssetsByPortfolio() {
        TransactionsStore.setPortfolioFilter(selectedPortfolioId.value)
    }

    // ---------------------------------- Page Toggler
    const toggler = usePageToggler()
    const { toggle, toggleAddPortfolio, toggleRemovePortfolio } = storeToRefs(toggler)

    const isToggled = computed(() => toggle.value)
    const isToggleAddPortfolio = computed(() => toggleAddPortfolio.value)
    const isToggleRemovePortfolio = computed(() => toggleRemovePortfolio.value)

    // ---------------------------------- UI func
    function onSelect(item) {
        toggler.toggleCount()
    }

    function addItemMenu(params) {
        toggler.toggleCountAddItem()
    }

    function onAddPortfolio(item) {
        toggler.toggleCountAddPortfolio()
    }

    function onRemovePortfolio(item) {
        toggler.toggleCountRemovePortfolio({})
    }
</script>

<style scoped>
    .menu-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        height: 100%;
        padding: 5px;
        border-left: 2px solid var(--border-color);
    }

    .portfolio-metrics {
        padding: 0 5px;
        border-radius: 5px;
    }

    .metrics-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 10px 0;
        font-size: 0.9rem;
    }

    .metrics-row:first-child {
        margin-top: 10px;
    }

    .title {
        max-width: 130px;
    }

    button, select {
        width: 100%;
        height: 30px;
        background: none;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        margin: 5px 0;
        text-align: center;
        color: var(--text-color);
    }

    option {
        color: black;
    }

    button:hover {
        background-color: var(--table-header-color);
    }

    button:disabled {
        text-decoration: line-through;
    }

    button:disabled:hover {
        text-decoration: line-through;
        color: var(--error-text-color);
    }
</style>