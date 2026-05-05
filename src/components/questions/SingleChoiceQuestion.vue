<script setup>
import { ref } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['answered'])

const selected = ref(null)
const checked = ref(false)

function submit() {
  checked.value = true
  const correct = selected.value === props.task.correct
  emit('answered', correct ? 100 : 0)
}
</script>

<template>
  <div class="question-box">
    <h3>{{ task.question }}</h3>

    <button
      v-for="(option, index) in task.options"
      :key="option"
      :class="[
        'option',
        {
          selected: selected === index && !checked,
          correct: checked && index === task.correct,
          wrong: checked && selected === index && index !== task.correct
        }
      ]"
      :disabled="checked"
      @click="selected = index"
    >
      {{ option }}
    </button>

    <button v-if="!checked" :disabled="selected === null" @click="submit">
      Перевірити
    </button>
  </div>
</template>
