<template lang="pug">
div(class="w-full flex justify-center rounded-lg max-w-[700px] relative")
  div(
    class="flex-col w-full h-full max-w-[700px] min-h-screen md:min-h-[500px] h-[500px]  rounded-lg overflow-y-scroll relative pb-8 md:pb-0 transition-all duration-100"
    :class="{'opacity-60 blur-sm': GLOBAL.language || GLOBAL.voices}"
    ref="chat"
  )
    div(class="h-10 bg-gradient-to-b from-gray-900 to-gray-800")
    div(class="p-4")
      p(
        v-for="(message, index) in GLOBAL.messages"
        :key="'chat-' + index + '-' + GLOBAL.chatUpdateIndex"
        class="p-2 rounded-lg text-[20px]"
        :class="textClass(message)"
      ) {{message.content}}
  //- header
  div(class="w-full h-16 flex absolute h-10 bg-gradient-to-b from-gray-800 to-gray-800/70 p-2 mb-2 z-30")
    settings
    div(class="flex w-full justify-center")
      indicators(class="mr-[65px]")
  //- settings
  transition: language(v-if="GLOBAL.language" class="z-10" :key="'lang-' + GLOBAL.updateSettings")
  transition: voices(v-if="GLOBAL.voices" class="z-10" :key="'voice-' + GLOBAL.updateSettings")
</template>
<script setup lang="ts">
const chat = ref(null) // to update
const textClass = computed(() => {
  return (message) => {
    return {
      "text-[#d5bdaf]": message.role === "assistant",
      "text-right": message.role === "user",
      "text-gray-300": message.role === "user",
      hidden: message.role === "system",
    }
  }
})
onMounted(() => (REFS.chat = chat.value))
</script>
