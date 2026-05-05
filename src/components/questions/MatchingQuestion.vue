<script setup>
import { ref } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['answered'])

const answers = ref({})
const checked = ref(false)
const rights = props.task.pairs.map((pair) => pair.right).sort(() => Math.random() - 0.5)

function submit() {
  checked.value = true

  const correctCount = props.task.pairs.filter((pair) => {
    return answers.value[pair.left] === pair.right
  }).length

  emit('answered', Math.round((correctCount / props.task.pairs.length) * 100))
}
</script>

<template>
  <div class="question-box">
    <h3>{{ task.question }}</h3>

    <div class="match-grid">
      <div v-for="pair in task.pairs" :key="pair.left" class="match-row">
        <div class="match-left">{{ pair.left }}</div>

        <select v-model="answers[pair.left]" :disabled="checked">
          <option value="">Оберіть відповідь</option>
          <option v-for="right in rights" :key="right" :value="right">
            {{ right }}
          </option>
        </select>
      </div>
    </div>

    <button v-if="!checked" @click="submit">Перевірити</button>

    <div v-else class="theory-card success">
      Завдання перевірено. Частково правильні відповіді теж враховуються.
    </div>
  </div>
</template>
