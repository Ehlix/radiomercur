<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import XImage from "@/components/ui/image/Image.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
</script>

<template>
  <div class="relative overflow-auto flex w-full bg-mc-2 h-full flex-col gap-5 p-1">
    <div class=" flex w-full flex-wrap gap-1">
      <div
        v-for="station in searchStore.stationsList"
        class="relative flex w-full gap-5 overflow-hidden bg-mc-1 p-1 select-text rounded"
      >
        <button
          @click="userStationsStore.selectStation(station)"
          class="*:size-20 min-w-20"
        >
          <x-image :src="station.favicon || ''" :alt="station.name" />
        </button>
        <div class="">
          <p>{{ station.name }}</p>
          <a v-if="station.homepage" :href="station.homepage" target="_blank">Home page</a>
          <p>{{ station.codec + ' ' + station.bitrate }}</p>
          <div class="flex gap-1 items-center">
            <x-image :src="`https://flagcdn.com/w40/${station.countrycode?.toLowerCase()}.png`" class="w-7 h-5" />
            <p>{{ station.country }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
