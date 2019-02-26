<template>
  <div class="levels flex flex-col items-center justify-center">
    <a
      class="no-underline text-up font-bold absolute pin-t mx-auto my-2"
      @click="$router.go(-1)"
    >Back</a>
    <div class="tutorials text-center m-4">
      <h2 class="neon">Tutorials</h2>
      <button
        class="btn m-2"
        @click="$router.push('/game/tuto-1')"
        v-if="levelManager.isUnlocked('tuto-1')"
      >1 - Square</button>
      <button
        class="btn m-2"
        @click="$router.push('/game/tuto-2')"
        v-if="levelManager.isUnlocked('tuto-2')"
      >2 - Tap Square</button>
      <button
        class="btn m-2"
        @click="$router.push('/game/tuto-3')"
        v-if="levelManager.isUnlocked('tuto-3')"
      >3 - Circle</button>
      <button
        class="btn m-2"
        @click="$router.push('/game/tuto-4')"
        v-if="levelManager.isUnlocked('tuto-4')"
      >4 - Triangle</button>
      <button
        class="btn m-2"
        @click="$router.push('/game/tuto-5')"
        v-if="levelManager.isUnlocked('tuto-5')"
      >5 - Losange</button>
    </div>
    <div v-if="levelManager.isUnlocked('tuto-5')" class="freeplay text-center m-4">
      <h2 class="neon">Freeplay</h2>
      <button class="btn m-2" @click="$router.push('/game/freeplay')">Play</button>
    </div>
  </div>
</template>
