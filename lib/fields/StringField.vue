<template>
  <input type="text" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup="props">
import { defineProps } from 'vue'
import { Schema } from '../types'
const props = defineProps<{
  value: any
  onChange: (v: string) => void
  schema: Schema
}>()
const handleChange = (e: any) => {
  console.log(e)
  props.onChange(e.target.value)
}
console.log(props.value)
</script>
