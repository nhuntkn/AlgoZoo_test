interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  color?: string
}

export function StatCard({ label, value, icon, trend, color = 'bg-accent/10' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className="text-xs text-gray-400">{trend}</p>
      )}
    </div>
  )
}
