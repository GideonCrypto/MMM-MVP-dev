<template>
    <li class="list-item">
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
        display: grid;
        grid-template-columns: 1fr 1fr 1fr ;
        height: 100%;
        border: 2px solid var(--border-color);
        border-bottom: none;
    }

    span {
        display: flex;
        justify-content: center;
        align-items: center;
        border-left: 2px solid var(--border-color);
    }

    span:first-child {
        border: none;
    }
</style>