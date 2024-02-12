<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { cn } from "@/lib/utils/twMerge";

const route = useRoute();
const hideElem = computed(() => route.fullPath === "/");
</script>

<template>
  <div :class="cn('fixed bottom-0 left-0 flex h-20 w-full flex-col bg-mc-2', {
    hidden: hideElem
  })">
    <div class="container grid h-full w-full grid-cols-[1fr_auto_1fr]">
      <div>album art</div>
      <div>player controls</div>
      <div>song name</div>
    </div>
    <div class="h-5 bg-black" />
  </div>
  <div class="h-20" />
</template>
