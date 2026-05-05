<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const router = useRouter()
const store = useAppStore()

const name = ref(store.userName)
const email = ref(store.email)
const password = ref('12345678')

function register() {
  if (name.value.trim().length < 2) return

  store.register({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value
  })

  router.push('/levels')
}
</script>

<template>
  <main class="auth-page">
    <section class="panel auth-card">
      <div class="auth-header">
        <h1>Інфографіка</h1>
        <h2>Реєстрація</h2>
        <img class="auth-duck" :src="ducks.main" alt="Качечка" />
      </div>

      <div class="form-group">
        <label>Ім’я</label>
        <input v-model="name" />
        <p class="hint">Ім’я буде в сертифікаті</p>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" />
      </div>

      <button style="width: 100%;" @click="register">Зареєструватися</button>

      <p class="auth-footer-text">
        Уже є акаунт?
        <RouterLink to="/login">Увійти</RouterLink>
      </p>
    </section>
  </main>
</template>
