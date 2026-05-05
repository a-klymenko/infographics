<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { levels } from '../data/levels'
import { ducks } from '../data/ducks'
import { useAppStore } from '../stores/appStore'
import { groupTheoryBlocks } from '../utils/groupTheory'

import SingleChoiceQuestion from '../components/questions/SingleChoiceQuestion.vue'
import MultipleChoiceQuestion from '../components/questions/MultipleChoiceQuestion.vue'
import MatchingQuestion from '../components/questions/MatchingQuestion.vue'
import SortingQuestion from '../components/questions/SortingQuestion.vue'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const levelId = Number(route.params.id)
const level = computed(() => levels.find((item) => item.id === levelId))

const activeTab = ref('theory')
const currentTask = ref(0)
const points = ref([])
const finished = ref(false)

const theorySections = computed(() => {
  return groupTheoryBlocks(level.value?.theory || [])
})

const questionComponent = computed(() => {
  const task = level.value?.tasks[currentTask.value]
  if (!task) return null

  if (task.type === 'single') return SingleChoiceQuestion
  if (task.type === 'multiple') return MultipleChoiceQuestion
  if (task.type === 'matching') return MatchingQuestion
  if (task.type === 'sorting') return SortingQuestion

  return SingleChoiceQuestion
})

const score = computed(() => {
  if (!points.value.length) return 0
  return Math.round(points.value.reduce((sum, item) => sum + item, 0) / level.value.tasks.length)
})

function onAnswered(value) {
  points.value[currentTask.value] = value

  if (currentTask.value < level.value.tasks.length - 1) {
    currentTask.value += 1
  } else {
    finished.value = true
    store.completeLevel(levelId, score.value)
  }
}

function nextLevel() {
  const nextId = levelId + 1

  if (nextId <= levels.length) {
    router.push(`/levels/${nextId}`)
  } else {
    router.push('/project')
  }
}
</script>

<template>
  <section v-if="level" class="panel level-layout level-page-wrap">
    <RouterLink to="/levels" class="back-link">← До рівнів</RouterLink>

    <h1>{{ level.title }}</h1>
    <p class="body-large">{{ level.short }}</p>

    <div class="tabs">
      <button
        :class="['tab-button', { active: activeTab === 'theory' }]"
        @click="activeTab = 'theory'"
      >
        Теорія
      </button>

      <button
        :class="['tab-button', { active: activeTab === 'tasks' }]"
        @click="activeTab = 'tasks'"
      >
        Завдання
      </button>
    </div>

    <section v-if="activeTab === 'theory'">
      <article
        v-for="(section, index) in theorySections"
        :key="section.title + index"
        class="theory-group-card"
      >
        <h2 class="theory-group-title">{{ section.title }}</h2>

        <div class="theory-group-text">
          <p
            v-for="(paragraph, paragraphIndex) in section.paragraphs"
            :key="section.title + paragraphIndex"
            class="body-large theory-group-paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </article>

      <button @click="activeTab = 'tasks'">Перейти до завдань</button>
    </section>

    <section v-else>
      <div v-if="!finished">
        <p class="caption">Завдання {{ currentTask + 1 }} з {{ level.tasks.length }}</p>

        <component
          :is="questionComponent"
          :key="currentTask"
          :task="level.tasks[currentTask]"
          @answered="onAnswered"
        />
      </div>

      <div v-else class="theory-card success">
        <h2>Рівень завершено</h2>
        <p class="body-large">Ваш результат: <strong>{{ score }}%</strong></p>
        <button @click="nextLevel">Далі</button>
      </div>
    </section>

    <img class="level-duck-img" :src="ducks.project" alt="Качечка на сторінці рівня" />
  </section>
</template>
