<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import XInput from "@/components/ui/input/Input.vue";
const searchStore = useSearchStations();
</script>

<template>
  <div class="flex flex-col gap-5">
    <x-input type="text" v-model="searchStore.searchInput" />
    <div
      v-for="station in searchStore.stationsList"
      class="flex gap-5 bg-mc-2"
    >
    <div class="*:h-24 *:w-24">
      <img v-if="station.favicon" :src="station.favicon" alt="station logo" />
      <img v-else src="/logo.svg" alt="station logo" />
    </div>
      <div>
        <p>{{ station.name }}</p>
        <p>{{ station.country }}</p>
        <p>{{ station.url }}</p>
        <p>{{ station.bitrate }}</p>
      </div>
    </div>
  </div>
</template>
