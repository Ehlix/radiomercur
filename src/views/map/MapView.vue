<script setup lang="ts">
import * as mt from "@maptiler/sdk";
import {
  shallowRef,
  onMounted,
  onUnmounted,
  markRaw,
  watch,
  defineAsyncComponent,
  ref,
} from "vue";
import { useMapStore } from "@/stores/mapStore";
import XButton from "@/components/ui/button/XButton.vue";
import { useDebounceFn } from "@vueuse/core";
import GeoJSON, { type GeoJsonProperties } from "geojson";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { calculateDistance } from "./utils/calculateDistance";
import {
  ThumbsUp,
  Star,
  ListPlus,
  Play,
  ZoomIn,
  Plus,
  Minus,
  Home,
  Disc3,
} from "lucide-vue-next";
import { getFlagImage } from "@/lib/api/flagImage";
import XImage from "@/components/ui/image/XImage.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XProgress from "@/components/ui/progress/XProgress.vue";
import { messages } from "@/lib/locale/locale";
import { useUserStore } from "@/stores/userStore";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import globalConfig from "@/globalConfig";
const AddToFavorite = defineAsyncComponent(
  () => import("@/components/home/AddToFavorite.vue"),
);

const { locale, selectStation } = useUserStore();
const { stationsList, getStations, downloadProgress, loading } = useMapStore();
!stationsList.value.length && getStations();

const dialogOpen = ref<"favorite" | "info" | false>(false);
const mapContainer = shallowRef<HTMLDivElement | null>(null);
const map = shallowRef<mt.Map | null>(null);
const selectedStation = shallowRef<Station | null>(null);
const geoJson = shallowRef<GeoJsonProperties | null>(null);
const marker = new mt.Marker({ color: "#a7a7a7" });
const customRamp = new mt.ColorRamp({
  stops: [{ value: 0, color: [0, 0, 0] }],
});
const mouseMove = useDebounceFn((e: mt.MapMouseEvent & Object) => {
  const lat = e.lngLat.lat;
  const lng = e.lngLat.lng;
  const zoom = e.target.getZoom();
  const stationList = geoJson.value?.features.filter((s: any) => {
    const a = 100 - Math.trunc(zoom);
    const b = a < 0 ? 0.3 : a * 0.1;
    const lngDiff = s?.geometry?.coordinates[0] - lng;
    const latDiff = s?.geometry?.coordinates[1] - lat;
    if (lngDiff < b && lngDiff > -b && latDiff < b && latDiff > -b) {
      return true;
    }
  });

  const station = stationList
    ?.map((s: any) => {
      return {
        ...s,
        distance: calculateDistance({
          lat1: s.geometry.coordinates[1],
          lng1: s.geometry.coordinates[0],
          lat2: lat,
          lng2: lng,
        }),
      };
    })
    .sort((a: any, b: any) => a.distance - b.distance)[0];

  if (!station) {
    return;
  } else {
    selectedStation.value = {
      ...station?.properties,
      geo_lat: station.geometry.coordinates[1],
      geo_long: station.geometry.coordinates[0],
    };
  }
}, 50);

const zoomHandler = () => {
  if (!map.value) {
    return;
  }
  map.value.flyTo({
    center: [
      selectedStation.value?.geo_long || 0,
      selectedStation.value?.geo_lat || 0,
    ],
    zoom: selectedStation.value?.geo_long ? 8 : 0,
  });
};

const renderMapPoints = async () => {
  if (!stationsList.value.length) return;
  if (!map.value) return;
  await map.value.onLoadAsync();

  // @ts-expect-error
  const data = await GeoJSON.parse(stationsList.value, {
    Point: ["geo_lat", "geo_long"],
  });

  geoJson.value = data;
  mt.helpers.addPoint(map.value, {
    data,
    property: "clickcount",
    pointColor: customRamp.scale(1, 2),
    outline: true,
    outlineWidth: 1,
    outlineColor: "#c7c7c7",
    zoomCompensation: true,
  });
};

const initiateMap = () => {
  mt.config.apiKey = globalConfig.mapTilerApiKey;

  map.value = markRaw(
    new mt.Map({
      container: mapContainer.value!,
      style: mt.MapStyle.SATELLITE,
      center: [0, 0],
      zoom: 0,
      minZoom: 0,
      maxZoom: 10,
      navigationControl: false,
      geolocateControl: false,
    }),
  );

  map.value?.on("click", mouseMove);
};

watch(selectedStation, (value) => {
  if (!value || !map.value) return;
  marker.remove();
  marker.setLngLat([value.geo_long || 0, value.geo_lat || 0]).addTo(map.value);
});

watch([stationsList, map], async () => {
  renderMapPoints();
});

onMounted(() => {
  initiateMap();
});

onUnmounted(() => {
  map.value?.remove();
});
//     // window.open(`https://www.google.com/maps/search/?api=1&query=${station.geo_lat},${station.geo_long}`, '_blank');
</script>

