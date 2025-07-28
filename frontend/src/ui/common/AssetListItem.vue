<template>
    <li
        class="list-item"
    >
        <VueCryptocurrencyIcons :name='name' width='25px'/>
        <span>{{ name }}</span>
        <span>{{ price }}</span>
        <span>{{ change }}</span>
    </li>
</template>

<script setup>
    defineProps({
        name: String,
        price: Number | String,
        change: Number | String
    })
    defineEmits(['select'])
</script>

<style scoped>
    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
