<script setup lang="ts">
import { ShadowOverlay } from "@/shared/ui";
import AppearanceBar from "./AppearanceBar.vue";
import SyncUserData from "./SyncUserData.vue";
</script>

<template>
  <div
    class="relative flex h-full w-20 flex-col overflow-hidden rounded *:rounded-none md:w-14 md:min-w-14 sm:w-10 sm:min-w-10"
  >
    <shadow-overlay />
    <appearance-bar />
    <sync-user-data />
  </div>
</template>
