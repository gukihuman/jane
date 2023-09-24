<template lang="pug">
div(class="flex bg-gray-700 w-full h-[60px] flex flex-col gap-1")
  input(v-model="NEW_VOICE.link" class="bg-gray-600 text-gray-300 w-full focus:outline-none px-4")
  div(class="flex gap-1")
    button(class="w-24 h-8 bg-slate-400 rounded-full" @click="SOCKET.io.emit('describeDirectories')") describe
    button(class="w-24 h-8 bg-amber-400/70 rounded-full" @click="SOCKET.io.emit('updateVectors')") update
    button(class="w-24 h-8 bg-teal-400/70 rounded-full" @click="SOCKET.io.emit('upsertVectors')") upsert
    button(class="w-24 h-8 bg-teal-400/70 rounded-full" @click="SOCKET.io.emit('queryRelevantFiles', 'sword')") getFiles
    button(class="w-24 h-8 bg-green-400/70 rounded-full" @click="NEW_VOICE.fetch()") get voice
    button(class="w-24 h-8 bg-blue-400/70 rounded-full" @click="GLOBAL.chat = !GLOBAL.chat; LOCAL.update()") chat
</template>
