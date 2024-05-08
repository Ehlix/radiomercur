<script setup lang="ts">
import { cn } from "@/lib/utils/twMerge";
import { getFlagImage } from "@/lib/api/getFlagImage";
import { type HTMLAttributes } from "vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XImage from "@/components/ui/image/XImage.vue";
import { Play, ThumbsUp, Star, ListPlus, Info } from "lucide-vue-next";
// import { defineAsyncComponent } from "vue";
// const XTooltip = defineAsyncComponent(
//   () => import("@/components/ui/tooltip/XTooltip.vue"),
// );
// const XImage = defineAsyncComponent(() => import("@/components/ui/image/XImage.vue"));
// const XIcon = defineAsyncComponent(() => import("@/components/ui/icon/XIcon.vue"));

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
      class="item-list relative w-full transition-all"
    >
      <div
        :class="
          cn(
            'flex h-10 w-full select-text items-center justify-start gap-2 rounded bg-hc-1 p-2 transition-opacity sm:h-24 sm:p-1',
          )
        "
      >
        <div
          class="flex h-full items-center gap-2 sm:flex-col-reverse sm:justify-between"
        >
          <!-- Add To Favorites -->
          <x-tooltip content-side="left">
            <template #trigger>
              <button
                class="flex items-center"
                @click="openAddToFavoriteModal(station)"
              >
                <ListPlus
                  :size="22"
                  :stroke-width="2"
                />
              </button>
            </template>
            <template #content>
              <span>{{ `${$t("buttons.addFavorite")}` }}</span>
            </template>
          </x-tooltip>
          <!-- Extended Info -->
          <x-tooltip content-side="left">
            <template #trigger>
              <button
                variant="ghost"
                class="flex items-center"
                @click="openExtendedInfo(station)"
              >
                <Info
                  :size="22"
                  :stroke-width="2"
                />
              </button>
            </template>
            <template #content>
              {{ $t("stationCard.extendedInfo") }}
            </template>
          </x-tooltip>
        </div>
        <!-- Play -->
        <button
          class="group flex h-full w-full items-center justify-start truncate"
          @click="selectStation(station)"
        >
          <Play
            :size="30"
            :stroke-width="1.5"
            class="-ml-1 min-w-8 transition-transform group-hover:scale-105"
          />
          <!-- Station Name -->
          <h2
            class="-ml-1 w-full truncate text-nowrap px-3 text-start text-tc-1 sm:max-h-full sm:text-wrap sm:text-base"
          >
            {{ station.name }}
          </h2>
        </button>
        <!-- Logo -->
        <!-- <div
          :class="cn('pointer-events-none absolute left-6 top-4 z-10 size-[6rem] select-none overflow-hidden rounded-full opacity-100', {
            'ml-4': showUpdateButton,
          })"
        >
          <div class="absolute inset-0 z-0 bg-mc-1 opacity-100" />
          <x-image
            :src="station.favicon"
            :height="6"
            :width="6"
            alt="logo"
            class="absolute inset-0 z-10 size-[6rem] object-cover opacity-40"
          />
        </div> -->
        <!-- Station Info -->
        <div class="flex h-full items-center justify-between gap-2 sm:flex-col">
          <!-- Station Popularity -->
          <div
            v-show="station.clickcount"
            class="flex w-full items-start justify-end gap-1 *:text-tc-2"
          >
            <p>{{ station.clickcount }}</p>
            <Star
              :size="18"
              :stroke-width="1.6"
            />
          </div>
          <div
            v-show="station.votes"
            class="flex min-w-16 items-start justify-end gap-1 *:text-tc-1"
          >
            <p>{{ station.votes }}</p>
            <ThumbsUp
              :size="18"
              :stroke-width="1.6"
            />
          </div>
          <!-- Station Flag -->
          <div class="flex w-full items-center justify-end">
            <x-image
              :src="getFlagImage(station.countrycode)"
              class="h-5 min-h-5 w-8 min-w-8"
              :height="5"
              :width="8"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
