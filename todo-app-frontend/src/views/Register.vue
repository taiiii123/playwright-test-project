<template>
  <div class="register-container">
    <div class="register-card">
      <h1>新規登録</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">ユーザー名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="ユーザー名を入力"
          />
        </div>
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="メールアドレスを入力"
          />
        </div>
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="パスワードを入力（8文字以上）"
            minlength="8"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">パスワード（確認）</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="パスワードを再入力"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? '登録中...' : '登録' }}
        </button>
      </form>
      <p class="login-link">
        すでにアカウントをお持ちの方は 
        <router-link to="/login">こちら</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'すべてのフィールドを入力してください'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'パスワードが一致しません'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'パスワードは8文字以上で入力してください'
    return
  }

  loading.value = true

  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || '登録に失敗しました'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fdecea;
  border-radius: 5px;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
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

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
