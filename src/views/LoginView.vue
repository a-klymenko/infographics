<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const router = useRouter()
const store = useAppStore()

const email = ref('')
const password = ref('')

async function login() {
  const ok = await store.login({
    email: email.value.trim(),
    password: password.value
  })

  if (ok) {
    router.push('/levels')
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="panel auth-card">
      <div class="auth-header">
        <h1>Інфографіка</h1>
        <h2>Вхід</h2>
        <img class="auth-duck" :src="ducks.profileBig" alt="Качечка" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" />
      </div>

      <p v-if="store.errorMessage" style="color: var(--error);">
        {{ store.errorMessage }}
      </p>

      <button style="width: 100%;" @click="login">Увійти</button>

      <p class="auth-footer-text">
        Немає акаунта?
        <RouterLink to="/register">Зареєструватися</RouterLink>
      </p>
    </section>
  </main>
</template>
