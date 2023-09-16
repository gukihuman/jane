<template lang="pug">
div(class="bg-gray-900 w-full min-h-screen h-full")
  div(class="max-w-[1000px] mx-auto md:p-8 flex justify-center gap-2")
    div(class="rounded-lg w-[720px] bg-gray-800 md:p-2")
      cube
  keys(class="w-fit mx-auto hidden md:flex")
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
