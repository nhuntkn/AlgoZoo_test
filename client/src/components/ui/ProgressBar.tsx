interface ProgressBarProps {
  value: number
  color?: string
  height?: string
}

export function ProgressBar({ value, color = 'bg-accent', height = 'h-2' }: ProgressBarProps) {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height}`}>
      <div
        className={`${color} ${height} rounded-full transition-all`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
