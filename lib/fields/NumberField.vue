<template>
  <input type="number" :value="value" @input="handleChange" />
</template>

<script lang="ts" setup="props">
import { defineProps } from 'vue'
import { Schema } from '../types'
const props = defineProps<{
  value: any
  onChange: (v: any) => void
  schema: Schema
}>()
const handleChange = (e: any) => {
  const value = +e.target.value
  if (Number.isNaN(value)) {
    props.onChange(undefined)
  } else {
    props.onChange(e.target.value)
  }
}
</script>
