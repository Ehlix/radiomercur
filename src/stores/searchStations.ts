import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useDebounce } from "@vueuse/core";
import { getStations } from "@/api/getStations";

export const useSearchStations = defineStore("searchStations", () => {
  const stationsList = ref<Station[]>([]);
  const searchInput = ref<string>();
  const debSearch = useDebounce(searchInput, 500);

  const clearStationsList = () => {
    stationsList.value = [];
  };

  const searchStations = (name: string) => {
    const dataParams: DataParams = {
      name: name,
      order: "clickcount",
      limit: 20,
      reverse: true,
      hidebroken: true,
      offset: 0,
    };
    getStations("/stations/search" ,dataParams).then((res) => {
      stationsList.value = res;
      console.log(res);
    });
  };

  watch(debSearch, () => {
    if (!debSearch.value) {
      return;
    }
    searchStations(debSearch.value);
  });

  return { searchInput, stationsList, clearStationsList, searchStations };
});
