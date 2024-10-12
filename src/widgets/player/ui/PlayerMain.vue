<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  Disc3,
  Info,
  ListPlus,
  MapPin,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-vue-next";

import { useUserStore } from "@/entities/user";
import { getLSData, setLSData } from "@/shared/api";
import { removeMetadata } from "@/shared/lib/utils/removeMetaDataFromName";
import { cn } from "@/shared/lib/utils/twMerge";
import { ShadowOverlay, XButton, XIcon, XImage, XSlider } from "@/shared/ui";
import { ExtendedInfo } from "@/features/extendedInfo";
import { AddToFavorite } from "@/features/favorites";
import { HistoryList } from "@/features/history";
import { useMapStore } from "@/features/map";
import { usePlayer } from "../use/usePlayer";
import PlayerVisual from "./PlayerVisual.vue";


const MAX_VOLUME = 100;

const dialogOpen = ref<"favorite" | "info" | false>(false);
const player = ref<HTMLAudioElement | null>(null);
const streamLink = ref<string | undefined>();

const { selectStation } = useMapStore();
const { selectedStation, playerVisualMode } = useUserStore();
const {
  autoPlay,
  isLoading,
  isPaused,
  errorHandler,
  loadingError,
  muteToggle,
  play,
  togglePlay,
  volume,
  wheelHandler,
} = usePlayer(player, streamLink, MAX_VOLUME);

const playHandler = () => {
  togglePlay(selectedStation.value?.url_resolved);
};

const mutedIcon = computed(() => {
  if (volume.value[0] === 0) {
    return VolumeX;
  }
  if (volume.value[0] <= 50) {
    return Volume1;
  }
  return Volume2;
});

const router = useRouter();

const goToMap = () => {
  if (selectedStation.value?.geo_lat && selectedStation.value?.geo_long) {
    selectStation(selectedStation.value);
    router.push("/map");
  }
};

watch(selectedStation, () => {
  const src = selectedStation.value?.url_resolved;
  src && play(src);
});

watch([volume], () => {
  if (!player.value) {
    return;
  }
  player.value.volume = volume.value[0] / 100;
  setLSData({ userSettings: { volume: volume.value[0] } });
});

onMounted(() => {
  const lsData = getLSData();
  volume.value = [lsData?.userSettings?.volume || 100];
});
</script>

