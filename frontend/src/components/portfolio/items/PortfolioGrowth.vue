<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
    import { computed } from 'vue'
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

    // ------------------------------------- store
    import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
    import { usePageToggler } from '@/store/usePageToggler.ts'
    import { storeToRefs } from 'pinia'
    import { i18n } from '../../../locales/i18n'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n()
    // -------------------------------------store
    const toggler = usePageToggler()
    const { toggle } = storeToRefs(toggler)

    const TransactionsStore = useTransactionsStore()
    const {
        allTransactions,
        allAssets,
        selectedAsset,
        selectedAssetTransactionsFormatted,
        filteredAllTransactions,
    } = storeToRefs(TransactionsStore)
    // -------------------------------------

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
        let sorted = []

        if (!toggle.value) {
            sorted = [...filteredAllTransactions.value].sort((a, b) => a.timestamp - b.timestamp)
        } else {
            sorted = [...selectedAssetTransactionsFormatted.value].sort((a, b) => a.timestamp - b.timestamp)
        }

        const dailyMap = new Map()
        const typeMap = new Map()
        let total = 0

        for (const tx of sorted) {
            const day = formatDate(tx.timestamp)

            if (tx.type !== 'buy' && tx.type !== 'sell') continue // skip all except buy/sell

            const delta = tx.type === 'buy' ? tx.amount : -tx.amount

            if (!dailyMap.has(day)) {
                dailyMap.set(day, 0)
            }

            dailyMap.set(day, dailyMap.get(day) + delta)
            typeMap.set(day, tx.type) // save lust type
        }

        const result = []
        const uniqueDays = Array.from(dailyMap.keys()).sort((a, b) => new Date(a) - new Date(b))

        for (const day of uniqueDays) {
            total += dailyMap.get(day)
            const type = typeMap.get(day)

            result.push({ date: day, value: total, type })
        }

        return result
    })

    const chartData = computed(() => {
        const labels = cumulativeData.value.map(entry => entry.date)
        const data = cumulativeData.value.map(entry => entry.value)

        const pointBackgroundColor = cumulativeData.value.map(entry =>
            entry.type === 'buy' ? 'green' : 'red'
        )

        const pointRadius = new Array(cumulativeData.value.length).fill(4)

        return {
            labels,
            datasets: [
                {
                    label: t('portfolio.graph.title'),
                    data,
                    fill: true,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    pointBackgroundColor,
                    pointRadius,
                    pointBorderColor: pointBackgroundColor,
                    pointBorderWidth: 2,
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
                    label: (context) => {
                        const entry = cumulativeData.value[context.dataIndex]
                        const type = entry.type === 'buy' ? 'Buy (cash in)' : 'Sell (cash out)'
                        const value = context.parsed.y.toLocaleString()
                        return `${type}: $${value}`
                    }
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
