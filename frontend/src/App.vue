<script setup lang="ts">
    import Sidebar from '@/components/sidebar/Sidebar.vue'
</script>

<template>
    <div class="main-container">
        <Sidebar />
        <router-view />
    </div>
</template>

<style>
    .main-container {
        display: flex;
    }
</style>