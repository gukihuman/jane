<template lang="pug">
div(class="bg-gray-900 w-full h-[1000px]")
  p(class="text-white") {{STORE.userTranscript}}
  div(v-if="talk" class="bg-yellow-400 w-4 h-4 rounded-full")
  p(class="text-yellow-400") {{STORE.digitalTranscript}}
  div(v-if="mic" class="bg-red-400 w-4 h-4 rounded-full")
  
</template>
<script setup lang="ts">
const talk = ref(false)
const mic = ref(true)
onMounted(() => {
  const w: any = window // type issues
  const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = "en-US"
  recognition.start()
  recognition.onresult = (event) => {
    talk.value = true
    onSpeeachEnd()
    STORE.userTranscript = ""
    _.forEach(event.results, (element) => {
      STORE.userTranscript += element[0].transcript
    })
  }
  addEventListener("keydown", (e) => {
    if (e.key === "o") {
      if (mic.value) {
        recognition.stop()
        mic.value = false
      } else {
        recognition.start()
        mic.value = true
      }
    }
  })
  // recognition.onaudiostart = () => {
  //   mic.value = true
  //   console.log("mic is connected")
  // }
  // recognition.onaudioend = () => {
  //   mic.value = false
  //   console.log("mic is disconnected")
  //   const startRecognitionInterval = setInterval(() => {
  //     console.log("try to reconnect")
  //     if (!mic.value) recognition.start()
  //     if (mic.value) {
  //       clearInterval(startRecognitionInterval)
  //       console.log("mic is reconnected")
  //     }
  //   }, 1000)
  // }
})
const onSpeeachEnd = _.debounce(() => {
  talk.value = false
  OPEN_AI.fetch()
}, 700)
</script>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
