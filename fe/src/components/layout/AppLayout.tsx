import { Outlet } from '@tanstack/react-router'
import { Topbar } from './TopBar'
import { Sidebar } from './SideBar'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--edu-bg)] text-sm text-[var(--edu-gray-800)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <Outlet />
      </div>
    </div>
  )
}