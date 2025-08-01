export type ActivityType = 'mint' | 'transfer_out' | 'transfer_in' | 'sale'
export type ActivityStatus = 'completed' | 'pending' | 'failed'



export interface ActivityItem {
  id: string
  title: string
  description: string
  type: ActivityType
  status: ActivityStatus
  timestamp: string
  hash?: string
  network: string
  value?: string
  fromAddress?: string
  toAddress?: string
  assetId?: string
  collectionId?: string
}



export const activityGradients = {
  mint: "from-green-500 to-emerald-500",
  transfer_out: "from-blue-500 to-cyan-500",
  transfer_in: "from-purple-500 to-violet-500",
  sale: "from-orange-500 to-red-500",
} as const

export const activityColors = {
  mint: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  transfer_out: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  transfer_in: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  sale: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
} as const

export const statusColors = {
  completed: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  failed: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
} as const



export const typeLabels = {
  mint: "Minted",
  transfer_out: "Sent",
  transfer_in: "Received",
  sale: "Sales",
} as const