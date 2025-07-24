<template>
    <div class="portfolio-container">
        <h4>Total portfolio value {{ totalValue.toLocaleString() }} $</h4>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { Bar } from 'vue-chartjs'
    import {
        Chart as ChartJS,
        BarElement,
        Tooltip,
        Legend,
        Title,
        CategoryScale,
        LinearScale,
    } from 'chart.js'

    ChartJS.register(BarElement, Tooltip, Legend, Title, CategoryScale, LinearScale)

    const portfolio = ref([
        { name: 'Bitcoin', value: 5000 },
        { name: 'Ethereum', value: 3000 },
        { name: 'Solana', value: 2000 },
        { name: 'Cardano', value: 1000 },
        { name: 'Polkadot', value: 800 },
        { name: 'Other Coin', value: 200 },
    ])

    const topAssets = computed(() => {
        const sorted = [...portfolio.value].sort((a, b) => b.value - a.value)
        const top = sorted.slice(0, 5)
        const others = sorted.slice(5)
        const otherSum = others.reduce((acc, cur) => acc + cur.value, 0)
        if (otherSum > 0) {
            top.push({ name: 'Other', value: otherSum })
        }
        return top
    })

    function generateColors(n) {
        return Array.from({ length: n }, () =>
            `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
        )
    }

    const chartData = computed(() => {
        const labels = topAssets.value.map(a => a.name)
        const data = topAssets.value.map(a => a.value)
        const backgroundColors = generateColors(labels.length)

        return {
            labels,
            datasets: [
            {
                label: 'Portfolio Value ($)',
                data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
            },
            ],
        }
    })

    const totalValue = computed(() =>
        portfolio.value.reduce((sum, item) => sum + item.value, 0)
    )

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                    const label = context.label || ''
                    const value = context.parsed.y
                    return `${label}: $ ${value.toLocaleString()}`
                    },
                },
            }
        },
    }
</script>

<style scoped>
    .portfolio-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;
    }

    canvas {
        height: auto !important;
        display: block;
        margin: auto;
    }

    h4 {
        margin-bottom: 1rem;
    }
</style>
