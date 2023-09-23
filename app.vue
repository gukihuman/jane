<template lang="pug">
div(class="bg-gray-800 w-full h-full min-h-screen")
  gmenu
  chat(v-if="GLOBAL.chat")
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
  background-color: #374151;
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
