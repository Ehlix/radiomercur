<script setup lang="ts">
import XIcon from "@/components/ui/icon/Icon.vue";
import { navList } from "@/lib/static/navList";
import { cn } from "@/lib/utils/twMerge";
import SettingsBar from "@/components/navigation/SettingsBar.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const hideElem = computed(() => route.fullPath === "/");

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
  <header
    class="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-center bg-mc-1"
  >
    <nav ref="nav" class="container grid h-16 w-full grid-cols-[1fr_auto_1fr]">
      <div class="flex h-full min-w-16 py-1">
        <router-link to="/" class="w-fit">
          <img src="/logo.svg" class="h-14" alt="logo" />
        </router-link>
      </div>
      <div
        :class="
          cn(`flex justify-center`, {
            hidden: hideElem,
            ['ml-[7px]']: scrollVisible,
          })
        "
      >
        <div
          class="flex items-center justify-center gap-5 *:h-10 *:bg-mc-2 *:p-1 *:px-4"
        >
          <router-link v-for="item of navList" :to="item.link">
            <div class="flex gap-2">
              <x-icon :icon="item.icon" />
              <span class="capitalize">
                {{ item.title }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="col-start-3 flex items-center justify-end">
        <settings-bar />
      </div>
    </nav>
  </header>
  <div class="h-16 w-full" />
</template>

<style scoped></style>
