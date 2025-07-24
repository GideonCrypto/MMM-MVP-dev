<template>
    <div>
        <span>Last updated: {{ lastUpdated }}</span>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
    import { computed, ref } from 'vue'
    import { useFetch } from '@vueuse/core'
    import { Bar } from 'vue-chartjs'
    import {
        Chart as ChartJS,
        BarElement,
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
    } from 'chart.js'

    ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

    const { data } = useFetch('https://api.alternative.me/fng/?limit=1').get().json()

    const currentValue = computed(() => Number(data.value?.data?.[0]?.value ?? 0))

    const lastUpdated = computed(() => {
        const ts = data.value?.data?.[0]?.timestamp
        return ts ? new Date(+ts * 1000).toLocaleString() : 'n/a'
    })

    const chartData = computed(() => ({
        labels: [''],
        datasets: [
                { label: 'Extreme Fear', data: [20], backgroundColor: 'darkred', stack: 'index' },
                { label: 'Fear', data: [20], backgroundColor: 'red', stack: 'index' },
                { label: 'Neutral', data: [20], backgroundColor: 'orange', stack: 'index' },
                { label: 'Greed', data: [20], backgroundColor: 'lightgreen', stack: 'index' },
                { label: 'Extreme Greed', data: [20], backgroundColor: 'green', stack: 'index' },
                {
                    label: 'Current Value',
                    data: [currentValue.value],
                    backgroundColor: 'black',
                    type: 'bar',
                    stack: null,
                    barThickness: 6,
                },
            ],
    }))

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: true, position: 'bottom' },
        },
        scales: {
            x: { stacked: true, min: 0, max: 100 },
            y: { stacked: true },
        },
    }
</script>

<style scoped>
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    span {
        font-size: 10px;
        margin-top: 0.5rem;
    }
</style>
