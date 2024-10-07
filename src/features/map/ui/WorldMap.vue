<script setup lang="ts">
import globalConfig from "@/shared/config";
import { calculateDistance } from "@/shared/lib/utils/calculateDistance";
import { XButton, XIcon } from "@/shared/ui";
import * as mt from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useDebounceFn } from "@vueuse/core";
import GeoJSON, { type GeoJsonProperties } from "geojson";
import { Home, Minus, Plus } from "lucide-vue-next";
import { markRaw, onMounted, onUnmounted, shallowRef, watch } from "vue";
import { useMapStore } from "../model";
import StationInfo from "./StationInfo.vue";

const { stationsList, selectedStation, selectStation, getStations } =
  useMapStore();

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
  minZoom: 0.5,
  maxZoom: 10,
};

const mapClickHandler = useDebounceFn((e: mt.MapMouseEvent & Object) => {
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
      pitchWithRotate: false,
    }),
  );
  map.value?.on("click", mapClickHandler);
  map.value.flyTo({
    center: [initialOption.lng, initialOption.lat],
    zoom: 1.5,
  });
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
    zoom: selectedStation.value?.geo_long ? 10 : 0,
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
        zoom: currentZoom < 1 ? currentZoom + 2 : currentZoom,
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
  <div class="relative h-full w-full">
    <div
      ref="mapContainer"
      class="absolute z-0 h-full w-full *:*:cursor-pointer"
    />
    <!-- Map controls -->
    <div
      v-if="map"
      class="absolute right-2 top-2 z-20 flex w-fit flex-col gap-2 sm:bottom-8 sm:top-auto sm:flex-row"
    >
      <x-button
        class="min-h-10 min-w-10 p-2 *:text-bgc-1 sm:min-h-8 sm:min-w-8"
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
        class="min-h-10 min-w-10 p-2 *:text-bgc-1 sm:min-h-8 sm:min-w-8"
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
        class="min-h-10 min-w-10 p-2 *:text-bgc-1 sm:min-h-8 sm:min-w-8"
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
    <station-info v-if="selectedStation" @zoom-in="zoomIn" />
  </div>
</template>
