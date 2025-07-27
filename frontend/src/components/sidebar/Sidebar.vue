<template>
    <div class="sidebar-main-container">
        <div class="sidebar-item-container">
            <h2>Money Movement Monitor</h2>
        </div>
        <div class="sidebar-item-container routes">
            <ul>
                <li v-for="item in listItems" :key="item.id">
                    <router-link :to="item.path" class="router-link-wrapper">
                        <ListItem
                        :text="item.text"
                        :is-active="activePath === item.path"
                        />
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="sidebar-item-container bottom">
            <button class="db-btn" @click="importDB">Import DB</button>
            <button class="db-btn" @click="exportDB">Export DB</button>
        </div>
        <div class="sidebar-item-container">
            <ToggleBtn
                v-for="toggle in toggles"
                :key="toggle.id"
                v-model="toggle.model"
                :text="toggle.text"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import ToggleBtn from '@/ui/common/ToggleButton.vue'
    import ListItem from '@/ui/common/NavListItem.vue'
    import { useRoute } from 'vue-router'
    import { api } from '@/components/api/api.ts'

    const toggles = ref([
        { id: 0, model: ref(false), text: { first: 'Dark', second: 'Light' } },
        { id: 1, model: ref(true), text: { first: 'Ru', second: 'En' } }
    ])

    const listItems = [
        { id: 0, text: 'Dashboard', path: '/' },
        { id: 1, text: 'Portfolio', path: '/portfolio' },
        { id: 2, text: 'Market', path: '/market' },
        { id: 3, text: 'About', path: '/about' }
    ]

    const route = useRoute()

    const activePath = computed(() => route.path)

    const loading = ref(true)
    const error = ref(null)

    const importDB = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('database/import')
            alert(response.data.message)
        } catch (err) {
            error.value = err.message || 'Request failed'
        } finally {
            loading.value = false
        }
    }

    const exportDB = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await api.get('/database/export')
            alert(response.data.message)
        } catch (err) {
            error.value = err.message || 'Request failed'
        } finally {
            loading.value = false
        }
    }
</script>

<style scoped>
    .sidebar-main-container{
        background: #000;
        height: 100vh;
        width: 20vw;
        min-width: 250px;
        color: greenyellow;
        display: flex;
        flex-direction: column;
        padding: 2vh 0;
        text-align: left;
    }

    .sidebar-item-container{
        display: flex;
        align-items: center;
        justify-content: left;
        font-size: 24px;
        padding-left: 3vw;
    }

    .routes {
        padding-top: 10vh;
        text-align: left;
    }
    
    li {
        padding: 2vh 0;
    }

    .bottom {
        margin-top: auto;
        justify-content: left;
    }

    .db-btn {
        width: 80px;
        height: 32px;
        border: 1px solid greenyellow;
        color: greenyellow;
        background-color: black;
        border-radius: 5px;
        margin: 5px 5px 5px 0;
    }

    .db-btn:hover {
        background-color: #222;
    }
</style>
