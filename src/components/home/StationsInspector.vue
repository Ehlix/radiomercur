<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import XProgress from "@/components/ui/progress/Progress.vue";
import XInput from "@/components/ui/input/Input.vue";
import XImage from "@/components/ui/image/Image.vue";
import { Search } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/Icon.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col gap-5 overflow-y-auto overflow-x-hidden p-1"
  >
    <div class="flex h-fit w-full flex-col items-center justify-center bg-mc-1">
      <div class="relative w-full items-center">
        <x-input
          type="text"
          v-model="searchStore.searchInput"
          placeholder="Search"
          class="pl-8"
        />
        <x-icon
          :icon="Search"
          :size="32"
          class="absolute text-mc-3 inset-y-0 start-0 flex items-center justify-center px-1"
        />
      </div>
      <x-progress :model-value="searchStore.downloadProgress" class="w-full" />
    </div>
    <div class="my-2 flex w-full flex-wrap justify-center gap-5">
      <div
        v-for="station in searchStore.stationsList"
        class="flex w-fit gap-5 overflow-hidden bg-mc-2"
      >
        <button
          @click="userStationsStore.selectStation(station)"
          class="*:size-40"
        >
          <x-image :src="station.favicon || ''" :alt="station.name" />
        </button>
        <!-- <div>
          <p>{{ station.name }}</p>
          <p>{{ station.country }}</p>
          <p>{{ station.url }}</p>
          <p>{{ station.bitrate }}</p>
        </div> -->
      </div>
    </div>
  </div>
</template>
