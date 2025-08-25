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
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { storeToRefs } from 'pinia'
    import { computed, onMounted, ref } from 'vue'
    import { api } from '@/components/api/api.ts'
    import AddPortfolioMenu from '@/components/portfolio/items/AddPortfolioModal.vue'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { i18n } from '../../../locales/i18n'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
    const selectedPortfolioId = ref('all')
    // ----------------------------------store
    // ----------- transactions
    const { portfolioNames } = storeToRefs(useTransactionsStore())

    const TransactionsStore = useTransactionsStore()
    
    function onFilterChange(e) {
        TransactionsStore.setPortfolioFilter(e.target.value)
    }
    function filterAssetsByPortfolio() {
        TransactionsStore.setPortfolioFilter(selectedPortfolioId.value)
    }
    // ------------ toggler
    const toggler = usePageToggler()
    const { toggle, toggleAddPortfolio, toggleRemovePortfolio } = storeToRefs(toggler)

    const isToggled = computed(() => toggle.value)
    const isToggleAddPortfolio = computed(() => toggleAddPortfolio.value)
    const isToggleRemovePortfolio = computed(() => toggleRemovePortfolio.value)
    // ----------------------------------
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
        display: grid;
        padding: 5px;
        border-left: 2px solid var(--border-color);
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