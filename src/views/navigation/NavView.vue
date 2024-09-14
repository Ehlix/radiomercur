<script setup lang="ts">
import PlayerMain from "./components/player/PlayerMain.vue";
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import SettingsMain from "./components/settings/SettingsMain.vue";
import AboutMain from "@/components/modals/AboutMain.vue";
</script>

<template>
  <header class="z-50 flex w-full items-center justify-center h-fit gap-2">
    <!-- Logo -->
    <div
      class="relative flex h-full w-20 min-w-20 items-center justify-center overflow-hidden rounded bg-mc-2 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
    >
      <shadow-overlay />
      <h1 class="hidden">
        Radio Mercur
      </h1>
      <about-main />
    </div>
    <!-- Player -->
    <div class="relative h-fit w-full overflow-hidden rounded bg-mc-1">
      <shadow-overlay />
      <player-main />
    </div>
    <!-- Settings -->
    <div
      class="py- relative flex w-20 min-w-20 flex-col h-full overflow-hidden rounded bg-mc-2 *:rounded-none last:*:pb-2 even:*:pt-2 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
    >
      <shadow-overlay />
      <settings-main />
    </div>
  </header>
</template>
