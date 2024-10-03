<script setup lang="ts">
import XButton from "@/shared/ui/button/XButton.vue";
import XIcon from "@/shared/ui/icon/XIcon.vue";
import XImage from "@/shared/ui/image/XImage.vue";
import { getFlagImage } from "@/shared/api/flagImage";
import { Info, ListPlus, Play, Star, ThumbsUp } from "lucide-vue-next";
import { useSearchStore } from "@/stores/searchStore";

const { filters, stationsList, openDialog, selectStation } = useSearchStore();
</script>

<template>
  <div class="flex h-fit w-full animate-fade-in flex-col gap-2 px-2">
    <div
      v-for="station in stationsList"
      :key="station.stationuuid"
      class="item-list relative w-full"
    >
      <div
        class="flex h-fit w-full select-text items-center justify-start gap-2 rounded bg-hc-1 px-2 py-1 transition-opacity sm:flex-wrap sm:gap-0.5"
      >
        <div
          class="flex h-full items-center gap-2 sm:h-6 sm:justify-between sm:gap-1"
        >
          <!-- Add To Favorites -->
          <x-button
            v-tooltip="$t('buttons.addFavorite')"
            variant="ghost"
            size="icon"
          >
            <ListPlus
              :size="25"
              :stroke-width="1.8"
              @click="openDialog(station, 'favorite')"
            />
          </x-button>
          <!-- Extended Info -->
          <x-button
            v-tooltip="$t('stationCard.extendedInfo')"
            variant="ghost"
            size="icon"
            @click="openDialog(station, 'info')"
          >
            <Info :size="22" :stroke-width="2" />
          </x-button>
        </div>
        <!-- Play -->
        <x-button
          variant="ghost"
          class="h-full w-full justify-start p-0 px-1 sm:order-first sm:h-8 sm:min-w-full"
          @click="selectStation(station)"
        >
          <Play
            :stroke-width="1.5"
            class="-ml-1 size-8 min-w-8 transition-transform sm:-ml-2.5 sm:size-10"
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
            v-show="
              (station.clickcount ?? filters.order === 'clickcount') ||
              !filters.order
            "
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
            v-show="station.votes ?? filters.order === 'votes'"
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
