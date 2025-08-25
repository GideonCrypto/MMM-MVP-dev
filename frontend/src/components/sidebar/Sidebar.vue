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
                        :textKey="item.textKey"
                        :is-active="activePath === item.path"
                    />
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="sidebar-item-container bottom">
            <button class="db-btn" @click="importDB">{{t('sidebar.import')}}</button>
            <button class="db-btn" @click="exportDB">{{t('sidebar.export')}}</button>
        </div>
        <div class="sidebar-item-container">
            <ToggleBtn
                v-model="toggler.toggleTheme"
                :text="{ first: t('sidebar.themeD'), second: t('sidebar.themeL') }"
                @click="toggler.toggleThemeType"
            />
            <ToggleBtn
                v-model="toggler.isRu"
                :text="{ first: 'Ru', second: 'En' }"
                @click="toggler.toggleLocale"
            />
        </div>
        <div class="sidebar-item-container">
            <button class="db-btn log-out-btn" @click="logOut">{{t('sidebar.logout')}}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    // @ts-ignore
    import ToggleBtn from '@/ui/common/ToggleButton.vue'
    // @ts-ignore
    import ListItem from '@/ui/common/NavListItem.vue'
    import { useRoute } from 'vue-router'
    // @ts-ignore
    import { api } from '@/components/api/api.ts'
    // @ts-ignore
    import { useLoginStore } from '@/store/useLoginStore.ts'
    // @ts-ignore
    import { storeToRefs } from "pinia";
    // @ts-ignore
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { i18n } from '../../locales/i18n'
    import { useI18n } from 'vue-i18n'

    // ---------------------store
    // login store
    const store = useLoginStore()
    const { removeUserFromLS } = store
    //toggler store
    const toggler = usePageToggler()
    
    const { t } = useI18n()
    // ---------------------
    // ---------------------common
    const listItems = [
        { id: 0, textKey: 'sidebar.dashboard', path: '/' },
        { id: 1, textKey: 'sidebar.portfolio', path: '/portfolio' },
        { id: 2, textKey: 'sidebar.market', path: '/market' },
        { id: 3, textKey: 'sidebar.about', path: '/about' }
    ]

    const route = useRoute()

    const activePath = computed(() => route.path)

    // --------------------- DB
    const loading = ref(true)
    const error = ref(null)
    
    const importDB = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await api.post('database/import')
            alert(response.data.message)
        } catch (err) {
            // @ts-ignore
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
            // @ts-ignore
            error.value = err.message || 'Request failed'
        } finally {
            loading.value = false
        }
    }

    // ---------------------
    // --------------------- Log out
    const logOut = () => {
        removeUserFromLS()//log out (rm user from LS)
        // @ts-ignore
        window.electronAPI.reloadApp();//reload app and move too dashboard (for electron app)
        // window.location.href = '/'//reload app and move too dashboard
    }
    // ---------------------
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

    .log-out-btn {
        width: 165px;
    }
</style>
