<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { Line } from 'vue-chartjs'
    import {
        Chart as ChartJS,
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
        Tooltip,
        Legend,
        Filler,
    } from 'chart.js'
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { storeToRefs } from 'pinia'

    const TransactionsStore = useTransactionsStore()
    const { allTransactions,
            allAssets,
            selectedAsset,
            assetTransactions,
            assetAnalitics } = storeToRefs(TransactionsStore)

    ChartJS.register(
        LineElement,
        CategoryScale,
        LinearScale,
        PointElement,
        Tooltip,
        Legend,
        Filler
    )

    const formatDate = ts => {
        const d = new Date(ts * 1000)
        return d.toLocaleDateString('en-GB')
    }


    const cumulativeData = computed(() => {
        const sorted = [...allTransactions.value].sort((a, b) => a.timestamp - b.timestamp)

        const dailyMap = new Map()
        let total = 0

        for (const tx of sorted) {
            const day = formatDate(tx.timestamp)
            const delta = tx.type === 'buy' ? tx.amount : -tx.amount
            if (!dailyMap.has(day)) {
                dailyMap.set(day, 0)
            }
            dailyMap.set(day, dailyMap.get(day) + delta)
        }

        const result = []
        const uniqueDays = Array.from(dailyMap.keys()).sort((a, b) => new Date(a) - new Date(b))

        for (const day of uniqueDays) {
            total += dailyMap.get(day)
            result.push({ date: day, value: total })
        }

        return result
    })

    const chartData = computed(() => {
        const labels = cumulativeData.value.map(entry => entry.date)
        const data = cumulativeData.value.map(entry => entry.value)

        return {
            labels,
            datasets: [
                {
                    label: 'Portfolio Value ($)',
                    data,
                    fill: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    pointBackgroundColor: 'white',
                    pointRadius: 4,
                },
            ],
        }
    })

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
                legend: { display: true },
                tooltip: {
                callbacks: {
                    label: context => `$ ${context.parsed.y.toLocaleString()}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: (ctx) => {
                        const i = ctx.index
                        const current = cumulativeData.value[i]?.value
                        const prev = cumulativeData.value[i - 1]?.value ?? current
                        return current > prev ? 'green' : current < prev ? 'red' : 'gray'
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `$ ${value}`,
                },
            },
        },
    }
</script>

<style scoped>

</style>
