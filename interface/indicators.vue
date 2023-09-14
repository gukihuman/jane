<template lang="pug">
div(class="h-5 w-full flex justify-start p-4 mb-4 gap-4")
  transition: div(
    class="bg-red-400 w-4 h-4 rounded-full opacity-0"
    :class="{'opacity-100': STORE.mic}"
  )
  transition: div(
    class="bg-gray-300 w-4 h-4 rounded-full opacity-0"
    :class="{'opacity-100': STORE.userTalking}"
  )
  transition: div(
    class="bg-[#d5bdaf] w-4 h-4 rounded-full opacity-0"
    :class="{'opacity-100': STORE.digitalTalking}"
  )
</template>
