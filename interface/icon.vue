<template lang="pug">
div(
  class="w-8 h-8 rounded-full opacity-40 flex justify-center items-center transition-all duration-100"
  :class="{'opacity-100': props.variable}"
): slot
</template>
<script setup lang="ts">
const props = defineProps(["variable"])
</script>
