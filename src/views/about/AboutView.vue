<script setup lang="ts">
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import AboutMain from "@/components/modals/AboutMain.vue";
</script>

<template>
  <div
    class="relative flex h-full w-20 min-w-20 items-center justify-center overflow-hidden rounded bg-mc-1 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
  >
    <shadow-overlay />
    <h1 class="hidden">Radio Mercur</h1>
    <about-main />
  </div>
</template>