<template>
  <div class="relative h-full w-full overflow-hidden rounded bg-mc-1 p-2">
    <shadow-overlay />
    <!-- Visualization -->
    <player-visual
      v-if="player && selectedStation"
      :player="player"
      :mode="playerVisualMode"
    />
    <div class="relative z-20 flex h-full w-full flex-col justify-between">
      <!-- BG Logo -->
      <div
        class="pointer-events-none absolute left-4 top-2 z-10 size-28 overflow-hidden rounded-full opacity-40"
      >
        <x-image
          :src="selectedStation?.favicon"
          :alt="selectedStation?.name"
          class="size-28 mix-blend-overlay"
        />
      </div>
      <div
        class="absolute -left-1 z-50 flex h-full flex-col items-center justify-between gap-2 sm:-left-2 sm:gap-0.5"
      >
        <!-- Error status -->
        <p
          v-if="loadingError"
          class="absolute bottom-0 left-8 text-nowrap text-red-500 sm:hidden"
        >
          ! Connection Error !
        </p>
        <!-- History -->
        <history-list />
        <!-- Add To Favorites -->
        <x-button
          v-if="selectedStation"
          v-tooltip:right="$t('buttons.addFavorite')"
          variant="ghost"
          size="icon"
          @click="dialogOpen = 'favorite'"
        >
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
        </x-button>
        <!-- Extra Info Trigger -->
        <x-button
          v-if="selectedStation"
          v-tooltip="$t('stationCard.extendedInfo')"
          variant="ghost"
          size="icon"
          @click="dialogOpen = 'info'"
        >
          <x-icon
            :icon="Info"
            :size="20"
            :stroke-width="2"
            class="cursor-pointer"
          />
          <extended-info
            v-if="dialogOpen === 'info'"
            :station="selectedStation"
            :open="dialogOpen === 'info'"
            @close="dialogOpen = false"
          />
        </x-button>
      </div>
      <!-- Station name -->
      <div
        class="z-40 flex h-[1.35rem] w-full items-center justify-center gap-2 px-6 sm:h-5"
      >
        <div
          v-if="selectedStation"
          class="flex animate-fade-in items-center justify-center gap-2 overflow-hidden"
        >
          <div
            :class="
              cn('flex size-4 min-h-4 min-w-4 rounded-full bg-mc-3', {
                'animate-pulse bg-mc-3': isLoading,
                'bg-red-500': loadingError,
                'bg-green-600': !isPaused && !isLoading && !loadingError,
              })
            "
          />
          <p
            v-if="selectedStation"
            class="w-fit truncate text-nowrap text-lg uppercase"
          >
            {{ removeMetadata(selectedStation?.name) }}
          </p>
        </div>
        <h1
          v-else
          class="absolute top-5 w-fit truncate text-nowrap text-2xl font-bold uppercase text-mc-2/70"
        >
          Radio Mercur
        </h1>
      </div>
      <!-- Go to map -->
      <x-button
        v-if="
          selectedStation &&
          selectedStation?.geo_lat &&
          selectedStation?.geo_long
        "
        variant="ghost"
        size="icon"
        class="absolute right-0 top-0 z-40 flex h-5 w-6 min-w-6 max-w-6 items-center justify-center rounded bg-mc-1"
        @click="goToMap"
      >
        <x-icon
          :icon="MapPin"
          :size="20"
          :stroke-width="2.5"
          class="text-tc-1"
        />
      </x-button>
      <!-- Controls -->
      <div
        v-if="selectedStation"
        class="pointer-events-none absolute flex h-full w-full animate-fade-in items-start gap-2 pt-[1.56rem] sm:pt-[1.5rem]"
      >
        <div
          class="relative z-10 flex h-full w-full items-center justify-center"
        >
          <!-- Play -->
          <x-button
            v-show="!isLoading"
            variant="ghost"
            :disabled="isLoading"
            class="pointer-events-auto size-12 min-w-12 max-w-12 rounded-full border-2 border-tc-1 stroke-[0.1rem] p-1 sm:size-10 sm:min-w-10 sm:max-w-10 sm:p-0.5"
            @click="playHandler()"
          >
            <x-icon
              :icon="isPaused ? Play : Pause"
              :class="
                cn('size-8 transition-transform', {
                  'translate-x-[0.11rem]': !isLoading && isPaused,
                })
              "
            />
          </x-button>
          <x-icon
            v-show="isLoading"
            :icon="Disc3"
            :stroke-width="0.8"
            class="size-14 animate-spin sm:size-12"
          />
        </div>
      </div>
      <div class="flex h-8 items-center text-red-500">
        <!-- Volume -->
        <div
          v-tooltip:left="volume + '%'"
          class="relative ml-auto w-fit xs:hidden"
          @wheel="wheelHandler"
        >
          <div class="absolute -left-1 -top-0.5 z-10">
            <x-button
              variant="ghost"
              size="icon"
              class="h-5 rounded-full"
              @click="muteToggle()"
            >
              <x-icon :stroke-width="1.8" :size="22" :icon="mutedIcon" />
            </x-button>
          </div>
          <x-slider v-model="volume" :max="MAX_VOLUME" :step="1" class="pb-2" />
        </div>
      </div>
    </div>
    <audio
      ref="player"
      :src="streamLink"
      crossorigin="anonymous"
      @change="playHandler()"
      @canplay="autoPlay()"
      @error="errorHandler()"
    />
  </div>
</template>
