export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    AVATAR: (id: string) => `/users/${id}/avatar`,
  },

  CONVERSATIONS: {
    LIST: '/conversations',
    MESSAGES: (id: number) => `/conversations/${id}/messages`,
  },

  // ─── Dashboard ───────────────────────────────────────────────────────────
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    WEEK_SCHEDULE: '/dashboard/week-schedule',
  },

  // ─── Stats ───────────────────────────────────────────────────────────────
  STATS: {
    OVERVIEW: '/stats/overview',
    CHAPTER_SCORES: '/stats/chapter-scores',
    STUDENT_DISTRIBUTION: '/stats/student-distribution',
    STUDENT_RANKING: '/stats/student-ranking',
  },

  // ─── Exams ───────────────────────────────────────────────────────────────
  EXAMS: {
    GENERATE: '/exams/generate',
    CREATE: '/exams',
    LIST: '/exams',
    DETAIL: (id: number) => `/exams/${id}`,
    DELETE: (id: number) => `/exams/${id}`,
    UPDATE_QUESTION: (examId: number, questionId: number) =>
      `/exams/${examId}/questions/${questionId}`,
    CREATE_ROOM: (examId: number) => `/exams/${examId}/rooms`,
    LIST_ROOMS: (examId: number) => `/exams/${examId}/rooms`,
    TOGGLE_ROOM: (examId: number, roomId: number) =>
      `/exams/${examId}/rooms/${roomId}/toggle`,
    SCORES: (examId: number) => `/exams/${examId}/scores`,
  },

  // ─── Public Rooms (học sinh) ─────────────────────────────────────────────
  ROOMS: {
    GET: (code: string) => `/rooms/${code}`,
    SUBMIT: (code: string) => `/rooms/${code}/submit`,
  },
} as const