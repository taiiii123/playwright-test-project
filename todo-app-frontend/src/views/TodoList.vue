<template>
  <div class="todo-container">
    <header class="header">
      <h1>Todo アプリ</h1>
      <div class="user-info">
        <span>ようこそ、{{ authStore.username }}さん</span>
        <button @click="handleLogout" class="btn-logout">ログアウト</button>
      </div>
    </header>

    <div class="todo-content">
      <!-- Todoの追加・編集フォーム -->
      <div class="add-todo-section">
        <h2>{{ editingTodo ? 'Todoを編集' : '新しいTodoを追加' }}</h2>
        <form @submit.prevent="editingTodo ? handleUpdateTodo() : handleAddTodo()">
          <input
            v-model="formData.title"
            type="text"
            placeholder="タイトルを入力"
            required
            class="input-title"
          />
          <textarea
            v-model="formData.description"
            placeholder="説明を入力（任意）"
            rows="3"
            class="input-description"
          ></textarea>
          <div class="form-actions">
            <button type="submit" :disabled="todoStore.loading" class="btn-primary">
              {{ editingTodo ? '更新' : '追加' }}
            </button>
            <button 
              v-if="editingTodo" 
              type="button" 
              @click="cancelEdit" 
              class="btn-cancel"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>

      <div class="todo-stats">
        <span>全体: {{ todoStore.todos.length }}</span>
        <span>未完了: {{ todoStore.activeTodos.length }}</span>
        <span>完了: {{ todoStore.completedTodos.length }}</span>
      </div>

      <div class="filter-buttons">
        <button
          @click="filter = 'all'"
          :class="{ active: filter === 'all' }"
          class="btn-filter"
        >
          すべて
        </button>
        <button
          @click="filter = 'active'"
          :class="{ active: filter === 'active' }"
          class="btn-filter"
        >
          未完了
        </button>
        <button
          @click="filter = 'completed'"
          :class="{ active: filter === 'completed' }"
          class="btn-filter"
        >
          完了
        </button>
      </div>

      <div v-if="todoStore.loading && todoStore.todos.length === 0" class="loading">
        読み込み中...
      </div>

      <div v-else-if="filteredTodos.length === 0" class="empty-message">
        Todoがありません
      </div>

      <div v-else class="todo-list">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed, editing: editingTodo?.id === todo.id }"
        >
          <div class="todo-checkbox">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id!)"
              :id="'todo-' + todo.id"
            />
            <label :for="'todo-' + todo.id"></label>
          </div>
          <div class="todo-content-item" @click="startEdit(todo)">
            <h3>{{ todo.title }}</h3>
            <p v-if="todo.description">{{ todo.description }}</p>
            <small v-if="todo.createdAt">
              作成日: {{ formatDate(todo.createdAt) }}
            </small>
          </div>
          <div class="todo-actions">
            <button @click="startEdit(todo)" class="btn-edit" title="編集">
              ✏️
            </button>
            <button @click="handleDelete(todo.id!)" class="btn-delete" title="削除">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 削除確認モーダル -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h3>削除の確認</h3>
        <p>このTodoを削除してもよろしいですか？</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn-danger">削除</button>
          <button @click="showDeleteModal = false" class="btn-secondary">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/api/todo'

const router = useRouter()
const authStore = useAuthStore()
const todoStore = useTodoStore()

// フォームデータ
const formData = ref({
  title: '',
  description: ''
})

// 編集中のTodo
const editingTodo = ref<Todo | null>(null)

// 削除モーダル
const showDeleteModal = ref(false)
const todoToDelete = ref<number | null>(null)

// フィルター
const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todoStore.activeTodos
    case 'completed':
      return todoStore.completedTodos
    default:
      return todoStore.todos
  }
})

// 新規追加
const handleAddTodo = async () => {
  if (!formData.value.title.trim()) return

  try {
    await todoStore.addTodo({
      title: formData.value.title,
      description: formData.value.description,
      completed: false
    })
    // フォームをクリア
    formData.value.title = ''
    formData.value.description = ''
  } catch (error) {
    alert('Todoの追加に失敗しました')
  }
}

// 編集開始
const startEdit = (todo: Todo) => {
  editingTodo.value = { ...todo }
  formData.value.title = todo.title
  formData.value.description = todo.description || ''
  
  // フォームまでスクロール
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 編集キャンセル
const cancelEdit = () => {
  editingTodo.value = null
  formData.value.title = ''
  formData.value.description = ''
}

// 更新
const handleUpdateTodo = async () => {
  if (!editingTodo.value || !formData.value.title.trim()) return

  try {
    await todoStore.updateTodo(editingTodo.value.id!, {
      title: formData.value.title,
      description: formData.value.description
    })
    cancelEdit()
  } catch (error) {
    alert('Todoの更新に失敗しました')
  }
}

// 完了状態の切り替え
const toggleTodo = async (id: number) => {
  try {
    await todoStore.toggleTodo(id)
  } catch (error) {
    alert('Todoの更新に失敗しました')
  }
}

// 削除確認
const handleDelete = (id: number) => {
  todoToDelete.value = id
  showDeleteModal.value = true
}

// 削除実行
const confirmDelete = async () => {
  if (todoToDelete.value === null) return

  try {
    await todoStore.deleteTodo(todoToDelete.value)
    showDeleteModal.value = false
    todoToDelete.value = null
    
    // 編集中のTodoが削除された場合はキャンセル
    if (editingTodo.value?.id === todoToDelete.value) {
      cancelEdit()
    }
  } catch (error) {
    alert('Todoの削除に失敗しました')
  }
}

// ログアウト
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP')
}

// 初期化
onMounted(() => {
  todoStore.fetchTodos()
})
</script>

<style scoped>
.todo-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

.todo-content {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.add-todo-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.add-todo-section h2 {
  margin-top: 0;
  color: #333;
}

.input-title,
.input-description {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
}

.input-description {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #5a6268;
}

.todo-stats {
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.todo-stats span {
  font-weight: 600;
  color: #555;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn-filter {
  flex: 1;
  padding: 0.75rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-filter.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.loading,
.empty-message {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.todo-item {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.editing {
  border: 2px solid #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.todo-checkbox {
  display: flex;
  align-items: center;
}

.todo-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-content-item {
  flex: 1;
  cursor: pointer;
}

.todo-content-item:hover h3 {
  color: #667eea;
}

.todo-content-item h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  transition: color 0.3s;
}

.todo-item.completed .todo-content-item h3 {
  text-decoration: line-through;
}

.todo-content-item p {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.todo-content-item small {
  color: #999;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.btn-edit {
  background: #ffc107;
}

.btn-edit:hover {
  transform: scale(1.1);
}

.btn-delete {
  background: #e74c3c;
}

.btn-delete:hover {
  transform: scale(1.1);
}

/* モーダル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-danger {
  padding: 0.5rem 1.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
