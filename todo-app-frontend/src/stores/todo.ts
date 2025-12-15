import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { todoApi, type Todo } from '@/api/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed)
  )

  const activeTodos = computed(() => 
    todos.value.filter(todo => !todo.completed)
  )

  const fetchTodos = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.getAll()
      todos.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch todos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.create(todo)
      todos.value.unshift(response.data)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.update(id, updates)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTodo = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await todoApi.delete(id)
      todos.value = todos.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleTodo = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await todoApi.toggleComplete(id)
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle todo'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    loading,
    error,
    completedTodos,
    activeTodos,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  }
})
