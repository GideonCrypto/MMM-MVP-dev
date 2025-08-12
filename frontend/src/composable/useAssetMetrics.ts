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

    // функция округления до 3 знаков
    const round3 = (num: number) => Math.round(num * 1000) / 1000

    return {
        totalInvested: round3(totalInvested),
        totalSold: round3(
            transactions
                .filter(tx => tx.type === 'sell')
                .reduce((sum, tx) => sum + tx.price * tx.quantity, 0)
        ),
        coinsBought: round3(coinsBought),
        coinsSold: round3(
            transactions
                .filter(tx => tx.type === 'sell')
                .reduce((sum, tx) => sum + tx.quantity, 0)
        ),
        remainingCoins: round3(remainingCoins),
        averageBuyPrice: totalInvested > 0 ? round3(totalInvested / coinsBought) : 0,
        currentValue: round3(currentValue),
        unrealizedProfit: round3(unrealizedProfit),
        realizedProfit: round3(realizedProfit),
        totalProfit: round3(totalProfit),
        roi: `${round3(roiRaw)}%`,
        roiRaw: round3(roiRaw),
    }
}
