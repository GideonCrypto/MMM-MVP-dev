interface Transaction {
    id: number
    name: string
    price: number
    quantity: number
    type: 'buy' | 'sell'
    portfolio: string
}

function round(value: number): number {
    return Math.round(value * 100) / 100
}

export function useAssetMetrics(transactions: Transaction[], currentPrice: number) {
    const totalInvested = transactions
        .filter(tx => tx.type === 'buy')
        .reduce((sum, tx) => sum + tx.price * tx.quantity, 0)

    const totalSold = transactions
        .filter(tx => tx.type === 'sell')
        .reduce((sum, tx) => sum + tx.price * tx.quantity, 0)

    const coinsBought = transactions
        .filter(tx => tx.type === 'buy')
        .reduce((sum, tx) => sum + tx.quantity, 0)

    const coinsSold = transactions
        .filter(tx => tx.type === 'sell')
        .reduce((sum, tx) => sum + tx.quantity, 0)

    const remainingCoins = coinsBought - coinsSold
    const averageBuyPrice = coinsBought > 0 ? totalInvested / coinsBought : 0
    const unrealizedProfit = remainingCoins * (currentPrice - averageBuyPrice)
    const realizedProfit = totalSold - (coinsSold * averageBuyPrice)
    const totalProfit = realizedProfit + unrealizedProfit
    const currentValue = remainingCoins * currentPrice

    return {
        totalInvested: round(totalInvested),           // all buy transactions (body)
        totalSold: round(totalSold),                   // all sell transactions (body)
        coinsBought: round(coinsBought),               // all buy coins
        coinsSold: round(coinsSold),                   // all coin sold
        remainingCoins: round(remainingCoins),         // not sold coins
        averageBuyPrice: round(averageBuyPrice),       // average buy price
        unrealizedProfit: round(unrealizedProfit),     // profit if sell now
        realizedProfit: round(realizedProfit),         // from already sold coins
        totalProfit: round(totalProfit),               // realized + unrealized
        currentValue: round(currentValue),             // remaining coin in USDT
    }
}
