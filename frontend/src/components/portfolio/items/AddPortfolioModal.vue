<template>
    <div class="modal-overlay">
        <div class="modal">
            <form @submit.prevent="handleSubmit">
                <h2>{{ isToggleRemovePortfolio ? 'Delete portfolio' : 'Add portfolio' }}</h2>

                <div class="form-group"  v-show="!isToggleRemovePortfolio">
                    <label>Name</label>
                    <input type="text" v-model="form.name" />
                </div>

                <div class="form-group" v-show="!isToggleRemovePortfolio">
                        <label>Date</label>
                        <input type="date" v-model="form.date" />
                </div>

                <div class="form-group"  v-show="isToggleRemovePortfolio">
                    <label>Portfolio</label>
                    <select v-model="form.portfolio">
                        <option disabled value="">Select</option>
                        <option v-for="name in portfolioNames" :key="name" :value="name.id">
                            {{ name.name }}
                        </option>
                    </select>
                </div>

                <p class="error" v-if="error">{{ error }}</p>

                <div class="buttons">
                    <button type="submit"  v-if="!isToggleRemovePortfolio">Add portfolio</button>
                    <button type="button" @click="handleDelete" v-if="isToggleRemovePortfolio">Delete</button>
                    <button type="button" @click="hideMenu">Close window</button>
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
    import { api } from '@/components/api/api.ts'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'

    // ----------------------------------store
    const transactionsStore = useTransactionsStore()

    onMounted(() => {
        transactionsStore.getPortfolios()
    })

    const portfolioNames = computed(() => transactionsStore.portfolioNames)
    
    const toggler = usePageToggler()
    const { toggleAddPortfolio, toggleRemovePortfolio, portfolioToRemove } = storeToRefs(toggler)

    const isToggleAddPortfolio = computed(() => toggleAddPortfolio.value)
    const isToggleRemovePortfolio = computed(() => toggleRemovePortfolio.value)
    // ----------------------------------
    const error = ref(null)

    const form = ref({
        name: '',
        date: '',
    })

    function hideMenu() {
        if (isToggleRemovePortfolio.value && !isToggleAddPortfolio.value) {
            toggler.toggleCountRemovePortfolio()
        } else {
            toggler.toggleCountAddPortfolio()
        }

        for (const key in form.value) {
            form.value[key] = ''
        }
        error.value = null

        transactionsStore.getPortfolios()
    }

    async function handleSubmit() {
        error.value = null

        if (isToggleAddPortfolio.value) {//for add
            if (!form.value.name) {
                error.value = 'Enter name'
                return
            }

            if (!form.value.date) {
                error.value = 'Enter date'
                return
            }
        } else {//for remove
            if (!form.value.portfolio) {
                error.value = 'Choose portfolio'
                return
            }
        }

        const isoDate = new Date(form.value.date).toISOString();
        const data = {
            ...form.value,
            date: isoDate
        }
        try {
            const response = await api.post('portfolioData/createPortfolio', {
                name: data.name,
                createdAt: data.date,
                userId: 6
            })
        } catch (error) {
            console.error('Create portfolio error: ' + error.message)
        }
        
        hideMenu()
        return data
    }

    async function handleDelete() {
        if (form.value.portfolio) {
            try {
                const response = await api.delete(`portfolioData/${form.value.portfolio}`)
            } catch (error) {
                console.error('Create portfolio error: ' + error.message)
            }
        }
        
        hideMenu()
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

    button:first-child {
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