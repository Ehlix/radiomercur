<script setup lang="ts">
import { RouterView } from "vue-router";

import { ShadowOverlay } from "@/shared/ui";
import { AboutMain } from "@/widgets/about";
import { PlayerMain } from "@/widgets/player";
import { SettingsMain } from "@/widgets/settings";
import { NavigationMain } from "@/pages/navigation";
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col gap-2 overflow-hidden p-2 py-2"
  >
    <header
      class="z-50 flex h-24 min-h-24 w-full items-center justify-center gap-2 sm:h-20 sm:min-h-20"
    >
      <about-main />
      <player-main />
      <settings-main />
    </header>
    <div class="flex h-full w-full gap-2 overflow-hidden">
      <navigation-main />
      <div class="relative h-full w-full overflow-hidden rounded bg-mc-1">
        <shadow-overlay />
        <router-view />
      </div>
    </div>
  </div>
</template>
