<script setup lang="ts">
import { genresList } from "@/lib/static/genresList";
import { useSearchStations } from "@/stores/searchStations";
import { useRouter } from "vue-router";

const searchStore = useSearchStations();
const router = useRouter();

const goToSearch = (name: string) => {
  searchStore.clearStationsList();
  searchStore.searchStations(name);
  router.push("/search");
};
</script>

<template>
  <div class="grid grid-cols-5 gap-10 bg-red-100 p-10">
    <button
      v-for="item of genresList"
      @click="goToSearch(item.name)"
      class="flex aspect-square h-full w-full items-center justify-center bg-gray-500"
    >
      <span>
        {{ item.name }}
      </span>
    </button>
  </div>
</template>
