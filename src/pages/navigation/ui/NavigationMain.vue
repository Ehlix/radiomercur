<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

import { cn } from "@/shared/lib/utils/twMerge";
import { ShadowOverlay } from "@/shared/ui";

const route = useRoute();
const variants = [
  {
    name: "search",
    path: "/",
  },
  {
    name: "favorite",
    path: "/favorite",
  },
  {
    name: "map",
    path: "/map",
  },
];
</script>

<template>
  <nav>
    <ul
      class="flex h-full w-20 min-w-20 flex-col gap-2 md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
    >
      <li
        v-for="variant of variants"
        :key="variant.path"
        :class="
          cn(
            'h-full w-full overflow-hidden rounded bg-mc-1 transition-colors hover:bg-hc-1',
            {
              'hover:bg-bg-3 bg-mc-2 text-bgc-1': route.path === variant.path,
            },
          )
        "
      >
        <router-link
          :to="variant.path"
          class="text-tx-1 relative flex h-full w-full items-center justify-center truncate"
        >
          <shadow-overlay />
          <div class="-rotate-90 whitespace-nowrap text-xl font-medium">
            {{ $t(variant.name) }}
          </div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
