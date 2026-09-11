import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <Sidebar />
      <div className="ml-[185px] flex-1">
        <main className="p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
