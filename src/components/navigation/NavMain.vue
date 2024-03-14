<script setup lang="ts">
import XIcon from "@/components/ui/icon/Icon.vue";
import { navList } from "@/lib/static/navList";
import { cn } from "@/lib/utils/twMerge";
import { computed, ref, onMounted, onUnmounted } from "vue";
import PlayerMain from "@/components/player/PlayerMain.vue";
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";
import logoMain from "@/components/logo/logoMain.vue";
import SettingsMain from "../settings/SettingsMain.vue";

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
        class="relative flex h-full w-[10%] min-w-[10%] items-center justify-center overflow-hidden rounded bg-mc-2"
      >
        <shadow-overlay />
        <h1 class="hidden">Radio Mercur</h1>
        <logo-main class="size-20" />
      </div>
      <!-- Player -->
      <div class="relative h-fit w-full overflow-hidden rounded bg-mc-1">
        <shadow-overlay />
        <player-main />
      </div>
      <!-- Settings -->
      <div
        class="py- relative flex w-[10%] min-w-[10%] flex-col overflow-hidden rounded bg-mc-2 *:rounded-none last:*:pb-2 even:*:pt-2"
      >
        <shadow-overlay />
        <settings-main />
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
