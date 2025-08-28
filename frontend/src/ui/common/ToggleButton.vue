<template>
    <button @click="$emit('click')" class="toggle-button">
        <transition name="fade-slide" mode="out-in">
        <span :key="modelValue">
            {{ modelValue ? text.first : text.second }}
        </span>
        </transition>
    </button>
</template>

<script setup>
    defineEmits(['click'])
    const modelValue = defineModel()
    const props = defineProps({
    text: Object
    })
</script>

<style scoped>
    .toggle-button {
        width: 80px;
        height: 32px;
        background: #000;
        color: greenyellow;
        border: 1px solid greenyellow;
        font-weight: bold;
        font-size: 14px;
        border-radius: 6px;
        transition: background 0.3s, color 0.3s;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 5px;
    }

    /* Анимация текста */
    .fade-slide-enter-active,
    .fade-slide-leave-active {
        transition: all 0.3s ease;
        display: inline-block;
        position: absolute;
    }

    .fade-slide-enter-from {
        opacity: 0;
        transform: translateY(10px);
    }

    .fade-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }
</style>
