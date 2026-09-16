// services/adminDashboardService.ts

import type { AdminDashboardResponse } from '../types/adminDashboard'
import { getDashboard } from './adminService'

export const adminDashboardService = {
  getDashboard: (classId?: string) => {
    return getDashboard(classId) as Promise<AdminDashboardResponse>
  },
}