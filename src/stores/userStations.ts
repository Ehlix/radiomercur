import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useUserStations = defineStore("userStations", () => {
  const favoriteStations = ref<Station[]>([]);
  const onAirStation = ref<Station>();
  const selectedStation = ref<Station>();



  return { favoriteStations, onAirStation };
});
