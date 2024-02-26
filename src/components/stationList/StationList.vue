<script setup lang="ts">
import { countriesList } from "@/lib/static/countriesList";
import { getFlagImage } from "@/api/getFlagImage";
import { Play } from "lucide-vue-next";
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";
import XImage from "@/components/ui/image/Image.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
const { stationsList } = defineProps<{
  stationsList: Station[];
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
}>();

const selectStation = (station: Station) => {
  emits("selectStation", station);
};
</script>

<template>
  <div
    v-if="stationsList.length"
    class="flex w-full flex-wrap gap-2 from-hc-1 p-2"
  >
    <div
      v-for.lazy="station in stationsList"
      :key="station.stationuuid"
      class="relative flex w-full select-text items-center gap-5 overflow-hidden rounded bg-gradient-to-r p-2"
      :class="'animate-[fadeIn_300ms_ease-out]'"
    >
      <!-- animate-[fadeIn_100ms_ease-out_200ms_forwards] -->
      <button
        @click="selectStation(station)"
        class="group relative flex min-w-20 overflow-hidden rounded-full bg-mc-1 *:size-20"
      >
        <shadow-overlay class="z-0 rounded-full" />
        <div
          class="absolute left-0 top-0 flex size-full items-center justify-center opacity-0 shadow-[inset_0_0_5000px_2px_rgba(0,0,0,0.4)] transition-all group-hover:opacity-95"
        >
          <x-icon :icon="Play" :size="40" :stroke-width="2.5" class="pl-1" />
        </div>

        <x-image :src="station.favicon || ''" :alt="station.name" />
      </button>
      <div class="">
        <h2>
          {{ removeMetadata(station.name || "Unknown station") }}
        </h2>
        <p>{{ station.codec + " " + (station.bitrate || "") }}</p>
        <div>
          <a
            v-if="station.homepage"
            :href="station.homepage"
            target="_blank"
            class="text-tc-2 transition-all hover:text-hc-2"
          >
            Home page
          </a>
        </div>
        <div v-if="station.countrycode" class="flex items-center gap-1 mb-1">
          <x-image :src="getFlagImage(station.countrycode)" class="h-5 w-8" />
          <p>
            {{ countriesList[station.countrycode] }}
          </p>
        </div>
        <div v-if="station.tags" class="flex flex-wrap gap-1">
          <div
            v-for="tag in station.tags.split(',').splice(0, 10)"
            class="rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
