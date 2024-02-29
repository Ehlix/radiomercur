<script setup lang="ts">
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import StationList from "../stationList/StationList.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
</script>

<template>
  <div class="relative flex gap-2 h-full w-full flex-col overflow-x-hidden overflow-y-scroll rounded bg-mc-2 p-2">
    <div v-for="station of userStationsStore.favoriteStations" class="h-20 text-center p-2 bg-hc-1">
      {{ station.name || "Unknown station" }}
    </div>
  </div>
</template>
