<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const router = useRouter()
const store = useAppStore()

const title = ref('Моя інфографіка')
const description = ref('Інфографіка, створена після проходження курсу.')
const image = ref('')
const isPublic = ref(true)

function handleFile(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    image.value = reader.result
  }
  reader.readAsDataURL(file)
}

async function saveProject() {
  const ok = await store.addProject({
    title: title.value,
    description: description.value,
    image: image.value,
    isPublic: isPublic.value
  })

  if (ok) {
    router.push('/gallery')
  }
}
</script>

<template>
  <section class="panel">
    <p class="caption">Підсумкова робота</p>
    <h1>Проєкт</h1>

    <p v-if="store.errorMessage" style="color: var(--error);">
      {{ store.errorMessage }}
    </p>

    <div class="project-grid">
      <div>
        <div class="form-group">
          <label>Назва роботи</label>
          <input v-model="title" />
        </div>

        <div class="form-group">
          <label>Опис</label>
          <textarea v-model="description" rows="5"></textarea>
        </div>

        <div class="form-group">
          <label>Завантажити інфографіку</label>
          <input type="file" accept="image/*" @change="handleFile" />
        </div>

        <label style="display: flex; gap: 10px; align-items: center; margin-bottom: 18px;">
          <input v-model="isPublic" type="checkbox" style="width: auto;" />
          Показати роботу у публічній галереї
        </label>

        <button @click="saveProject">Зберегти роботу</button>
      </div>

      <div class="preview-box">
        <p class="caption">Попередній перегляд</p>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

        <img
          v-if="image"
          :src="image"
          alt="Завантажена інфографіка"
          style="max-width: 100%; border-radius: 16px;"
        />

        <div v-else class="fake-chart">
          <div class="bar orange"></div>
          <div class="bar green"></div>
          <div class="bar blue"></div>
        </div>
      </div>
    </div>
  </section>

  <img class="corner-duck-img" :src="ducks.project" alt="Качечка проєкту" />
</template>
