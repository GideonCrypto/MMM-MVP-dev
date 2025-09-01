<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <form @submit.prevent="handleSubmit">
            <h2>{{ isToggleUpdateItem ? t('portfolio.transaction.mainTitleUpdate') : t('portfolio.transaction.mainTitleAdd') }}</h2>

            <div class="form-group">
                <label>{{t('portfolio.transaction.search')}}</label>
                <input v-model="query" list="suggestions" @change="handleAssetSelection"/>
                <datalist id="suggestions">
                    <option v-for="item in suggestions" :key="item.id" :value="item.name" />
                </datalist>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>{{t('portfolio.transaction.price')}}</label>
                    <input type="number" v-model="form.price" step="0.000000000001" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>{{t('portfolio.transaction.totalCoin')}}</label>
                    <input type="number" v-model="form.totalCoins" step="0.000000000001" />
                </div>
                <div class="form-group">
                    <label>{{t('portfolio.transaction.date')}}</label>
                    <input type="date" v-model="form.date" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>{{t('portfolio.transaction.portfolio')}}</label>
                    <select v-model="form.portfolioId">
                        <option disabled value="">Select</option>
                        <option v-for="name in portfolioNames" :key="name" :value="name.id">
                            {{ name.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>{{t('portfolio.transaction.type')}}</label>
                    <select v-model="form.type">
                        <option disabled value="">Select</option>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
            </div>

            <p class="error" v-if="error">{{ error }}</p>

            <div class="buttons">
                <button type="submit">{{ isToggleUpdateItem ? t('portfolio.transaction.submitUpdate') : t('portfolio.transaction.submitAdd')  }}</button>
                <button type="button"  @click="deleteItem" v-if="toggleUpdateItem">{{t('portfolio.transaction.delete')}}</button>
                <button type="button" @click="hideMenu">{{t('portfolio.transaction.close')}}</button>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref, watch } from "vue"
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { storeToRefs } from 'pinia'
    import { computed } from 'vue'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { api } from '@/components/api/api'
    import { useTableData } from '@/components/api/sortedFilteredReq.vue'
    import { useLoginStore } from '@/store/useLoginStore.ts'
    import { i18n } from '../../../locales/i18n'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
    // ----------------------------------store
    const { portfolioNames } = storeToRefs(useTransactionsStore())
    
    const toggler = usePageToggler()
    const { toggleAddItem, toggleUpdateItem, transactionToUpdate } = storeToRefs(toggler)

    const isToggleAddItem = computed(() => toggleAddItem.value)
    const isToggleUpdateItem = computed(() => toggleUpdateItem.value)

    const TransactionsStore = useTransactionsStore();
    const { selectedTransaction, assetTransactions } = storeToRefs(TransactionsStore)
    const { getData } = TransactionsStore
    // ----------------------------------login store
    const loginStore = useLoginStore()
    const { userLS } = storeToRefs(loginStore)
    // ----------------------------------
    const form = ref({
        name: '',
        price: '',
        totalCoins: '',
        date: '',
        portfolioId: '',
        type: '',
        assetId: '',
    })

    // ----------------------------------select search
    const {
        data,
        filters,
        loadData,
        loading
    } = useTableData({
        url: 'marketData/market',
        initialFilters: {
            name: '',
            marketCap: null,
        },
        defaultSort: {
            orderBy: 'marketCap',
            orderDirection: 'desc',
        },
    })
    
    const query = computed({
        get: () => form.value.name,
        set: (val) => {
            form.value.name = val
            filters.name = val
        }
    })// get selected data from datalist

    watch(query, (newVal) => {
        filters.name = newVal
    })// watching for query and update filter

    const suggestions = computed(() => {
        const seen = new Set()
        return data.value.filter(item => {
            if (seen.has(item.name)) return false
            seen.add(item.name)
            return true
        })
    })// dropdown list

    function handleAssetSelection() {
        const selected = suggestions.value.find(item => item.name === form.value.name)
        if (selected) {
            form.value.assetId = selected.id
            console.log(form.value.assetId);
        } else {
            form.value.assetId = null // if user enter not existing
        }
    }

    const error = ref(null)

    function formatDateForInput(dateStr) {        
        const parts = dateStr.split('.');
        if (parts.length !== 3) return '';

        const [day, month, year] = parts;
        if (!day || !month || !year) return '';

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    watch(toggleUpdateItem, (val) => {
        if (val && selectedTransaction.value) {
            form.value = {
                ...selectedTransaction.value,
                date: formatDateForInput(selectedTransaction.value.date),
            };
        }
    });

    async function hideMenu() {
        if (toggleUpdateItem.value && !toggleAddItem.value) {
            toggler.toggleUpdateItem = !toggleUpdateItem
            form.value = {
                name: '',
                price: '',
                totalCoins: '',
                date: '',
                portfolio: '',
                type: '',
                assetId: ''
            }
        } else {
            toggler.toggleCountAddItem()
        }

        for (const key in form.value) {
            form.value[key] = ''
        }
        error.value = null

        await TransactionsStore.getData()

        const updatedAsset = TransactionsStore.allAssets.find(
            a => a.name === TransactionsStore.selectedAsset.name
        )

        if (updatedAsset) {
            TransactionsStore.addAsset(updatedAsset)
            TransactionsStore.setTransactions(updatedAsset.transactions)
            TransactionsStore.setAllTransactionsFromAsset(updatedAsset)
        }
    }

    async function handleSubmit() {
        error.value = null

        if (!form.value.name) {
            error.value = t('portfolio.transaction.nameErr')
            return
        }

        if (!form.value.assetId) {
            if (!toggleUpdateItem.value) {
                error.value = t('portfolio.transaction.correctNameErr')
                return
            }
        }

        const price = Number(form.value.price)
        const totalCoins = Number(form.value.totalCoins)

        if (isNaN(price) || price <= 0) {
            error.value = t('portfolio.transaction.priceErr')
            return
        }

        if (isNaN(totalCoins) || totalCoins <= 0) {
            error.value = t('portfolio.transaction.coinsErr')
            return
        }

        if (!form.value.date) {
            error.value = t('portfolio.transaction.dateErr')
            return
        }

        if (!form.value.portfolioId) {
            error.value = t('portfolio.transaction.portfolioErr')
            return
        }

        if (!form.value.type) {
            error.value = t('portfolio.transaction.typeErr')
            return
        }

        const isoDate = new Date(form.value.date).toISOString()
        const data = {
            ...form.value,
            date: isoDate
        }

        if (toggleUpdateItem.value == true) {
            try {
                const response = await api.patch('transactionData/updateTransaction', {
                    price: Number(data.price),
                    quantity: data.totalCoins,
                    timestamp: data.date,
                    portfolioId: data.portfolioId,
                    type: data.type,
                    assetId: data.name,
                    userId: Number(userLS.value.id),
                    id: data.id,
                    marketId: data.marketId,
                    name: data.name
                })
            } catch (error) {
                console.error('Update transaction error:', error.message)
            }
        } else {
            try {            
                const response = await api.post('transactionData/addTransaction', {
                    price: data.price,
                    quantity: data.totalCoins,
                    timestamp: data.date,
                    portfolioId: data.portfolioId,
                    type: data.type,
                    assetId: data.assetId,
                    userId: Number(userLS.value.id),
                    marketId: data.assetId,
                    name: data.name
                })
            } catch (error) {
                console.error('Add transaction error:', error.message)
            }
        }
        
        hideMenu()
        return data
    }

    async function deleteItem() {
        try {
            const response = await api.delete(`transactionData/${form.value.id}`)
            if (assetTransactions.value.length === 1) {
                toggler.toggleCount()
            }
        } catch (error) {
            console.error('Delete transaction error:', error.message)
        }
        hideMenu()
    }

    onMounted(() => {
        loadData()
    })
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: var(--bg-color);
        padding: 24px;
        border-radius: 12px;
        width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border: 2px solid var(--modal-border-color);
    }

    h2 {
        margin-bottom: 16px;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 16px;
    }

    .form-row {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    
    }

    .form-row > .form-group {
        flex: 1;
        min-width: 0;
    }

    input,
    select {
        padding: 8px 10px;
        font-size: 14px;
        border: 1px solid var(--modal-input-border-color);
        border-radius: 6px;
        outline: none;
        transition: border 0.2s;
    }

    input:focus,
    select:focus {
        border-color: var(--modal-input-hover-border-color);
    }

    label {
        font-size: 13px;
        margin-bottom: 4px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-top: 12px;
    }

    button {
        padding: 10px 16px;
        border: 1px solid var(--modal-button-border-color);
        background: var(--modal-button-bg-color);
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
        color: var(--text-color);
    }

    button[type="submit"] {
        border-color: #007bff;
        color: #007bff;
    }

    button:hover {
        background: var(--modal-button-hover-bg-color);
    }

    .error {
        color: var(--error-text-color);
        font-size: 12px;
        margin-top: -10px;
        margin-bottom: 10px;
    }
</style>