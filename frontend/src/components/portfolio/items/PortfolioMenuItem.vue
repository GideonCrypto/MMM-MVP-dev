<template>
    <div class="menu-container">
        <AddPortfolioMenu  v-show="isToggleAddPortfolio || isToggleRemovePortfolio"/>
        <div class="portfolio">
            <h4>Portfolio menu:</h4>
            <button @click="onAddPortfolio()">add portfolio</button>
            <button @click="onRemovePortfolio()">delete portfolio</button>
            <div>
                <h5>Chose portfolio to view: </h5>
                <select v-model="selectedPortfolioId" @change="filterAssetsByPortfolio">
                    <option value="all">All</option>
                    <option v-for="name in portfolioNames" :key="name.id" :value="name.id">
                        {{ name.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="transaction">
            <h4>Transaction menu:</h4>
            <button @click="addItemMenu()">add transaction</button>
            <button @click="onSelect(item)" :disabled="!isToggled">back to portfolio</button>
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