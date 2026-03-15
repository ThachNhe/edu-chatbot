import { Outlet } from '@tanstack/react-router'
import { AdminSidebar } from './AdminSidebar'
import { useAuthStore } from '@/stores/useAuthStore'

export function AdminLayout() {
  const { user } = useAuthStore()

  // Mặc dù protect route đã cản, nhưng ta có thể check role ở đây nếu sau này có admin vs teacher
  // if (user?.role !== 'admin') {
  //   return <div className="p-8">Bạn không có quyền truy cập trang này.</div>
  // }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 antialiased overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full bg-slate-50 relative isolate">
        <div className="absolute inset-0 z-0 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40"></div>
        <div className="relative z-10 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
