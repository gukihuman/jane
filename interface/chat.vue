<template lang="pug">
div
  div(class="w-full flex justify-center rounded-lg")
    div(
      class="w-[700px] h-[500px]  bg-gray-800 rounded-lg p-4 overflow-y-scroll"
      ref="chat"
    )
      p(
        v-for="(message, index) in GLOBAL.messages"
        :key="GLOBAL.updateChat + index"
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
  REMOTE.cancelAbort()
  const onSpeeachEnd = _.debounce(() => {
    GLOBAL.userTalking = false
    REMOTE.cancelAbort()
    GLOBAL.messages.push({
      role: "system",
      content: TEXT.eachTimeInstruction,
    })
    REMOTE.fetch()
    GLOBAL.userLine = ""
    newLine = ""
  }, 1200)
  const w: any = window // type issues
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = "en-US"
  recognition.start()
  recognition.onstart = () => (GLOBAL.recognizing = true)
  recognition.onend = () => (GLOBAL.recognizing = false)
  recognition.onresult = (event) => {
    REMOTE.abort()
    VOICE.stop()
    GLOBAL.userTalking = true
    onSpeeachEnd()
    newLine = ""
    for (let i = event.resultIndex; i < event.results.length; i++) {
      newLine += event.results[i][0].transcript
    }
    GLOBAL.userLine = newLine
    const lastMessage: any = _.last(GLOBAL.messages)
    if (lastMessage.role !== "user") {
      GLOBAL.messages.push({
        role: "user",
        content: GLOBAL.userLine,
      })
    } else {
      lastMessage.content = GLOBAL.userLine
    }
    GLOBAL.updateChatIndex++
    GLOBAL.updateChat = "chat" + GLOBAL.updateChatIndex
    REFS.chat.scrollTop = REFS.chat.scrollHeight
  }
  EVENTS.onSingle("turnMic", () => {
    if (GLOBAL.recognizing) {
      recognition.stop()
      GLOBAL.recognizing = false
      GLOBAL.mic = false
      console.log("mic off")
    } else {
      recognition.start()
      GLOBAL.recognizing = true
      GLOBAL.mic = true
      console.log("mic on")
    }
  })
  // addEventListener("keydown", (e) => {
  //   if (e.key === "o") {
  //     if (GLOBAL.recognizing) {
  //       recognition.stop()
  //       GLOBAL.recognizing = false
  //       GLOBAL.mic = false
  //     } else {
  //       recognition.start()
  //       GLOBAL.recognizing = true
  //       GLOBAL.mic = true
  //     }
  //   }
  // })
  setInterval(() => {
    if (GLOBAL.recognizing || !GLOBAL.mic) return
    try {
      recognition.start()
    } catch (e) {}
  }, 200)
  setInterval(() => {
    if (Date.now() - GLOBAL.lastTimeDigitalSpeak < REMOTE.timeBeforeThinkMS) {
      return
    }
    if (!GLOBAL.mic || GLOBAL.digitalTalking) return
    if (Math.random() > 0.08) return
    GLOBAL.messages.push({
      role: "system",
      content: TEXT.ownThoughtsInstruction,
    })
    REMOTE.fetch()
  }, 1000)
})
</script>
