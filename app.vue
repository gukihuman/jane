<template lang="pug">
div(class="bg-gray-900 w-screen min-h-screen")
  div(class="h-5 w-full flex justify-start p-4 mb-4 gap-4")
    transition: div(
      class="bg-red-400 w-4 h-4 rounded-full opacity-0"
      :class="{'opacity-100': STORE.recognizing}"
    )
    transition: div(
      class="bg-gray-300 w-4 h-4 rounded-full opacity-0"
      :class="{'opacity-100': STORE.userTalking}"
    )
    transition: div(
      class="bg-[#d5bdaf] w-4 h-4 rounded-full opacity-0"
      :class="{'opacity-100': STORE.digitalTalking}"
    )
  div(class="w-full flex justify-center rounded-lg")
    div(class="w-[700px] min-h-[500px] bg-gray-800 rounded-lg p-4")
      p(
        v-for="(message, index) in STORE.messages"
        :key="STORE.updateChat + index"
        class="bg-gray-800 p-2 rounded-lg"
        :class="textClass(message)"
      ) {{message.content}}
</template>
<script setup lang="ts">
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
onMounted(() => {
  let newLine = ""
  STORE.controller = new AbortController()
  const onSpeeachEnd = _.debounce(() => {
    STORE.userTalking = false
    STORE.controller = new AbortController()
    OPEN_AI.fetch()
    STORE.userLine = ""
    newLine = ""
  }, 1200)
  const w: any = window // type issues
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = "en-US"
  recognition.start()
  recognition.onstart = () => (STORE.recognizing = true)
  recognition.onend = () => (STORE.recognizing = false)
  recognition.onresult = (event) => {
    STORE.controller.abort()
    STORE.userTalking = true
    onSpeeachEnd()
    newLine = ""
    for (let i = event.resultIndex; i < event.results.length; i++) {
      newLine += event.results[i][0].transcript
    }
    STORE.userLine = newLine
    const lastMessage: any = _.last(STORE.messages)
    if (lastMessage.role !== "user") {
      STORE.messages.push({
        role: "user",
        content: STORE.userLine,
      })
    } else {
      lastMessage.content = STORE.userLine
    }
    STORE.updateChatIndex++
    STORE.updateChat = "chat" + STORE.updateChatIndex
  }
  addEventListener("keydown", (e) => {
    if (e.key === "o") {
      if (STORE.recognizing) {
        recognition.stop()
        STORE.recognizing = false
        STORE.mic = false
      } else {
        recognition.start()
        STORE.recognizing = true
        STORE.mic = true
      }
    }
  })
  setInterval(() => {
    if (STORE.recognizing || !STORE.mic) return
    console.log("recognizing stopped, try to start")
    try {
      recognition.start()
    } catch (e) {}
  }, 200)
})
</script>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 100ms ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
