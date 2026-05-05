<script setup>
import { ref, computed } from 'vue'
import { levels } from '../data/levels'
import { ducks } from '../data/ducks'
import { useAppStore } from '../stores/appStore'
import { groupTheoryBlocks } from '../utils/groupTheory'

const search = ref('')
const store = useAppStore()

const unlockedLevels = computed(() => {
  return levels.filter((level) => store.completedLevels.includes(level.id))
})

const allMaterials = computed(() => {
  return unlockedLevels.value.flatMap((level) => {
    return groupTheoryBlocks(level.theory).map((section) => ({
      levelTitle: level.title,
      title: section.title,
      text: section.text
    }))
  })
})

const filteredMaterials = computed(() => {
  const query = search.value.toLowerCase().trim()

  if (!query) return allMaterials.value

  return allMaterials.value.filter((item) => {
    return item.levelTitle.toLowerCase().includes(query)
      || item.title.toLowerCase().includes(query)
      || item.text.toLowerCase().includes(query)
  })
})
</script>

<template>
  <section class="library-head">
    <div>
      <p class="caption">Конспект</p>
      <h1>Бібліотека матеріалів</h1>
      <p class="body-large">
        Бібліотека поповнюється після проходження рівнів. Теорія додається автоматично після завершення кожного рівня.
      </p>
    </div>

    <input v-model="search" placeholder="Пошук..." />
  </section>

  <section v-if="filteredMaterials.length" class="library-grid">
    <article
      v-for="(item, index) in filteredMaterials"
      :key="item.levelTitle + item.title + index"
      class="card library-card grouped-library-card"
    >
      <p class="caption">{{ item.levelTitle }}</p>
      <h2 class="library-section-title">{{ item.title }}</h2>
      <p class="body-large grouped-library-text">{{ item.text }}</p>
      <span class="star">⭐</span>
    </article>
  </section>

  <section v-else class="card">
    <h2>Матеріалів поки немає</h2>
    <p>
      Пройдіть хоча б один рівень, і теоретичні матеріали цього рівня автоматично з’являться в бібліотеці.
    </p>
    <RouterLink class="button" to="/levels">До рівнів</RouterLink>
  </section>

  <img class="corner-duck-img" :src="ducks.library" alt="Качечка в бібліотеці" />
</template>
