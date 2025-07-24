<template>
    <div>
        <slot name="loading" v-if="loading">
            <div class="default-loading">
                Loading
                <span class="dot dot1">.</span>
                <span class="dot dot2">.</span>
                <span class="dot dot3">.</span>
            </div>
        </slot>

        <slot name="error" v-else-if="error" :error="error">
            <p style="color: red;">Error: {{ error.message }}</p>
        </slot>

        <slot v-else :data="result">
            <pre>{{ result }}</pre>
        </slot>
    </div>
</template>

<script setup>
    import { ref, onMounted, watchEffect } from 'vue'

    const props = defineProps({
        fetchData: {
            type: Function,
            required: true
        }
    })

    const loading = ref(true)
    const result = ref(null)
    const error = ref(null)

    async function load() {
        loading.value = true
        error.value = null
        try {
            result.value = await props.fetchData()
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    onMounted(load)
</script>

<style scoped>
    .default-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 1.2rem;
        gap: 2px;
        margin-top: 20px;
    }

    .dot {
        display: inline-block;
        animation: bounce 1.2s infinite ease-in-out;
        font-size: 1.5rem;
    }

    .dot1 {
        animation-delay: 0s;
    }

    .dot2 {
        animation-delay: 0.2s;
    }

    .dot3 {
        animation-delay: 0.4s;
    }

    @keyframes bounce {
        0%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-6px);
        }
    }
</style>

