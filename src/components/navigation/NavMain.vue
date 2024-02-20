<script setup lang="ts">
import XIcon from "@/components/ui/icon/Icon.vue";
import { navList } from "@/lib/static/navList";
import { cn } from "@/lib/utils/twMerge";
import SettingsBar from "@/components/navigation/SettingsBar.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";
import PlayerMain from "@/components/player/PlayerMain.vue";

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
  <div class="h-24 w-full">
    <header
      class="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-center bg-mc-1"
    >
      <nav ref="nav" class="container flex h-full w-full">
        <div to="/" class="flex h-full items-center justify-center">
          <img src="/logo.svg" class="h-20" alt="logo" />
        </div>
        <player-main />
      </nav>
    </header>
  </div>
</template>

<style scoped></style>
