<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { cn } from "@/lib/utils/twMerge";

const route = useRoute();
const hideElem = computed(() => route.fullPath === "/");

const togglePlay = () => {
  const audio = document.getElementById("stream") as HTMLAudioElement;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};
'http://hi5.death.fm/;stream.mp3'
</script>

<template>
  <div :class="cn('fixed bottom-0 left-0 flex h-20 w-full flex-col bg-mc-2', {
    hidden: hideElem
  })">
    <audio src ="" @change="togglePlay()" id="stream" autoplay></audio>
    <div class="container grid h-full w-full grid-cols-[1fr_auto_1fr]">
      <div>album art</div>
      <button @click="togglePlay()">Play</button>
    </div>
    <div class="h-5 bg-black" />
  </div>
  <div class="h-20" />
</template>
