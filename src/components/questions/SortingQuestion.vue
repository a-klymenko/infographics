<script setup>
import { ref } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['answered'])

const order = ref([...props.task.items].sort(() => Math.random() - 0.5))
const checked = ref(false)

function move(index, direction) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= order.value.length) return

  const copy = [...order.value]
  const temp = copy[index]
  copy[index] = copy[newIndex]
  copy[newIndex] = temp
  order.value = copy
}

function submit() {
  checked.value = true
  const correct = order.value.join('|') === props.task.correct.join('|')
  emit('answered', correct ? 100 : 50)
}
</script>

<template>
  <div class="question-box">
    <h3>{{ task.question }}</h3>

    <div v-for="(item, index) in order" :key="item" class="option" style="display: flex; justify-content: space-between;">
      <span>{{ index + 1 }}. {{ item }}</span>

      <span>
        <button style="min-height: 32px; padding: 6px 10px; margin-right: 6px;" :disabled="checked" @click="move(index, -1)">↑</button>
        <button style="min-height: 32px; padding: 6px 10px;" :disabled="checked" @click="move(index, 1)">↓</button>
      </span>
    </div>

    <button v-if="!checked" @click="submit">Перевірити</button>
  </div>
</template>
