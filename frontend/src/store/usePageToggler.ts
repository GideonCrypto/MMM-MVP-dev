import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageToggler = defineStore('usePageToggler', () => {
//-------------------------------list-------------------------------
    const toggle = ref(false)// toggler for asset transactions

    const toggleCount = () => {
        toggle.value = !toggle.value
    }// toggle for transaction list

    const selectAsset = (item: object) => {
        asset.value = {...item}
    }
//-------------------------------transactions modal-------------------------------
    const toggleAddItem = ref(false)// toggle for modal add transaction
    const toggleUpdateItem = ref(false)// toggle for modal add update transaction
    const asset = ref({})//asset data for transaction list
    const transactionToUpdate = ref({})// transaction data for modal update

    const toggleCountAddItem = () => {
        toggleAddItem.value = !toggleAddItem.value
    }// toggle for add transaction modal

    const toggleCountUpdateItem = (item: object) => {
        toggleUpdateItem.value = !toggleUpdateItem.value
        transactionToUpdate.value = {...item}
    }// toggle for update transaction modal

    const closeUpdateModal = () => {
        toggleUpdateItem.value = false
        transactionToUpdate.value = {}
    }// close modal for update transaction
//-------------------------------portfolio modal-------------------------------
    const toggleAddPortfolio = ref(false)// toggler for portfolio add modal
    const toggleRemovePortfolio = ref(false)// toggler for portfolio remove modal
    const portfolioToRemove = ref({})// porfolio data to remove

    const toggleCountAddPortfolio = () => {
        toggleAddPortfolio.value = !toggleAddPortfolio.value
    }// toggle for add portfolio modal

    const toggleCountRemovePortfolio = () => {
        toggleRemovePortfolio.value = !toggleRemovePortfolio.value
    }// toggle for remove portfolio modal
//-------------------------------market sync-------------------------------
    const toggleSyncMarket = ref(false)// toggler for sync spiner

    const toggleCountSyncMarket = () => {
        toggleSyncMarket.value = !toggleSyncMarket.value
    }// toggle for market sync

    return {
        toggle,
        asset,
        toggleAddItem,
        toggleUpdateItem,
        toggleAddPortfolio,
        toggleRemovePortfolio,
        transactionToUpdate,
        portfolioToRemove,
        toggleSyncMarket,
        toggleCount,
        toggleCountAddItem,
        toggleCountUpdateItem,
        selectAsset,
        closeUpdateModal,
        toggleCountAddPortfolio,
        toggleCountRemovePortfolio,
        toggleCountSyncMarket,
    }
})