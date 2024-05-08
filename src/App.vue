<script setup lang="ts">
import NavMain from "@/components/navigation/NavMain.vue";
import { useUserStore } from "./stores/userStore";
import { ref } from "vue";
import { defineAsyncComponent } from "vue";
import { cn } from "@/lib/utils/twMerge";
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
const FavoriteMain = defineAsyncComponent(
  () => import("@/components/home/favorite/FavoriteMain.vue"),
);
const SearchMain = defineAsyncComponent(
  () => import("@/components/home/search/SearchMain.vue"),
);

const variants = ["search", "favorite"];

const { favoriteStations } = useUserStore();
const panel = ref<(typeof variants)[number]>("search");

panel.value = favoriteStations.value["default"].stations.length
  ? "favorite"
  : "search";
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
        <button
          v-for="variant of variants"
          :key="variant"
          :disabled="panel === variant"
          :class="
            cn(
              'relative flex h-full w-full items-center justify-center rounded bg-mc-3 text-mc-1 transition-colors',
              {
                'text-tx-1 bg-mc-1 hover:bg-hc-1': panel !== variant,
              },
            )
          "
          @click="panel = variant"
        >
          <!-- <ShadowOverlay /> -->
          <div class="-rotate-90 whitespace-nowrap text-xl font-medium">
            {{ $t(variant === "search" ? "rightPanelName" : "leftPanelName") }}
          </div>
        </button>
        <!-- <button
          :class="
            cn(
              'relative flex h-full w-full items-center justify-center overflow-hidden rounded bg-mc-1 transition-colors hover:bg-hc-1',
              {
                'bg-mc-3 text-mc-1 hover:bg-mc-3': panel === 'favorite',
              },
            )
          "
          @click="panel = 'favorite'"
        >
          <ShadowOverlay />
          <div class="-rotate-90 whitespace-nowrap text-xl font-medium">
            {{ $t("leftPanelName") }}
          </div>
        </button> -->
      </div>
      <div class="relative h-full w-full overflow-hidden rounded bg-mc-1">
        <ShadowOverlay />
        <favorite-main v-show="panel === 'favorite'" />
        <search-main v-show="panel === 'search'" />
      </div>
    </div>
  </div>
</template>
