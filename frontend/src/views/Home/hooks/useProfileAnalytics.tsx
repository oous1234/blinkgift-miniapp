import { useMemo } from "react"
import { GiftItem } from "../data"

export const useProfileAnalytics = (inventory: GiftItem[]) => {
  return useMemo(() => {
    let totalValue = 0
    let totalInvested = 0
    let itemCount = 0
    let bestPerformer = { name: "None", profit: -Infinity }

    inventory.forEach((item) => {
      const itemValue = item.floorPrice * item.quantity
      const itemCost = item.purchasePrice * item.quantity
      const profit = itemValue - itemCost

      totalValue += itemValue
      totalInvested += itemCost
      itemCount += item.quantity

      if (profit > bestPerformer.profit) {
        bestPerformer = { name: item.name, profit }
      }
    })

    const totalPnL = totalValue - totalInvested
    const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

    return { totalValue, totalPnL, pnlPercent, itemCount, bestPerformer }
  }, [inventory])
}