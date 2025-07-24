import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/dashboard/Dashboard.vue'
import Portfolio from '@/components/portfolio/Portfolio.vue'
import Market from '@/components/market/MarketPage.vue'
import About from '@/components/about/About.vue'

const routes = [
        {
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/portfolio',
            name: 'Portfolio',
            component: Portfolio
        },
        ,
        {
            path: '/market',
            name: 'Market',
            component: Market
        },
        {
            path: '/about',
            name: 'About',
            component: About
        },
    ]

    const router = createRouter({
        history: createWebHistory(),
        routes
    })

export default router
