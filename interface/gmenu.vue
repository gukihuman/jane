<template lang="pug">
div(class="flex bg-gray-700 w-full h-[60px] flex flex-col gap-1")
  input(v-model="NEW_VOICE.link" class="bg-gray-600 text-gray-300 w-full focus:outline-none px-4")
  div(class="flex gap-1")
    button(class="w-24 h-8 bg-slate-400 rounded-full" @click="SOCKET.io.emit('describeDirectories')") update
    button(class="w-24 h-8 bg-green-400/70 rounded-full" @click="NEW_VOICE.fetch()") get voice
</template>
