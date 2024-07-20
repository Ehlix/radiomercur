<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import NavMain from "@/components/navigation/NavMain.vue";
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import { cn } from "./lib/utils/twMerge";

const variants = [
  {
    name: "rightPanelName",
    path: "/",
  },
  {
    name: "leftPanelName",
    path: "/favorite",
  },
  {
    name: "map",
    path: "/map",
  },
];
</script>

<template>
  <div
    class="container relative flex h-full max-h-[100dvh] w-full select-none flex-col gap-2 overflow-hidden p-2 py-2"
  >
    <nav-main />
    <div class="flex h-full w-full gap-2 overflow-hidden">
      <div
        class="flex h-full w-20 min-w-20 flex-col gap-2 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
      >
        <router-link
          v-for="variant of variants"
          :key="variant.path"
          :to="variant.path"
          :class="
            cn(
              'text-tx-1 relative flex h-full w-full items-center justify-center rounded bg-mc-1 transition-colors hover:bg-hc-1',
              {
                'hover:bg-bg-3 bg-mc-3 text-mc-1': $route.path === variant.path,
              },
            )
          "
        >
          <div class="-rotate-90 whitespace-nowrap text-xl font-medium">
            {{ $t(variant.name) }}
          </div>
        </router-link>
      </div>
      <div class="relative h-full w-full overflow-hidden rounded bg-mc-1">
        <shadow-overlay />
        <router-view />
      </div>
    </div>
  </div>
</template>
