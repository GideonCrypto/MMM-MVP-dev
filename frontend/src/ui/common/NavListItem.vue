<template>
    <li class="list-item" :class="{ active: isActive }">
        {{ text }}
    </li>
</template>

<script setup>
    defineProps({
        text: String,
        isActive: Boolean
    })
</script>

<style scoped>
    .list-item {
        padding: 10px 16px;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 6px;
        transition: all 0.3s ease;
    }

    .list-item:hover {
        transform: translateX(15px);
    }

    .list-item.active {
        border-color: greenyellow;
        background-color: #222;
    }
</style>
