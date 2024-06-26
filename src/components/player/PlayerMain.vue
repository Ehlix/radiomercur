<script setup lang="ts">
import { computed, ref, watch, nextTick, defineAsyncComponent } from "vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { cn } from "@/lib/utils/twMerge";
import { useUserStore } from "@/stores/userStore";
import XImage from "@/components/ui/image/XImage.vue";
import XSlider from "@/components/ui/slider/XSlider.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import PlayerVisual from "./PlayerVisual.vue";
import HistoryList from "./HistoryList.vue";
import {
  Disc3,
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  ListPlus,
  Info,
} from "lucide-vue-next";
const AddToFavorite = defineAsyncComponent(
  () => import("../home/AddToFavorite.vue"),
);
const ExtendedInfo = defineAsyncComponent(
  () => import("../home/ExtendedInfo.vue"),
);

const { selectedStation, playerVisualMode } = useUserStore();
const player = ref<HTMLAudioElement | null>(null);
const paused = ref<boolean>(true);
const loading = ref<boolean>(false);
const loadingError = ref<boolean>(false);
const streamLink = ref<string | undefined>();
const volume = ref([100]);
const muteCache = ref([100]);
const MAX_VOLUME = 100;
const MIN_VOLUME = 0;
const dialogOpen = ref<"favorite" | "info" | false>(false);

const showIcon = computed(() => {
  if (volume.value[0] === 0) {
    return VolumeX;
  }
  if (volume.value[0] <= 50) {
    return Volume1;
  }
  return Volume2;
});

const pauseCheck = () => {
  if (!player.value) {
    return;
  }
  paused.value = player.value.paused;
};

const togglePlay = () => {
  if (!player.value || !selectedStation.value || loading.value) {
    return;
  }
  if (player.value.paused) {
    streamLink.value = undefined;
    nextTick(() => {
      streamLink.value = selectedStation.value?.url_resolved;
      loading.value = true;
    });
  } else {
    player.value.pause();
    streamLink.value = undefined;
  }
  pauseCheck();
};

const autoPlay = () => {
  if (!player.value || !streamLink.value) {
    return;
  }
  player.value.play();
  loading.value = false;
  pauseCheck();
};

const errorHandler = () => {
  if (!player.value) {
    return;
  }
  loading.value = false;
  loadingError.value = true;
};

const wheelHandler = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    volume.value = [Math.min(volume.value[0] + 10, MAX_VOLUME)];
  }
  if (event.deltaY > 0) {
    volume.value = [Math.max(volume.value[0] - 10, MIN_VOLUME)];
  }
};

const muteToggle = () => {
  if (volume.value[0] === 0) {
    volume.value = muteCache.value || [100];
  } else {
    muteCache.value = volume.value;
    volume.value = [0];
  }
};

watch(selectedStation, () => {
  player.value?.pause();
  loading.value = false;
  loadingError.value = false;
  togglePlay();
  // chevronIsOpen.value = false;
});

watch([volume], () => {
  if (!player.value) {
    return;
  }
  player.value.volume = volume.value[0] / 100;
});
</script>

<template>
  <div class="relative h-fit p-2">
    <!-- Visualization -->
    <player-visual
      v-if="player && selectedStation"
      :player="player"
      :mode="playerVisualMode"
    />
    <div
      class="relative z-20 flex h-20 w-full flex-col justify-between sm:h-16"
    >
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
        class="absolute -left-1 z-50 flex h-full flex-col items-center justify-between"
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
        <button
          v-if="selectedStation"
          class="h-5"
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
        </button>
        <!-- Extra Info Trigger -->
        <button
          v-if="selectedStation"
          class="h-5"
          @click="dialogOpen = 'info'"
        >
          <x-tooltip
            trigger-class=""
            content-side="right"
          >
            <template #trigger>
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
            </template>
            <template #content>
              <span>{{ `${$t("stationCard.extendedInfo")}` }}</span>
            </template>
          </x-tooltip>
        </button>
      </div>
      <!-- Station name -->
      <div
        class="z-40 flex h-[1.35rem] w-full items-center justify-center gap-2 pl-6 sm:h-5"
      >
        <div
          v-if="selectedStation"
          class="flex size-4 min-h-4 min-w-4 items-center justify-center overflow-hidden rounded-full"
        >
          <div
            :class="
              cn('size-full bg-mc-3', {
                'animate-pulse bg-mc-3': loading,
                'bg-red-500': loadingError,
                'bg-green-600': !paused && !loading && !loadingError,
              })
            "
          />
        </div>
        <p class="w-fit truncate text-nowrap text-lg">
          {{ removeMetadata(selectedStation?.name || "Radio Mercur") }}
        </p>
      </div>
      <!-- Controls -->
      <div
        class="pointer-events-none absolute flex h-full w-full items-start gap-2 pt-[1.56rem] sm:pt-[1.5rem]"
      >
        <div
          class="relative z-10 flex h-full w-full items-center justify-center"
        >
          <!-- Play -->
          <button
            v-show="!loading"
            :disabled="loading"
            class="pointer-events-auto flex size-12 items-center justify-center rounded-full border-2 border-tc-1 stroke-[0.1rem] p-1 transition-all sm:size-10"
            @click="togglePlay()"
          >
            <x-icon
              :icon="paused ? Play : Pause"
              :class="
                cn('size-8 transition-transform', {
                  'translate-x-[0.11rem]': !loading && paused,
                })
              "
            />
          </button>
          <x-icon
            v-show="loading"
            :icon="Disc3"
            :stroke-width="1"
            class="size-14 animate-spin sm:size-12"
          />
        </div>
      </div>
      <div class="flex h-8 items-center gap-2 text-red-500">
        <!-- Volume -->
        <div
          class="relative ml-auto w-fit xs:hidden"
          @wheel="wheelHandler"
        >
          <x-tooltip
            trigger-class="absolute left-0 top-0 z-10"
            content-side="left"
          >
            <template #trigger>
              <button @click="muteToggle()">
                <x-icon
                  :stroke-width="1.8"
                  :size="22"
                  :icon="showIcon"
                />
              </button>
            </template>
            <template #content>
              <span>{{
                `${$t("buttons.mute")} / ${$t("buttons.volume")}`
              }}</span>
            </template>
          </x-tooltip>
          <x-slider
            v-model="volume"
            :max="MAX_VOLUME"
            :step="1"
          />
        </div>
      </div>
    </div>
    <!-- Extra Info -->
    <audio
      ref="player"
      :src="streamLink"
      crossorigin="anonymous"
      @change="togglePlay()"
      @canplay="autoPlay()"
      @error="errorHandler()"
    />
  </div>
</template>
