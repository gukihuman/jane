<template lang="pug">
div(class="pt-[69px] w-full h-[508px] absolute flex justify-center")
  div(class="text-slate-400 flex gap-2 flex-wrap justify-center overflow-y-scroll pb-8")
    span(
      class="text-center bg-slate-700 font-bold h-10 p-2 rounded-lg min-w-[152px] cursor-pointer"
      :class="{'bg-slate-600': SETTINGS.voice === voice.name}"
      v-for="(voice, index) in filteredVoices"
      :key="'lang-' + update + '-' + index"
      @click="handleClick(voice)"
    ) {{ voice.name.replace('Microsoft ', '') }}
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
</script>
