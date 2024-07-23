<script setup lang="ts">
import * as mt from "@maptiler/sdk";
import {
  shallowRef,
  onMounted,
  onUnmounted,
  markRaw,
  watch,
  defineAsyncComponent,
} from "vue";
import { useMapStore } from "@/stores/mapStore";
import XButton from "@/components/ui/button/XButton.vue";
import { useDebounceFn } from "@vueuse/core";
import GeoJSON, { type GeoJsonProperties } from "geojson";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { calculateDistance } from "@/lib/utils/calculateDistance";
import { Plus, Minus, Home, Disc3 } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XProgress from "@/components/ui/progress/XProgress.vue";
import globalConfig from "@/globalConfig";
import { useBaseUrlsStore } from "@/stores/baseUrlsStore";
const StationInfo = defineAsyncComponent(
  () => import("./components/StationInfo.vue"),
);

const {
  stationsList,
  selectedStation,
  selectStation,
  getStations,
  downloadProgress,
  loading,
} = useMapStore();
const { mainServerIsActive } = useBaseUrlsStore();
!stationsList.value.length && getStations();

const mapContainer = shallowRef<HTMLDivElement | null>(null);
const map = shallowRef<mt.Map | null>(null);
const geoJson = shallowRef<GeoJsonProperties | null>(null);
const marker = new mt.Marker({ color: "#a7a7a7" });
const customRamp = new mt.ColorRamp({
  stops: [{ value: 0, color: [0, 0, 0] }],
});
const initialOption = {
  lng: 13,
  lat: 37,
  zoom: 1.7,
  minZoom: 1.7,
  maxZoom: 10,
};

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
    selectStation({
      ...station?.properties,
      geo_lat: station.geometry.coordinates[1],
      geo_long: station.geometry.coordinates[0],
    });
  }
}, 20);

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
      center: [initialOption.lng, initialOption.lat],
      zoom: initialOption.zoom,
      minZoom: initialOption.minZoom,
      maxZoom: initialOption.maxZoom,
      navigationControl: false,
      geolocateControl: false,
      dragRotate: false,
    }),
  );
  map.value?.on("click", mouseMove);
};

const zoomIn = () => {
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

watch(
  selectedStation,
  async (value, oldValue) => {
    if (!value) return;
    await map.value?.onLoadAsync();
    if (!map.value) return;
    marker.remove();
    marker
      .setLngLat([value.geo_long || 0, value.geo_lat || 0])
      .addTo(map.value);
    if (value.geo_lat && value.geo_long) {
      const currentZoom = map.value.getZoom();
      if (oldValue && oldValue.geo_lat && oldValue.geo_long) {
        const distance = calculateDistance({
          lat1: value.geo_lat,
          lng1: value.geo_long,
          lat2: oldValue.geo_lat,
          lng2: oldValue.geo_long,
        });
        if (distance < 150000 / currentZoom) {
          return;
        }
      }
      map.value.flyTo({
        center: [value.geo_long, value.geo_lat],
        zoom:
          currentZoom <= initialOption.minZoom ? currentZoom + 2 : currentZoom,
      });
    }
  },
  { immediate: true },
);

watch([stationsList, map], async () => {
  renderMapPoints();
});

onMounted(() => {
  initiateMap();
});

onUnmounted(() => {
  map.value?.remove();
});
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
    <!-- Loading or No connection -->
    <div
      v-if="loading || !mainServerIsActive"
      class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center rounded bg-shc-2"
    >
      <x-icon
        v-if="mainServerIsActive"
        :icon="Disc3"
        :size="72"
        :stroke-width="1.2"
        class="animate-spin text-tc-1"
      />
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center gap-2 bg-mc-1"
      >
        <p class="text-center text-2xl text-tc-1">
          {{ $t("serverNoConnection.title") }}
        </p>
        <p class="mb-2 text-center text-xl text-tc-1">
          {{ $t("serverNoConnection.description") }}
        </p>
        <x-button @click="() => $router.go(0)">
          {{ $t("buttons.reload") }}
        </x-button>
      </div>
    </div>
    <!-- Map controls -->
    <div class="absolute right-2 top-2 z-40 flex w-10 flex-col gap-2">
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
    <station-info
      v-if="selectedStation"
      @zoom-in="zoomIn"
    />
  </div>
</template>
