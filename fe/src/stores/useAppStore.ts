import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type PageName = 'dashboard' | 'chat' | 'exam' | 'lessons' | 'stats'

interface PageInfo {
  title: string
  subtitle: string
}

const PAGE_INFO: Record<PageName, PageInfo> = {
  dashboard: { title: 'Trang chủ', subtitle: 'Xin chào, hôm nay bạn muốn làm gì?' },
  chat: { title: 'Trợ lý AI Chat', subtitle: 'Hỏi bất kỳ điều gì về Tin học 12' },
  exam: { title: 'Tạo đề thi / Bài tập', subtitle: 'Sinh đề thi tự động bằng AI' },
  lessons: { title: 'Quản lý Bài học', subtitle: '24 bài học • 2 đang soạn • 6 chưa làm' },
  stats: { title: 'Thống kê & Báo cáo', subtitle: '156 học sinh • HK1 2025–2026' },
}

interface AppState {
  currentPage: PageName
  pageInfo: PageInfo
  setCurrentPage: (page: PageName) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      currentPage: 'dashboard',
      pageInfo: PAGE_INFO.dashboard,
      setCurrentPage: (page) =>
        set(
          { currentPage: page, pageInfo: PAGE_INFO[page] },
          false,
          'app/setCurrentPage',
        ),
    }),
    { name: 'app-store' },
  ),
)