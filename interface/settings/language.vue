<template lang="pug">
div(class="pt-[69px] w-full h-[508px] absolute flex justify-center")
  div(class="text-slate-400 flex gap-2 flex-wrap justify-center overflow-y-scroll pb-8")
    span(
      class="text-center bg-slate-700 font-bold h-10 p-2 rounded-lg min-w-[152px] cursor-pointer"
      :class="{'bg-slate-600': SETTINGS.language === lang}"
      v-for="(lang, index) in VOICE.languages"
      :key="'lang-' + update + '-' + index"
      @click="SETTINGS.language = lang; update++; LOCAL.update()"
    ) {{ lang }}
</template>
<script setup lang="ts">
const update = ref(0)
</script>
