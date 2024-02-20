<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import XImage from "@/components/ui/image/Image.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
</script>

<template>
  <div class="relative flex w-full flex-col gap-5">
    <div class="my-2 flex w-full flex-wrap justify-center gap-5">
      <div
        v-for="station in searchStore.stationsList"
        class="flex w-fit gap-5 overflow-hidden bg-mc-2"
      >
        <button
          @click="userStationsStore.selectStation(station)"
          class="*:h-24 *:w-24"
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
