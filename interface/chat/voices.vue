<template lang="pug">
div(class="w-full h-full absolute flex justify-center items-start overflow-y-scroll pt-[70px] pl-2")
  div(class="grid grid-cols-2 gap-2 items-center justify-center pb-6")
    div(
      v-for="(voice, index) in filteredVoices"
      :key="'lang-' + update + '-' + index"
      class="text-center text-slate-400 text-[15px] font-bold p-2 rounded-lg min-w-[152px] cursor-pointer"
      @click="handleClick(voice)"
      :class="{'bg-slate-600': SETTINGS.voice === voice.name}"
    ): span {{ clearedName(voice.name) }}
</template>
<script setup lang="ts">
const update = ref(0)
const handleClick = (voice) => {
  SETTINGS.voice = voice.name
  update.value++
  LOCAL.update()
}
const filteredVoices = computed(() => {
  if (!VOICE.voiceData) return
  return VOICE.voiceData.filter((voice) => {
    return voice.lang.split("-")[0] === SETTINGS.language.split("-")[0]
  })
})
const clearedName = (name) => {
  return name
    .replace("Microsoft ", "")
    .replace("(Natural) ", "")
    .replace("United Kingdom", "UK")
    .replace("United States", "US")
}
</script>
