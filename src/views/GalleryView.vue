<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const store = useAppStore()

const publicWorks = [
  {
    id: 'other-1',
    title: 'Історія розвитку інфографіки',
    author: 'Марія Іваненко',
    description: 'Хронологічна інфографіка з основними етапами розвитку візуалізації даних.',
    image: '',
    variant: 'timeline'
  },
  {
    id: 'other-2',
    title: 'Типографічна шкала',
    author: 'Олексій Петренко',
    description: 'Навчальна інфографіка про H1, H2, H3, основний текст, підписи та кнопки.',
    image: '',
    variant: 'type'
  },
  {
    id: 'other-3',
    title: 'Теорія кольору',
    author: 'Софія Мельник',
    description: 'Приклад інфографіки з колірними схемами, контрастом і візуальними акцентами.',
    image: '',
    variant: 'colors'
  },
  {
    id: 'other-4',
    title: 'Статистика читабельності',
    author: 'Данило Коваль',
    description: 'Статистична інфографіка з діаграмами, відсотками та короткими поясненнями.',
    image: '',
    variant: 'bars'
  },
  {
    id: 'other-5',
    title: 'Як створити якісну інфографіку',
    author: 'Ірина Бондар',
    description: 'Процесна інфографіка з послідовністю етапів: тема, дані, структура, дизайн, перевірка.',
    image: '',
    variant: 'timeline'
  },
  {
    id: 'other-6',
    title: 'Порівняння типів графіків',
    author: 'Максим Савчук',
    description: 'Порівняльна інфографіка про стовпчикові, кругові, лінійні та точкові графіки.',
    image: '',
    variant: 'bars'
  }
]

const myWorks = computed(() => store.projects)
</script>

<template>
  <section>
    <h1>Галерея</h1>

    <section class="gallery-section">
      <div class="gallery-section-head">
        <p class="caption">Мої роботи</p>
        <h2>Власні інфографіки</h2>
      </div>

      <div v-if="myWorks.length" class="gallery-grid gallery-grid-own">
        <article v-for="work in myWorks" :key="work.id" class="card">
          <img
            v-if="work.image"
            :src="work.image"
            alt="Інфографіка"
            style="width: 100%; border-radius: 16px; margin-bottom: 14px;"
          />

          <div v-else :class="['fake-chart', 'preview-' + (work.variant || 'bars')]">
            <div class="bar orange"></div>
            <div class="bar green"></div>
            <div class="bar blue"></div>
          </div>

          <h3>{{ work.title }}</h3>
          <p>Автор: {{ work.author }}</p>
          <p>{{ work.description }}</p>
        </article>
      </div>

      <section v-else class="card gallery-empty-own">
        <h3>Власних робіт поки немає</h3>
        <p>Створіть підсумкову інфографіку у розділі “Проєкт”.</p>
        <RouterLink class="button" to="/project">Створити роботу</RouterLink>
      </section>
    </section>

    <section class="gallery-section public-gallery-section">
      <div class="gallery-section-head">
        <p class="caption">Публічні роботи</p>
        <h2>Роботи інших авторів</h2>
      </div>

      <div class="gallery-grid">
        <article v-for="work in publicWorks" :key="work.id" class="card">
          <div :class="['fake-chart', 'preview-' + (work.variant || 'bars')]">
            <template v-if="(work.variant || 'bars') === 'bars'">
              <div class="bar orange"></div>
              <div class="bar green"></div>
              <div class="bar blue"></div>
            </template>

            <template v-else-if="work.variant === 'colors'">
              <div class="color-chip color-orange"></div>
              <div class="color-chip color-blue"></div>
              <div class="color-chip color-green"></div>
            </template>

            <template v-else-if="work.variant === 'timeline'">
              <div class="timeline-line">
                <span></span><span></span><span></span><span></span>
              </div>
            </template>

            <template v-else-if="work.variant === 'type'">
              <div class="type-preview">
                <strong>H1</strong>
                <span>H2</span>
                <p>Body text</p>
              </div>
            </template>
          </div>

          <h3>{{ work.title }}</h3>
          <p>Автор: {{ work.author }}</p>
          <p>{{ work.description }}</p>
        </article>
      </div>
    </section>

    <img class="corner-duck-img" :src="ducks.gallery" alt="Качечка галереї" />
  </section>
</template>
