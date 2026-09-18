import { useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

export type ToastVariant = 'success' | 'error'

interface ToastProps {
  message: string
  variant?: ToastVariant
  onClose: () => void
  duration?: number
}

export function Toast({ message, variant = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  const isSuccess = variant === 'success'

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      <div
        className={`flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl shadow-lg border bg-white text-sm font-medium ${
          isSuccess ? 'border-green-100 text-green-700' : 'border-red-100 text-red-600'
        }`}
      >
        {isSuccess ? (
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        ) : (
          <XCircle size={16} className="text-red-500 flex-shrink-0" />
        )}
        {message}
        <button onClick={onClose} className="ml-1 text-gray-300 hover:text-gray-500 text-xs">✕</button>
      </div>
    </div>
  )
}
