<script setup>
import { ref } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['answered'])

const selected = ref([])
const checked = ref(false)

function toggle(index) {
  if (checked.value) return

  if (selected.value.includes(index)) {
    selected.value = selected.value.filter((item) => item !== index)
  } else {
    selected.value.push(index)
  }
}

function arraysEqual(a, b) {
  return [...a].sort().join(',') === [...b].sort().join(',')
}

function submit() {
  checked.value = true
  const correct = arraysEqual(selected.value, props.task.correct)
  emit('answered', correct ? 100 : 50)
}
</script>

<template>
  <div class="question-box">
    <h3>{{ task.question }}</h3>
    <p>Оберіть усі правильні варіанти.</p>

    <button
      v-for="(option, index) in task.options"
      :key="option"
      :class="[
        'option',
        {
          selected: selected.includes(index) && !checked,
          correct: checked && task.correct.includes(index),
          wrong: checked && selected.includes(index) && !task.correct.includes(index)
        }
      ]"
      :disabled="checked"
      @click="toggle(index)"
    >
      {{ option }}
    </button>

    <button v-if="!checked" :disabled="selected.length === 0" @click="submit">
      Перевірити
    </button>
  </div>
</template>
