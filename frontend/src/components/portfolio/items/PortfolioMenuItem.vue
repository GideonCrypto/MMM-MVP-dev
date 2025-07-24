<template>
    <div class="menu-container">
        <AddPortfolioMenu  v-show="isToggleAddPortfolio || isToggleRemovePortfolio"/>
        <div class="portfolio">
            <h4>Portfolio menu:</h4>
            <button @click="onAddPortfolio()">add portfolio</button>
            <button @click="onRemovePortfolio()">delete portfolio</button>
            <div>
                <h5>Chose portfolio to view: </h5>
                <select>
                    <option value="option1">All</option>
                    <option value="option2">Test</option>
                    <option value="option3">Main</option>
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
    import { computed } from 'vue'
    import AddPortfolioMenu from '@/components/portfolio/items/AddPortfolioModal.vue'

    const toggler = usePageToggler()
    const { toggle, toggleAddPortfolio, toggleRemovePortfolio } = storeToRefs(toggler)

    const isToggled = computed(() => toggle.value)
    const isToggleAddPortfolio = computed(() => toggleAddPortfolio.value)
    const isToggleRemovePortfolio = computed(() => toggleRemovePortfolio.value)

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
        border-left: 2px solid black;
    }

    button, select {
        width: 100%;
        height: 30px;
        background: none;
        border: 1px solid black;
        border-radius: 5px;
        margin: 5px 0;
        text-align: center;
    }

    button:hover {
        background-color: lightgray;
    }
</style>