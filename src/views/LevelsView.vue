<script setup>
import { computed } from 'vue'
import { levels } from '../data/levels'
import { ducks } from '../data/ducks'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

const levelCards = computed(() => levels.map((level) => {
  const completed = store.completedLevels.includes(level.id)
  const available = level.id === 1 || completed || store.completedLevels.includes(level.id - 1)

  return {
    ...level,
    completed,
    available
  }
}))
</script>

<template>
  <section class="hero">
    <div>
      <h1>Інфографіка</h1>
    </div>

    <img class="duck duck-hero" :src="ducks.hero" alt="Качечка" />

    <div class="progress-box">
      <div class="progress-top">
        <span class="body-large">прогрес</span>
        <span class="progress-number">{{ store.progressPercent }}%</span>
      </div>

      <div class="progress-track">
        <div class="progress-fill" :style="{ width: store.progressPercent + '%' }"></div>
      </div>
    </div>
  </section>

  <section class="level-grid">
    <article
      v-for="level in levelCards"
      :key="level.id"
      :class="['card', 'level-card', { locked: !level.available }]"
    >
      <p class="level-number">Рівень {{ level.id }}</p>
      <h2>{{ level.title }}</h2>

      <RouterLink
        v-if="level.completed"
        class="button"
        :to="'/levels/' + level.id"
      >
        Виконано
      </RouterLink>

      <RouterLink
        v-else-if="level.available"
        class="button"
        :to="'/levels/' + level.id"
      >
        Відкрити
      </RouterLink>

      <button v-else disabled>Заблоковано</button>
    </article>
  </section>
</template>
