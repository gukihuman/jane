<template lang="pug">
div(class="w-full h-full absolute flex justify-center items-start overflow-y-scroll pt-9 pl-2")
  div(class="grid grid-cols-4 gap-2 items-center justify-center py-8")
    div(
      v-for="(lang, index) in VOICE.languages"
      :key="'lang-' + update + '-' + index"
      class="text-center text-slate-400 bg-slate-700 font-bold p-2 rounded-lg min-w-[152px] cursor-pointer"
      @click="handleClick(lang)"
      :class="{'bg-slate-600': SETTINGS.language === lang}"
    ): span {{ lang }}
</template>
<script setup lang="ts">
const update = ref(0)
const handleClick = (lang) => {
  SETTINGS.language = lang
  update.value++
  LOCAL.update()
}
</script>
