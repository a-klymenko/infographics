<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const store = useAppStore()
const avatars = [
  { id: 'avatar1', src: ducks.avatar1 },
  { id: 'avatar2', src: ducks.avatar2 },
  { id: 'avatar3', src: ducks.avatar3 },
  { id: 'avatar4', src: ducks.avatar4 }
]

const currentAvatar = computed(() => {
  return ducks[store.avatar] || ducks.avatar1
})
</script>

<template>
  <section class="profile-grid">
    <aside class="card profile-side">
      <div class="avatar"><img :src="currentAvatar" alt="Аватар качечки" /></div>
      <h2>{{ store.userName || 'Anastasiia' }}</h2>
      <p>{{ store.email || 'example@gmail.com' }}</p>

      <p style="font-weight: 800; margin-top: 30px;">Обрати аватар</p>
      <div class="avatar-options">
        <button v-for="avatar in avatars" :key="avatar.id" @click="store.setAvatar(avatar.id)">
          <img :src="avatar.src" alt="Варіант аватара" />
        </button>
      </div>

      <button style="width: 100%; margin-top: 26px; background: var(--error);" @click="store.logout">
        Вийти
      </button>
    </aside>

    <section class="card">
      <h1>Статус: {{ store.status }}</h1>

      <div class="stats">
        <div class="stat">
          <strong>{{ store.completedCount }}</strong>
          <span>рівнів</span>
        </div>

        <div class="stat">
          <strong>{{ store.averageScore }}%</strong>
          <span>середній бал</span>
        </div>

        <div class="stat">
          <strong>{{ store.unlockedAchievements.length }}</strong>
          <span>досягнення</span>
        </div>
      </div>

      <h2>Досягнення</h2>
      <p class="body-large">
        Значки показують прогрес користувача. Відкриті значки яскраві, заблоковані — приглушені.
      </p>

      <div class="achievement-grid">
        <article
          v-for="achievement in store.achievementList"
          :key="achievement.id"
          :class="['achievement-card', { locked: !achievement.unlocked }]"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div>
            <strong>{{ achievement.title }}</strong>
            <span>{{ achievement.description }}</span>
          </div>
        </article>
      </div>

      <button style="margin-top: 28px;" @click="store.reset">
        Скинути все
      </button>
    </section>
    </section>

  <img class="profile-big-duck" :src="ducks.profileBig" alt="Велика качечка" />
</template>
