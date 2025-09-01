<template>
  <div v-if="isPortfolioReady" class="portfolio-container">
    <h4>{{t('dashboard.totalAssetVal')}} {{ totalValue.toLocaleString() }} $</h4>
    <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
  <div v-else>{{t('dashboard.loading')}}</div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
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
  import { useTransactionsStore } from '@/store/useTransactionsStore.ts'
  import { storeToRefs } from 'pinia'
  import { i18n } from '../../../locales/i18n'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  ChartJS.register(BarElement, Tooltip, Legend, Title, CategoryScale, LinearScale)

  const store = useTransactionsStore()
  const { portfolio } = storeToRefs(store)

  const isPortfolioReady = computed(() =>
    Array.isArray(portfolio.value) && portfolio.value.length > 0
  )

  const totalValue = computed(() =>
    isPortfolioReady.value
      ? portfolio.value.reduce((sum, item) => sum + Number(item.value), 0)
      : 0
  )

  function generateColors(n) {
    return Array.from({ length: n }, () =>
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    )
  }

  const chartKey = ref(0)

  const chartData = computed(() => {
    if (!portfolio.value || portfolio.value.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    const labels = portfolio.value.map(item => item.name)
    const data = portfolio.value.map(item => item.value)
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


  watch(
    portfolio,
    () => {
      chartKey.value++
    },
    { deep: true }
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
            return `${label}: $${value.toLocaleString()}`
          },
        },
      },
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
