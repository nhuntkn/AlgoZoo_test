import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<string, string> = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: 'border border-accent text-accent hover:bg-red-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'border border-red-500 text-red-600 hover:bg-red-50',
  success: 'bg-green-600 hover:bg-green-700 text-white',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
