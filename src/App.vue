<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const authPages = ['/register', '/login']

function isAuthPage() {
  return authPages.includes(route.path)
}
</script>

<template>
  <div>
    <header v-if="!isAuthPage()" class="app-header">
      <RouterLink to="/levels" class="brand">Інфографіка</RouterLink>

      <nav class="main-nav">
        <RouterLink to="/levels">Рівні</RouterLink>
        <RouterLink to="/library">Бібліотека</RouterLink>
        <RouterLink to="/profile">Персонаж</RouterLink>
        <RouterLink to="/project">Проєкт</RouterLink>
        <RouterLink to="/gallery">Галерея</RouterLink>
        <RouterLink to="/certificate">Сертифікат</RouterLink>
      </nav>
    </header>

    <main :class="['app-main', { 'with-header': !isAuthPage() }]">
      <RouterView :key="route.fullPath" />
    </main>
  </div>
</template>