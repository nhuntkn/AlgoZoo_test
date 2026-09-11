interface BadgeProps {
  variant: string
  children: React.ReactNode
}

const styles: Record<string, string> = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
  'not-started': 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-green-100 text-green-700',
  'needs-revision': 'bg-red-100 text-red-700',
  'awaiting-review': 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  disabled: 'bg-gray-100 text-gray-500',
  'role-student': 'bg-blue-100 text-blue-700',
  'role-trainer': 'bg-purple-100 text-purple-700',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[variant] || 'bg-gray-100 text-gray-600'}`}>
      {children}
    </span>
  )
}

export function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'not-started': 'bg-gray-400',
    submitted: 'bg-blue-500',
    reviewed: 'bg-green-500',
    'needs-revision': 'bg-red-500',
    'awaiting-review': 'bg-yellow-500',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-gray-400'} mr-1.5`} />
}
