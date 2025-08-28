import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { i18n } from '../locales/i18n'

const detectInitialLocale = (): 'ru' | 'en' => {
    const saved = localStorage.getItem('locale')
    if (saved === 'ru' || saved === 'en') return saved
    const sys = navigator.language?.toLowerCase() || 'en'
    return sys.startsWith('ru') ? 'ru' : 'en'
}

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
//-------------------------------theme toggler-------------------------------
    const toggleTheme = ref(localStorage.getItem('theme') === 'dark')// toggler theme btn

    const setTheme = (dark: boolean) => {
        toggleTheme.value = dark
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }//set theme and write it in html/local storage

    const toggleThemeType = () => {
        setTheme(!toggleTheme.value)
    }//theme toggler

    setTheme(toggleTheme.value)
//-------------------------------locale toggler-------------------------------
    // Состояние: текущий язык
  const locale = ref<'ru' | 'en'>(detectInitialLocale())

  // Устанавливаем язык
  const setLocale = (code: 'ru' | 'en') => {
    locale.value = code
    i18n.global.locale.value = code
    localStorage.setItem('locale', code)
  }

  // Переключаем язык
  const toggleLocale = () => setLocale(locale.value === 'ru' ? 'en' : 'ru')

  // Прокси для ToggleBtn (boolean v-model)
  const isRu = computed<boolean>({
    get: () => locale.value === 'ru',
    set: (v) => setLocale(v ? 'ru' : 'en'),
  })


    // применяем язык сразу при создании стора
    // @ts-ignore
    setLocale(locale.value)

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
        toggleTheme,
        locale,
        isRu,
        toggleCount,
        toggleCountAddItem,
        toggleCountUpdateItem,
        selectAsset,
        closeUpdateModal,
        toggleCountAddPortfolio,
        toggleCountRemovePortfolio,
        toggleCountSyncMarket,
        toggleThemeType,
        setTheme,
        setLocale,
        toggleLocale,
    }
})