<template>
  <!-- <div ref="mapDiv" class="map" /> -->
  <div class="relative h-full w-full">
    <div
      ref="mapContainer"
      class="absolute z-0 h-full w-full *:*:cursor-pointer"
    />
    <!-- Progress bar -->
    <x-progress
      :model-value="downloadProgress"
      class="fixed left-0 top-[6.5rem] h-2 w-full p-[0.1rem] sm:top-[5.5rem]"
    />
    <div
      v-if="loading"
      class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center rounded bg-mc-1 opacity-80"
    >
      <x-icon
        :icon="Disc3"
        :size="72"
        :stroke-width="1.2"
        class="animate-spin text-bgc-1"
      />
    </div>
    <!-- Map controls -->
    <div class="absolute right-2 top-2 z-30 z-40 flex w-10 flex-col gap-2">
      <x-button
        class="h-full min-w-full p-2"
        @click="() => map?.zoomIn()"
      >
        <x-icon
          :icon="Plus"
          :size="22"
          :stroke-width="2"
          class="cursor-pointer"
        />
      </x-button>
      <x-button
        class="h-full min-w-full p-2"
        @click="() => map?.zoomOut()"
      >
        <x-icon
          :icon="Minus"
          :size="22"
          :stroke-width="2"
          class="cursor-pointer"
        />
      </x-button>
      <x-button
        class="h-full min-w-full p-2"
        @click="map?.zoomTo(0)"
      >
        <x-icon
          :icon="Home"
          :size="22"
          :stroke-width="2"
          class="cursor-pointer"
        />
      </x-button>
    </div>
    <!-- Station Info -->
    <div
      v-if="selectedStation"
      class="absolute left-2 top-2 z-40 flex h-fit w-72 flex-col gap-2 rounded bg-mc-1 p-2"
    >
      <p class="w-full truncate text-nowrap text-lg uppercase">
        {{ removeMetadata(selectedStation?.name || "Unknown") }}
      </p>
      <div class="relative z-10 flex grow flex-col gap-2">
        <!-- Logo -->
        <div
          class="absolute right-0 top-0 z-0 size-[8rem] select-none overflow-hidden"
        >
          <div class="absolute inset-0 z-0 bg-mc-1" />
          <x-image
            :src="selectedStation.favicon"
            :alt="selectedStation.name"
            class="absolute inset-0 size-[8rem] object-cover"
          />
        </div>
        <div class="relative z-20 flex flex-col">
          <!-- Popularity -->
          <div class="flex flex-col gap-1">
            <div
              :v-if="selectedStation?.clickcount"
              class="flex items-start gap-1"
            >
              <p>
                {{ $t("stationCard.clickCount") }}:
                <span class="text-tc-2">
                  {{ selectedStation?.clickcount }}
                </span>
              </p>
              <x-icon
                :icon="Star"
                :size="18"
                :stroke-width="1.6"
                class="text-tc-2"
              />
            </div>
            <div
              v-show="selectedStation?.votes"
              class="flex items-start gap-1"
            >
              <p class="text-tc-1">
                {{ $t("stationCard.votes") }}:
                <span class="text-tc-1">
                  {{ selectedStation?.votes }}
                </span>
              </p>
              <x-icon
                :icon="ThumbsUp"
                :size="18"
                :stroke-width="1.6"
                class="text-tc-1"
              />
            </div>
          </div>
          <!-- Codec -->
          <div v-if="selectedStation?.codec">
            {{ selectedStation.codec + " " + (selectedStation.bitrate || "") }}
          </div>
          <!-- Home Page -->
          <div>
            <a
              v-if="selectedStation?.homepage"
              :href="selectedStation.homepage"
              target="_blank"
              class="text-tc-2 transition-all hover:text-hc-2"
            >
              {{ $t("stationCard.homepage") }}
            </a>
          </div>
          <!-- Stream Source -->
          <div>
            <a
              v-if="selectedStation?.url_resolved || selectedStation?.url"
              :href="selectedStation.url_resolved || selectedStation.url"
              target="_blank"
              class="text-tc-2 transition-all hover:text-hc-2"
            >
              {{ $t("stationCard.streamSource") }}
            </a>
          </div>
          <!-- Flag ana Country Name -->
          <div
            v-if="selectedStation?.countrycode"
            class="my-1 flex items-center gap-1 overflow-clip"
          >
            <x-image
              :src="getFlagImage(selectedStation?.countrycode)"
              class="h-5 w-8"
            />
            <p class="truncate text-nowrap">
              <!-- {{ countriesList[currentStation.countrycode] }} -->

              {{
                // @ts-expect-error
                messages[locale || "en"]?.countries[
                  selectedStation?.countrycode
                ] || ""
              }}
            </p>
          </div>
          <!-- Tags -->
          <div
            v-if="selectedStation?.tags"
            class="mt-2 flex flex-wrap gap-1"
          >
            <div
              v-for="tag in selectedStation.tags.split(',').splice(0, 10)"
              :key="tag"
              class="text-wrap rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
            >
              {{ tag }}
            </div>
          </div>
        </div>
        <div class="flex justify-between gap-1">
          <!-- Add To Favorites -->
          <x-button
            v-if="selectedStation"
            @click="dialogOpen = 'favorite'"
          >
            <x-tooltip
              trigger-class=""
              content-side="right"
            >
              <template #trigger>
                <add-to-favorite
                  v-if="dialogOpen === 'favorite'"
                  :station="selectedStation"
                  :open="dialogOpen === 'favorite'"
                  @close="dialogOpen = false"
                />
                <x-icon
                  :icon="ListPlus"
                  :size="22"
                  :stroke-width="2"
                  class="cursor-pointer"
                />
              </template>
              <template #content>
                <span>{{ `${$t("buttons.addFavorite")}` }}</span>
              </template>
            </x-tooltip>
          </x-button>
          <x-button
            class="z-10 mt-auto w-full"
            @click="() => selectedStation && selectStation(selectedStation)"
          >
            <x-icon
              :icon="Play"
              :size="22"
              :stroke-width="2"
              class="cursor-pointer"
            />
          </x-button>
          <x-button @click="zoomHandler">
            <x-icon
              :icon="ZoomIn"
              :size="22"
              :stroke-width="2"
              class="cursor-pointer"
            />
          </x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
