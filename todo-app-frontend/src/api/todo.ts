import apiClient from './auth'

export interface Todo {
  id?: number
  title: string
  description?: string
  completed: boolean
  createdAt?: string
  updatedAt?: string
}

export const todoApi = {
  getAll: () => 
    apiClient.get<Todo[]>('/todos'),
  
  getById: (id: number) => 
    apiClient.get<Todo>(`/todos/${id}`),
  
  create: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Todo>('/todos', todo),
  
  update: (id: number, todo: Partial<Todo>) => 
    apiClient.put<Todo>(`/todos/${id}`, todo),
  
  delete: (id: number) => 
    apiClient.delete(`/todos/${id}`),
  
  toggleComplete: (id: number) => 
    apiClient.patch<Todo>(`/todos/${id}/toggle`)
}
