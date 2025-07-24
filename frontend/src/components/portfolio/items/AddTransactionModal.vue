<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal">
            <form @submit.prevent="handleSubmit">
            <h2>{{ isToggleUpdateItem ? 'Update Transaction' : 'Add Transaction' }}</h2>

            <div class="form-group">
                <label>Name</label>
                <input type="text" v-model="form.name" />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Price</label>
                    <input type="number" v-model="form.price" />
                </div>
                <div class="form-group">
                    <label>Total value</label>
                    <input type="number" v-model="form.totalValue" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Total coins</label>
                    <input type="number" v-model="form.totalCoins" />
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" v-model="form.date" />
                </div>
            </div>

            <div class="form-group">
                <label>Portfolio</label>
                <select v-model="form.portfolio">
                    <option disabled value="">Select</option>
                    <option value="Main">Main</option>
                    <option value="Test">Test</option>
                    <option value="Test 2">Test 2</option>
                </select>
            </div>

            <div class="form-group">
                <label>Type</label>
                <select v-model="form.type">
                    <option disabled value="">Select</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </div>

            <p class="error" v-if="error">{{ error }}</p>

            <div class="buttons">
                <button type="submit">{{ isToggleUpdateItem ? 'Update Transaction' : 'Add Transaction' }}</button>
                <button type="button"  @click="hideMenu" v-if="toggleUpdateItem">Delete</button>
                <button type="button" @click="hideMenu">Close window</button>
            </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch } from "vue"
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { storeToRefs } from 'pinia'
    import { computed } from 'vue'
    

    const toggler = usePageToggler()
    const { toggleAddItem, toggleUpdateItem, transactionToUpdate } = storeToRefs(toggler)

    const isToggleAddItem = computed(() => toggleAddItem.value)
    const isToggleUpdateItem = computed(() => toggleUpdateItem.value)

    const error = ref(null)

    const form = ref({
        name: '',
        price: '',
        totalValue: '',
        totalCoins: '',
        date: '',
        portfolio: '',
        type: ''
    })

    watch(toggleUpdateItem, (val) => {
        if (val) {
            form.value = {
            ...transactionToUpdate.value,
            date: new Date(transactionToUpdate.value.date).toISOString().split('T')[0]
            }
        }
    })

    function hideMenu() {
        if (toggleUpdateItem.value && !toggleAddItem.value) {
            toggler.toggleUpdateItem = !toggleUpdateItem
            form.value = {
                name: '',
                price: '',
                totalValue: '',
                totalCoins: '',
                date: '',
                portfolio: '',
                type: ''
            }
        } else {
            toggler.toggleCountAddItem()
        }

        for (const key in form.value) {
            form.value[key] = ''
        }
        error.value = null
    }

    function handleSubmit() {
        error.value = null

        if (!form.value.name) {
            error.value = 'Enter name'
            return
        }

        const price = Number(form.value.price)
        const totalValue = Number(form.value.totalValue)
        const totalCoins = Number(form.value.totalCoins)

        if (isNaN(price)) {
            error.value = 'Enter price'
            return
        }

        if (isNaN(totalValue) || totalValue <= 0) {
            error.value = 'Total value must be greater than 0'
            return
        }

        if (isNaN(totalCoins) || totalCoins <= 0) {
            error.value = 'Total coins must be greater than 0'
            return
        }


        if (!form.value.date) {
            error.value = 'Enter date'
            return
        }

        if (!form.value.portfolio) {
            error.value = 'Choose portfolio'
            return
        }

        if (!form.value.type) {
            error.value = 'Choose type'
            return
        }

        const timestamp = new Date(form.value.date).getTime()
        const data = {
            ...form.value,
            date: timestamp
        }

        hideMenu()
        return data
    }
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
        background: white;
        padding: 24px;
        border-radius: 12px;
        width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
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
        border: 1px solid #ccc;
        border-radius: 6px;
        outline: none;
        transition: border 0.2s;
    }

    input:focus,
    select:focus {
        border-color: black;
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
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.2s;
    }

    button[type="submit"] {
        border-color: #007bff;
        color: #007bff;
    }

    button:hover {
        background: #f4f4f4;
    }

    .error {
        color: red;
        font-size: 12px;
        margin-top: -10px;
        margin-bottom: 10px;
    }
</style>