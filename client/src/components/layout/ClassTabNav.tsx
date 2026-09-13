import { Link, NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '../ui/Badge'

interface Tab {
  label: string
  to: string
}

interface Crumb {
  label: string
  to?: string
}

interface ClassTabNavProps {
  crumbs: Crumb[]
  title: string
  status?: 'ACTIVE' | 'INACTIVE'
  tabs: Tab[]
}

export function ClassTabNav({ crumbs, title, status, tabs }: ClassTabNavProps) {
  const backCrumb = crumbs.find((c) => c.to)

  return (
    <div className="mb-6">
      {/* Back button + Breadcrumb */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        {backCrumb?.to && (
          <>
            <Link
              to={backCrumb.to}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors"
            >
              <ChevronLeft size={15} /> {backCrumb.label}
            </Link>
            <span className="text-gray-200 text-sm">|</span>
          </>
        )}
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {c.to ? (
              <Link to={c.to} className="hover:text-accent transition-colors">{c.label}</Link>
            ) : (
              <span className="text-gray-700 font-medium">{c.label}</span>
            )}
            {i < crumbs.length - 1 && <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />}
          </span>
        ))}
      </div>
      </div>

      {/* Title row */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {status && (
          <Badge variant={status}>
            {status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </Badge>
        )}
      </div>

      {/* Tab strip */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
