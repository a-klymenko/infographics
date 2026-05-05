<script setup>
import { useAppStore } from '../stores/appStore'
import { ducks } from '../data/ducks'

const store = useAppStore()
</script>

<template>
  <section>
    <div v-if="store.canGetCertificate" class="certificate">
      <div>
        <h1>Сертифікат</h1>
        <h2>{{ store.userName }}</h2>
        <p class="body-large">успішно завершив(ла) курс</p>
        <h3>«Основи інфографіки»</h3>
        <p class="body-large">Середній бал: {{ store.averageScore }}%</p>
</div>

      <img class="cert-duck" :src="ducks.certificate" alt="Качечка із сертифікатом" />
    </div>

    <section v-else class="panel">
      <h1>Сертифікат поки недоступний</h1>
      <p class="body-large">
        Щоб отримати сертифікат, потрібно пройти всі 10 рівнів і мати середній бал не менше 70%.
      </p>

      <div class="stats">
        <div class="stat">
          <strong>{{ store.completedCount }}/10</strong>
          <span>рівнів</span>
        </div>

        <div class="stat">
          <strong>{{ store.averageScore }}%</strong>
          <span>середній бал</span>
        </div>

        <div class="stat">
          <strong>{{ store.progressPercent }}%</strong>
          <span>прогрес</span>
        </div>
      </div>

      <RouterLink class="button" to="/levels">До рівнів</RouterLink>
    </section>
  </section>
</template>
