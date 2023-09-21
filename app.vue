<template lang="pug">
div(class="bg-gray-900 w-full min-h-screen h-full")
  button(class="w-8 h-8 absolute bg-white" @click="SOCKET.io.emit('describeDirectories')")
  button(class="w-8 h-8 mt-12 absolute bg-green-300" @click="NEW_VOICE.fetch()")
  input(v-model="NEW_VOICE.link" class="absolute")
  chat
</template>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 80ms ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
::-webkit-scrollbar-track {
  background-color: #1f2937;
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
