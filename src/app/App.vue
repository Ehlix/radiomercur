<script setup lang="ts">
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import { RouterView } from "vue-router";
import AboutView from "@/views/about/AboutView.vue";
import PlayerView from "@/views/player/PlayerView.vue";
import SettingsView from "@/views/settings/SettingsView.vue";
import NavigationView from "@/views/navigation/NavigationView.vue";
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col gap-2 overflow-hidden p-2 py-2"
  >
    <header
      class="z-50 flex h-24 min-h-24 w-full items-center justify-center gap-2 sm:h-20 sm:min-h-20"
    >
      <about-view />
      <player-view />
      <settings-view />
    </header>
    <div class="flex h-full w-full gap-2 overflow-hidden">
      <navigation-view />
      <div class="relative h-full w-full overflow-hidden rounded bg-mc-1">
        <shadow-overlay />
        <router-view />
      </div>
    </div>
  </div>
</template>
