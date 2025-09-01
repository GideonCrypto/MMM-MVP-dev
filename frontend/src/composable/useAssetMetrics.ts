// @ts-ignore
export function useAssetMetrics(transactions: Transaction[], currentPrice: number) {
    const buyQueue: { price: number, quantity: number }[] = []
    let realizedProfit = 0

    for (const tx of transactions) {
        if (tx.type === 'buy') {
            buyQueue.push({ price: tx.price, quantity: tx.quantity })
        } else if (tx.type === 'sell') {
            let sellQty = tx.quantity
            while (sellQty > 0 && buyQueue.length > 0) {
                const lot = buyQueue[0]
                const qtyUsed = Math.min(lot.quantity, sellQty)
                const profit = qtyUsed * (tx.price - lot.price)
                realizedProfit += profit

                lot.quantity -= qtyUsed
                sellQty -= qtyUsed

                if (lot.quantity === 0) {
                    buyQueue.shift()
                }
            }
            if (sellQty > 0) {
                const profit = sellQty * tx.price
                realizedProfit += profit
                sellQty = 0
            }
        }
    }

    const remainingCoins = buyQueue.reduce((sum, lot) => sum + lot.quantity, 0)
    const currentValue = remainingCoins * currentPrice
    const remainingCostBasis = buyQueue.reduce((sum, lot) => sum + lot.price * lot.quantity, 0)
    const unrealizedProfit = currentValue - remainingCostBasis
    const totalProfit = realizedProfit + unrealizedProfit
    const totalInvested = transactions
        .filter(tx => tx.type === 'buy')
        .reduce((sum, tx) => sum + tx.price * tx.quantity, 0)
    const coinsBought = transactions
        .filter(tx => tx.type === 'buy')
        .reduce((sum, tx) => sum + tx.quantity, 0)
    const roiRaw = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0

    // 🔥 нормализация чисел
    const normalizeNumber = (num: number): string => {
        if (!isFinite(num)) return "0"

        let str = num.toString()
        if (str.includes("e")) {
            str = num.toFixed(30) // разворачиваем экспоненту
        }

        // "нормальные" числа → 2 знака после запятой
        if (Math.abs(num) >= 0.001) {
            return parseFloat(str).toFixed(2)
        }

        // очень маленькие числа → ищем первые значащие цифры после нулей
        const match = str.match(/0\.(0*)(\d+)/)
        if (match) {
            const zeros = match[1].length
            const digits = match[2].slice(0, 2) // только 2 цифры после нулей
            return `0.${"0".repeat(zeros)}${digits}`
        }

        return str
    }

    return {
        totalInvested: normalizeNumber(totalInvested),
        totalSold: normalizeNumber(
            transactions
                .filter(tx => tx.type === 'sell')
                .reduce((sum, tx) => sum + tx.price * tx.quantity, 0)
        ),
        coinsBought: normalizeNumber(coinsBought),
        coinsSold: normalizeNumber(
            transactions
                .filter(tx => tx.type === 'sell')
                .reduce((sum, tx) => sum + tx.quantity, 0)
        ),
        remainingCoins: normalizeNumber(remainingCoins),
        averageBuyPrice: totalInvested > 0 ? normalizeNumber(totalInvested / coinsBought) : "0",
        currentValue: normalizeNumber(currentValue),
        unrealizedProfit: normalizeNumber(unrealizedProfit),
        realizedProfit: normalizeNumber(realizedProfit),
        totalProfit: normalizeNumber(totalProfit),
        roi: `${normalizeNumber(roiRaw)}%`,
        roiRaw: roiRaw, // сырое значение для вычислений
    }
}
