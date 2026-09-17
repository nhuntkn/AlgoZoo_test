import { api, API_BASE_URL } from './api'

export interface UploadedFile {
  file_id: string
  filename: string
}

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.postFormData<{ status: string; message: string; data: UploadedFile }>('/files', formData)
}

export function getFileUrl(fileId: string) {
  return `${API_BASE_URL}/files/${fileId}`
}