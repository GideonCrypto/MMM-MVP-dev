<template>
    <div v-if="!login">
        <Login/>
    </div>
    <div v-else class="main-container">
        <Sidebar />
        <router-view />
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
    import Sidebar from '@/components/sidebar/Sidebar.vue';
    // @ts-ignore
    import Login from '@/components/login/LoginPage.vue';
    // @ts-ignore
    import { useLoginStore } from '@/store/useLoginStore';
    import { storeToRefs } from 'pinia';

    const store = useLoginStore();
    const { login } = storeToRefs(store);
</script>

<style>
    .main-container {
        display: flex;
    }
</style>