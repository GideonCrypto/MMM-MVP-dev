export async function useLocalCache<T>({
        key,
        ttl,
        fetcher
    }: {
        key: string
        ttl: number // mls
        fetcher: () => Promise<T>
    }): Promise<T> {
    const cachedRaw = localStorage.getItem(key)

    if (cachedRaw) {
        try {
            const cached = JSON.parse(cachedRaw)
            const now = Date.now()

            if (now - cached.timestamp < ttl) {
                return cached.data as T
            }
        } catch (e) {
            console.warn('⚠️ Cache reading error', e)
            localStorage.removeItem(key)
        }
    }

    const data = await fetcher()
    localStorage.setItem(
            key,
            JSON.stringify({
            timestamp: Date.now(),
            data
        })
    )

    return data
}
// expl usage
    // const listItemsApiTop = ref([])

    // const loadingApi = ref(true)
    // const errorApi = ref(null)

    // const getTopFromApi = async () => {
    //     try {
    //         const data = await useLocalCache({
    //             key: 'marketDataTop',
    //             ttl: 5 * 60 * 1000, // 5 min
    //             fetcher: async () => {
    //                 console.log('⏳ Fetch to API') 
    //                 const response = await api.get('marketData/top')
    //                 return response.data.slice(0, 5).map((item, index) => ({
    //                     id: index,
    //                     name: item.name,
    //                     price: Number(item.current_price.toFixed(4)),
    //                     change: Number(item.price_change_24h.toFixed(4))
    //                 }))
    //             }
    //         })

    //         listItemsApiTop.value = data
            
    //     } catch (err) {
    //         errorApi.value = err.message || 'Request failed'
    //     } finally {
    //         loadingApi.value = false
    //     }
    // } 

    // onMounted(() => {
    //     getTopFromApi()
    // })