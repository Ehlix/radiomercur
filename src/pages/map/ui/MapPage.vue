<script setup lang="ts">
import { useRouter } from "vue-router";
import { Disc3 } from "lucide-vue-next";

import { useBaseUrlsStore } from "@/entities/urls";
import { XButton, XIcon, XProgress } from "@/shared/ui";
import { useMapStore, WorldMap } from "@/features/map";


const router = useRouter();
const { stationsList, getStations, downloadProgress, loading } = useMapStore();
const { mainServerIsActive } = useBaseUrlsStore();

if (!stationsList.value.length) {
  getStations();
}
</script>

<template>
  <div class="relative h-full w-full">
    <world-map />
    <!-- Progress bar -->
    <x-progress
      :model-value="downloadProgress"
      class="fixed left-0 top-[6.5rem] h-2 w-full p-[0.1rem] sm:top-[5.5rem]"
    />
    <!-- Loading or No connection -->
    <div
      v-if="loading || !mainServerIsActive"
      class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center rounded bg-shc-2"
    >
      <x-icon
        v-if="mainServerIsActive"
        :icon="Disc3"
        :size="72"
        :stroke-width="1.2"
        class="animate-spin text-tc-1"
      />
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-2 bg-mc-1"
      >
        <p class="text-center text-2xl text-tc-1">
          {{ $t("serverNoConnection.title") }}
        </p>
        <p class="mb-2 text-center text-xl text-tc-1">
          {{ $t("serverNoConnection.description") }}
        </p>
        <x-button @click="() => router.go(0)">
          {{ $t("buttons.reload") }}
        </x-button>
      </div>
    </div>
  </div>
</template>
