<template lang="pug">
div(class="bg-gray-900 w-screen min-h-screen")
  indicators
  div(class="w-full flex justify-center rounded-lg")
    div(
      class="w-[700px] h-[500px]  bg-gray-800 rounded-lg p-4 overflow-y-scroll"
      ref="chat"
    )
      p(
        v-for="(message, index) in STORE.messages"
        :key="STORE.updateChat + index"
        class="bg-gray-800 p-2 rounded-lg text-[20px]"
        :class="textClass(message)"
      ) {{message.content}}
</template>
<script setup lang="ts">
const chat = ref(null)
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
  REFS.chat = chat.value
  let newLine = ""
  STORE.controller = new AbortController()
  const onSpeeachEnd = _.debounce(() => {
    STORE.userTalking = false
    STORE.controller = new AbortController()
    STORE.messages.push({
      role: "system",
      content: TEXT.eachTimeInstruction,
    })
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
    REFS.chat.scrollTop = REFS.chat.scrollHeight
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
    try {
      recognition.start()
    } catch (e) {}
  }, 200)
  setInterval(() => {
    if (Date.now() - STORE.lastTimeDigitalSpeak < OPEN_AI.timeBeforeThinkMS) {
      return
    }
    if (!STORE.mic || STORE.digitalTalking) return
    if (Math.random() > 0.08) return
    STORE.messages.push({
      role: "system",
      content: TEXT.ownThoughtsInstruction,
    })
    OPEN_AI.fetch()
  }, 1000)
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
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #2b333f;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #424f62;
}
::-webkit-scrollbar-corner {
  background-color: transparent;
}
::-webkit-scrollbar {
  width: 10px;
}
</style>
