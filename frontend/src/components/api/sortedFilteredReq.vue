<script>
    import { ref, reactive, watch, computed } from 'vue'
    import { api } from './api.ts'

    export function useTableData({
            url,
            initialFilters = {},
            defaultSort = { orderBy: 'id', orderDirection: 'asc' },
        }) {
        const data = ref([])
        const total = ref(0)
        const loading = ref(false)
        const error = ref(null)

        const page = ref(1)
        const limit = ref(10)
        
        const originalFilters = {
            ...initialFilters,
            ...defaultSort,
        }// nead for reset

        const filters = reactive({ ...originalFilters })

        const loadData = async () => {
            loading.value = true
            error.value = null
            try {
                const response = await api.get(url, {
                    params: {
                        page: page.value,
                        limit: limit.value,
                        ...filters,
                    },
                })
                data.value = response.data.data
                total.value = response.data.total
            } catch (err) {
                error.value = err
                console.error('Load data error', err)
            } finally {
                loading.value = false
            }
        }
        
        watch(
            [
                () => filters.name,
                () => filters.marketCap,
                () => filters.orderBy,
                () => filters.orderDirection,
                page,
                limit,
            ],
            loadData,
            { immediate: true }
        )// autoload for filters/pages
        
        const resetSorting = () => {
            Object.keys(originalFilters).forEach((key) => {
            filters[key] = originalFilters[key]
            })
            page.value = 1
        }// reset all data

        const totalPages = computed(() => Math.ceil(total.value / limit.value))

        return {
            data,
            total,
            loading,
            error,
            page,
            limit,
            filters,
            loadData,
            resetSorting,
            totalPages,
        }
    }
</script>