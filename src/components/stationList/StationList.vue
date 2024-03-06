<script setup lang="ts">
import { countriesList } from "@/lib/static/countriesList";
import { getFlagImage } from "@/api/getFlagImage";
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";
import XImage from "@/components/ui/image/Image.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { reactive, ref, watch, type HTMLAttributes } from "vue";
import { useDebounce, useElementSize } from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";
import { messages } from "@/lib/locale/locale";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Play,
  ThumbsUp,
  Star,
  Plus,
  Check,
  X,
} from "lucide-vue-next";

const props = defineProps<{
  stationsList: Station[];
  favoriteStations: Station[] | "add" | "remove";
  class?: HTMLAttributes["class"];
  userLocale?: "en" | "ru";
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
  (e: "addStationToFavorites", station: Station): void;
  (e: "removeStationFromFavorites", station: Station): void;
}>();

const selectStation = (station: Station) => {
  emits("selectStation", station);
};
const currentOpenId = ref("id");
const el = ref<HTMLElement | null>(null);
// const { width, height } = useElementSize(el);
// watch([width], () => {
//   // console.log(width.value)
// })

const infoOpenHandler = (station: Station) => {
  if (currentOpenId.value === station.stationuuid) {
    currentOpenId.value = "id";
  } else {
    currentOpenId.value = station.stationuuid || "id";
  }
};

const checkStationInFavorites = (station: Station) => {
  if (props.favoriteStations === "add") {
    return false;
  } else if (props.favoriteStations === "remove") {
    return true;
  } else {
    return props.favoriteStations.some(
      (s) => s.stationuuid === station.stationuuid,
    );
  }
};

const addToFavorites = (station: Station) => {
  emits("addStationToFavorites", station);
};
const removeFromFavorites = (station: Station) => {
  emits("removeStationFromFavorites", station);
};
</script>

<template>
  <div
    ref="el"
    v-if="stationsList.length"
    :class="cn('flex h-fit w-full flex-wrap gap-2  px-2', props.class)"
  >
    <Collapsible
      v-for.lazy="station in props.stationsList"
      :open="currentOpenId === station.stationuuid"
      :key="station.stationuuid"
      class="relative flex h-fit w-[19%] min-w-56 grow animate-[fadeIn_300ms_ease-out] select-text flex-col justify-start gap-2 overflow-clip rounded bg-gradient-to-br from-hc-1 to-mc-1 p-2 shadow-md shadow-black/30 transition-all"
    >
      <!-- Add To Favorites -->
      <div
        class="group absolute right-0 top-0 size-[2.2rem] overflow-hidden rounded-tr transition-all [clip-path:polygon(15%_0%,100%_0%,100%_85%)] hover:[clip-path:polygon(0%_0%,100%_0%,100%_100%)]"
      >
        <button
          v-if="!checkStationInFavorites(station)"
          @click="addToFavorites(station)"
          class="h-full w-full bg-mc-2"
        >
          <x-icon
            :icon="Plus"
            :size="18"
            :stroke-width="2"
            class="absolute right-0 top-0 transition-all"
          />
        </button>
        <button
          v-else-if="checkStationInFavorites(station)"
          @click="removeFromFavorites(station)"
          class="h-full w-full bg-teal-500 transition-all group-hover:bg-red-600"
        >
          <x-icon
            :icon="Check"
            :size="18"
            :stroke-width="2"
            class="absolute right-0 top-0 transition-all group-hover:hidden"
          />
          <x-icon
            :icon="X"
            :size="18"
            :stroke-width="2"
            class="absolute right-0 top-0 hidden transition-all group-hover:block"
          />
        </button>
      </div>
      <!-- <shadow-overlay class="z-0" /> -->

      <!-- animate-[fadeIn_100ms_ease-out_200ms_forwards] -->

      <!-- Station Name -->
      <h2 class="-mb-2 w-full truncate text-nowrap px-2 text-center">
        {{ removeMetadata(station.name || "Unknown station") }}
      </h2>
      <div class="flex w-fit justify-center gap-2">
        <!-- Station Select / Logo -->
        <button
          @click="selectStation(station)"
          class="group relative flex h-16 min-w-16 overflow-hidden rounded-full bg-bgc-1 transition-all *:size-16"
        >
          <!-- <shadow-overlay class=" rounded-full" /> -->
          <div
            class="absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 shadow-[inset_0_0_5000px_2px_rgba(0,0,0,0.4)] transition-all group-hover:opacity-95"
          >
            <x-icon :icon="Play" :size="40" :stroke-width="2.5" class="pl-1" />
          </div>

          <x-image
            :src="station.favicon || ''"
            :alt="station.name"
            class="z-0 transition-all group-hover:scale-110 group-hover:blur-[0.1rem]"
          />
        </button>
        <div class="w-full">
          <!-- Station Codec -->
          <p class="w-fit truncate text-nowrap">
            {{ station.codec + " " + (station.bitrate || "") }}
          </p>
          <!-- Station Country Name With Flag -->
          <div
            v-if="station.countrycode"
            class="my-1 flex items-center gap-1 overflow-clip"
          >
            <x-image :src="getFlagImage(station.countrycode)" class="h-5 w-8" />
            <p class="truncate text-nowrap">
              <!-- {{ countriesList[station.countrycode] }} -->

              {{
                // @ts-expect-error
                messages[props.userLocale || "en"]?.countries[
                  station.countrycode
                ] || ""
              }}
            </p>
          </div>
          <!-- Station Popularity -->
          <div class="flex gap-2 *:flex *:items-start *:gap-1">
            <div v-show="station.clickcount" class="*:text-tc-2">
              <p>{{ station.clickcount }}</p>
              <x-icon :icon="Star" :size="18" :stroke-width="1.6" />
            </div>
            <div v-show="station.votes" class="*:text-teal-500">
              <p>{{ station.votes }}</p>
              <x-icon :icon="ThumbsUp" :size="18" :stroke-width="1.6" />
            </div>
          </div>
        </div>
      </div>
      <!-- Open Trigger -->
      <div class="-mt-2 h-[1.20rem] w-full text-center">
        <button @click="infoOpenHandler(station)" class="w-5">
          <chevron-down
            :class="
              cn('transition-all', {
                'rotate-180 ': currentOpenId === station.stationuuid,
              })
            "
          />
        </button>
      </div>
      <CollapsibleContent class="-mt-2 flex flex-col">
        <div>
          <a
            v-if="station.homepage"
            :href="station.homepage"
            target="_blank"
            class="text-tc-2 transition-all hover:text-hc-2"
          >
            {{ $t("stationCard.homepage") }}
          </a>
        </div>
        <div>
          <a
            v-if="station?.url_resolved || station?.url"
            :href="station.url_resolved || station.url"
            target="_blank"
            class="text-tc-2 transition-all hover:text-hc-2"
          >
            {{ $t("stationCard.streamSource") }}
          </a>
        </div>
        <div v-if="station.tags" class="mt-1 flex flex-wrap gap-1">
          <div
            v-for="tag in station.tags.split(',').splice(0, 20)"
            class="rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
          >
            {{ tag }}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<style scoped></style>
