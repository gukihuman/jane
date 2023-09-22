<template lang="pug">
div(class="flex gap-3 md:gap-8 h-fit rounded-lg pt-2")
  div(class="flex gap-2")
    transition: icon(
      :variable="GLOBAL.assistant"
      class="bg-slate-500 cursor-pointer"
      @click="EVENTS.emitSingle('toggleAssistant'); LOCAL.update()"
    ): chat-bubble(class="text-slate-300")
    transition: icon(:variable="GLOBAL.digitalTalking")
      waves(class="text-slate-400 rotate-45")
  div(class="flex gap-2")
    icon(
      :variable="GLOBAL.mic"
      class="bg-slate-500 cursor-pointer"
      @click="EVENTS.emitSingle('toggleMic'); LOCAL.update()"
    ): mic(class="flex text-slate-300")
    icon(:variable="GLOBAL.userTalking")
      waves(class="text-slate-400 rotate-45")
</template>
