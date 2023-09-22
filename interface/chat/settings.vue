<template lang="pug">
div(class="flex p-2 gap-4 h-8 text-slate-500")
  language-svg(
    class="cursor-pointer rounded-lg"
    :class="{'text-slate-400': GLOBAL.language}"
    @click="EVENTS.emitSingle('toggleLanguage')"
    )
  voices-svg(
    class="cursor-pointer rounded-lg"
    :class="{'text-slate-400': GLOBAL.voices}"
    @click="EVENTS.emitSingle('toggleVoices')"
    )
</template>
