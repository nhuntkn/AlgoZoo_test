interface ProgressBarProps {
  value: number
  color?: string
  height?: string
}

export function ProgressBar({ value, color = 'bg-accent', height = 'h-1.5' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
