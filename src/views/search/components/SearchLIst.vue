<script setup lang="ts">
import { getFlagImage } from "@/lib/api/flagImage";
import { type HTMLAttributes } from "vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XImage from "@/components/ui/image/XImage.vue";
import XButton from "@/components/ui/button/XButton.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { Play, ThumbsUp, Star, ListPlus, Info } from "lucide-vue-next";

const props = defineProps<{
  stationsList: Station[];
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
  (e: "openAddToFavorite", station: Station): void;
  (e: "openExtendedInfo", station: Station): void;
}>();

const selectStation = (station: Station) => {
  emits("selectStation", station);
};

const openAddToFavoriteModal = (station: Station) => {
  emits("openAddToFavorite", station);
};

const openExtendedInfo = (station: Station) => {
  emits("openExtendedInfo", station);
};
</script>

<template>
  <div class="flex h-fit w-full flex-col gap-2 px-2">
    <div
      v-for="station in props.stationsList"
      :key="station.stationuuid"
      class="item-list relative w-full"
    >
      <div
        class="flex h-10 w-full select-text items-center justify-start gap-2 rounded bg-hc-1 p-2 py-1 transition-opacity sm:h-16 sm:flex-wrap sm:gap-0.5 sm:p-1"
      >
        <div
          class="flex h-full items-center gap-2 sm:h-6 sm:justify-between sm:gap-1"
        >
          <!-- Add To Favorites -->
          <x-tooltip
            content-side="left"
            trigger-class="cursor-pointer"
          >
            <template #trigger>
              <ListPlus
                :size="25"
                :stroke-width="1.8"
                @click="openAddToFavoriteModal(station)"
              />
            </template>
            <template #content>
              <span>{{ `${$t("buttons.addFavorite")}` }}</span>
            </template>
          </x-tooltip>
          <!-- Extended Info -->
          <x-tooltip
            content-side="left"
            trigger-class="cursor-pointer"
          >
            <template #trigger>
              <Info
                :size="22"
                :stroke-width="2"
                @click="openExtendedInfo(station)"
              />
            </template>
            <template #content>
              {{ $t("stationCard.extendedInfo") }}
            </template>
          </x-tooltip>
        </div>
        <!-- Play -->
        <x-button
          variant="ghost"
          class="group h-full w-full justify-start px-1 sm:order-first sm:h-8 sm:min-w-full"
          @click="selectStation(station)"
        >
          <Play
            :stroke-width="1.5"
            class="-ml-1 size-8 min-w-8 transition-transform group-hover:scale-105 sm:size-10"
          />
          <!-- Station Name -->
          <h2
            class="-ml-1 w-fit truncate text-nowrap px-3 text-start uppercase text-tc-1 sm:max-h-6 sm:text-wrap sm:text-base"
          >
            {{ station.name }}
          </h2>
        </x-button>
        <!-- Station Info -->
        <div
          class="flex h-full items-center justify-between gap-2 sm:ml-auto sm:h-6"
        >
          <!-- Station Popularity -->
          <div
            v-show="station.clickcount"
            class="flex w-full items-start justify-end gap-1 *:text-tc-2"
          >
            <p>{{ station.clickcount }}</p>
            <x-icon
              :icon="Star"
              :size="18"
              :stroke-width="1.6"
              class="w-6 min-w-6 max-w-6"
            />
          </div>
          <div
            v-show="station.votes"
            class="ml-2 flex min-w-16 items-start justify-end gap-1 *:text-tc-1"
          >
            <p>{{ station.votes }}</p>
            <x-icon
              :icon="ThumbsUp"
              :size="18"
              :stroke-width="1.6"
              class="w-6 min-w-6 max-w-6"
            />
          </div>
          <!-- Station Flag -->
          <div class="flex w-fit items-center justify-end">
            <x-image
              :src="getFlagImage(station.countrycode)"
              :height="20"
              :width="40"
              class="h-5 min-h-5 w-8 min-w-8"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
