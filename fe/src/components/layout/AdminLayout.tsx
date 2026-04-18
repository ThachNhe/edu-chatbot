import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './AdminSidebar'
import { Menu } from 'lucide-react'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 antialiased overflow-hidden font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMenuClick={() => setSidebarOpen((v) => !v)}
      />

      <main className="flex-1 flex flex-col h-full bg-slate-50 relative isolate overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Mobile header */}
        <div className="relative z-10 flex items-center gap-3 px-4 h-[52px] border-b border-gray-100 bg-white/80 backdrop-blur-sm md:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Mở menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-[14px] font-bold text-gray-800">Admin Portal</span>
        </div>

        <div className="relative z-10 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}