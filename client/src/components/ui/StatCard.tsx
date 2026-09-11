interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  color?: string
}

export function StatCard({ label, value, icon, color = 'text-gray-800' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {icon && <div className="text-gray-400 mb-2">{icon}</div>}
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
