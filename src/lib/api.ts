import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const res = await client.get<T>(path)
    return res.data
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const res = await client.post<T>(path, body)
    return res.data
  },

  patch: async <T>(path: string, body?: unknown): Promise<T> => {
    const res = await client.patch<T>(path, body)
    return res.data
  },

  delete: async <T>(path: string): Promise<T> => {
    const res = await client.delete<T>(path)
    return res.data
  },

  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const res = await client.post<T>(path, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
}
