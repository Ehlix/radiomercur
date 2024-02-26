<script setup lang="ts">
import XIcon from "@/components/ui/icon/Icon.vue";
import { navList } from "@/lib/static/navList";
import { cn } from "@/lib/utils/twMerge";
import SettingsBar from "@/components/navigation/SettingsBar.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";
import PlayerMain from "@/components/player/PlayerMain.vue";
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";

const nav = ref<Element | null>(null);
const scrollVisible = ref(false);

const scrollCheck = () => {
  scrollVisible.value =
    window.innerWidth !== document.documentElement.clientWidth;
};

onMounted(() => {
  if (nav.value) {
    new ResizeObserver(scrollCheck).observe(nav.value);
  }
});

onUnmounted(() => {
  if (nav.value) {
    new ResizeObserver(scrollCheck).unobserve(nav.value);
  }
});
</script>

<template>
  <header class="z-50 flex h-fit w-full items-center justify-center">
    <nav ref="nav" class="flex h-full w-full gap-2">
      <!-- Logo -->
      <div
        class="flex overflow-hidden relative rounded h-full w-[10%] min-w-[10%] items-center justify-center bg-mc-3"
      >
      <shadow-overlay />
        <h1 class="hidden">Radio Mercur</h1>
        <img src="/logo.svg" class="size-20" alt="logo" />
      </div>
      <!-- Player -->
      <div class="overflow-hidden relative h-fit w-full bg-mc-2 rounded">
        <shadow-overlay />
        <player-main />
      </div>
      <!-- Settings -->
      <div class="flex overflow-hidden relative w-[10%] min-w-[10%] bg-mc-3 rounded">
        <shadow-overlay />
        <settings-bar />
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
