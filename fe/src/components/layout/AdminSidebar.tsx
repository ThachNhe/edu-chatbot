import { useNavigate, useLocation } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLogout } from '@/features/auths'
import { LogOut, Settings, BarChart2, GraduationCap, UserCog, ClipboardList, Crown, Menu } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const NAV_ITEMS: { icon: LucideIcon; label: string; path: string; badge?: number }[] = [
  { icon: BarChart2, label: 'Bảng điều khiển', path: '/admin/dashboard' },
  { icon: GraduationCap, label: 'Quản lý Học sinh', path: '/admin/students' },
  { icon: UserCog, label: 'Quản lý Giáo viên', path: '/admin/instructors' },
  { icon: ClipboardList, label: 'Nhật ký hoạt động', path: '/admin/activity-logs' },
]

export function AdminSidebar({ open, onClose, onMenuClick }: { open: boolean; onClose: () => void; onMenuClick: () => void }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  const handleNav = (path: string) => {
    navigate({ to: path as any })
    onClose()
  }
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? 'A'
  const roleLabel = 'Quản trị viên'

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <aside
      className={cn(
        'flex h-screen w-[220px] flex-shrink-0 flex-col transition-transform duration-300',
        'md:relative md:translate-x-0',
        'fixed inset-y-0 left-0 z-40',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
      style={{
        background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Logo + hamburger row */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 shadow-inner">
          <Crown size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[14px] font-extrabold text-white leading-tight">Admin Portal</div>
          <div className="text-[10.5px] text-gray-400">EduAI System</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Hệ thống</p>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} item={item} active={pathname === item.path || pathname.startsWith(item.path)} onClick={() => handleNav(item.path)} />
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3" ref={menuRef}>
        {/* Dropdown menu - hiện phía trên */}
        {menuOpen && (
          <div className="mb-2 rounded-xl overflow-hidden bg-white/10 backdrop-blur border border-white/15 shadow-lg">
            <button
              onClick={() => { setMenuOpen(false); handleNav('/settings') }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-white/80 hover:bg-white/10 transition-colors"
            >
              <span><Settings size={15} /></span>
              <span>Cài đặt</span>
            </button>
            <div className="h-px bg-white/10" />
            <button
              onClick={() => { setMenuOpen(false); logout() }}
              disabled={isPending}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-red-400 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <span><LogOut size={15} /></span>
              <span>{isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-xl p-2.5 transition-all text-left',
            menuOpen ? 'bg-white/15' : 'hover:bg-white/10',
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[14px] font-extrabold text-white shadow-md overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              : avatarLetter
            }
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[12.5px] text-white">{user?.name ?? 'Admin'}</strong>
            <span className="text-[10.5px] text-gray-400">{roleLabel}</span>
          </div>
          <span className={cn(
            'text-xs transition-transform duration-200',
            menuOpen ? 'rotate-180 text-white/70' : 'text-white/40',
          )}>▲</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { icon: LucideIcon; label: string; path: string; badge?: number }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 text-left',
        active
          ? 'bg-white text-gray-900 shadow-md'
          : 'text-gray-300 hover:bg-white/10 hover:text-white',
      )}
    >
      <span className="w-5 flex-shrink-0 flex items-center justify-center"><item.icon size={16} /></span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className={cn(
          'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
          active ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'
        )}>
          {item.badge}
        </span>
      )}
    </button>
  )
}
