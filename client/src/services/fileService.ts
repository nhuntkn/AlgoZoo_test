import { api } from './api'

export interface UploadedFile {
  file_id: string
  filename: string
}

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return api.postFormData<{ status: string; message: string; data: UploadedFile }>('/files', formData)
}