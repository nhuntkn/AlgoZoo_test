import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Crumb = { label: string; to?: string }

interface ClassTabNavProps {
  crumbs: Crumb[]
  title: string
  status?: 'ACTIVE' | 'INACTIVE' | 'Active' | 'Inactive'
  tabs: { label: string; to: string }[]
  backLink?: { label: string; to: string }
}

export function ClassTabNav({ crumbs, title, status, tabs, backLink }: ClassTabNavProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isStatusActive = status === 'ACTIVE' || status === 'Active'

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-3 flex-wrap">
        {backLink ? (
          <>
            <Link to={backLink.to} className="flex items-center gap-1 text-gray-400 hover:text-accent font-medium transition-colors">
              <ChevronLeft size={15} />
              {backLink.label}
            </Link>
            <span className="text-gray-300 mx-1">|</span>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={13} className="text-gray-300" />}
                {c.to ? (
                  <Link to={c.to} className="text-gray-400 hover:text-accent font-medium transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium">{c.label}</span>
                )}
              </span>
            ))}
          </>
        ) : (
          <>
            <Link to={crumbs[0]?.to ?? '#'} className="flex items-center gap-1 text-gray-400 hover:text-accent">
              <ChevronLeft size={15} />
              {crumbs[0]?.label}
            </Link>
            {crumbs.slice(1).map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={13} className="text-gray-300" />
                {c.to ? (
                  <Link to={c.to} className="text-gray-400 hover:text-accent">{c.label}</Link>
                ) : (
                  <span className="text-gray-700 font-medium">{c.label}</span>
                )}
              </span>
            ))}
          </>
        )}
      </div>

      {/* Title + status */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        {status && (
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center ${
              isStatusActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : 'bg-gray-100 text-gray-600 border border-gray-200/60'
            }`}
          >
            {isStatusActive ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.to
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-accent text-accent font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
