<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { messages } from "@/lib/locale/locale";
import { cn } from "@/lib/utils/twMerge";
import { getFlagImage } from "@/api/getFlagImage";
import { useUserStore } from "@/stores/userStore";
import XImage from "@/components/ui/image/Image.vue";
import XSlider from "@/components/ui/slider/Slider.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Play,
  Pause,
  ThumbsUp,
  Star,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-vue-next";

const { selectedStation, locale } = storeToRefs(useUserStore());
const player = ref<HTMLAudioElement | null>(null);
const paused = ref<boolean>(true);
const loading = ref<boolean>(false);
const loadingError = ref<boolean>(false);
const infoIsOpen = ref(false);
const streamLink = ref<string | undefined>();
const volume = ref([100]);
const muteCache = ref([100]);
const MAX_VOLUME = 100;
const MIN_VOLUME = 0;

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
  if (!player.value || !streamLink) {
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
  <collapsible v-model:open="infoIsOpen" class="h-fit p-2">
    <div class="relative flex h-20 w-full flex-col justify-between sm:h-16">
      <!-- BG Logo -->
      <div
        class="pointer-events-none absolute left-2 top-2 z-0 size-28 overflow-hidden rounded-full opacity-20"
      >
        <x-image
          :src="selectedStation?.favicon"
          :alt="selectedStation?.name"
          class="size-28"
        />
      </div>
      <!-- Extra Info -->
      <div class="absolute -left-2 top-[4.2rem] sm:top-[3.2rem]">
        <collapsible-trigger
          :disabled="!selectedStation"
          class="w-5 transition-all disabled:opacity-20"
        >
          <chevron-down
            :class="
              cn('transition-all', {
                'rotate-180 ': infoIsOpen,
              })
            "
          />
        </collapsible-trigger>
      </div>
      <!-- Station name -->
      <div
        class="z-10 flex h-[1.35rem] w-full items-center justify-center gap-2 sm:h-5"
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
            @click="togglePlay()"
            class="pointer-events-auto flex size-12 items-center justify-center rounded-full border-2 border-tc-1 stroke-[0.1rem] p-1 transition-all hover:bg-hc-1 sm:size-10"
          >
            <x-icon
              :icon="paused ? Play : Pause"
              :class="
                cn('size-8', {
                  'translate-x-[0.13rem]': paused,
                })
              "
            />
          </button>
        </div>
      </div>
      <div class="flex h-8 items-center gap-2 text-red-500">
        <!-- Error status -->
        <p v-if="loadingError" class="sm:hidden">! Connection Error !</p>
        <!-- Volume -->
        <div class="relative ml-auto w-fit xs:hidden" @wheel="wheelHandler">
          <button @click="muteToggle()" class="absolute left-0 top-0 z-10">
            <x-icon :stroke-width="1.8" :size="22" :icon="showIcon" />
          </button>
          <x-slider v-model="volume" :max="MAX_VOLUME" :step="1" />
        </div>
      </div>
    </div>
    <collapsible-content>
      <div class="h-10" />
      <!-- Popularity -->
      <div class="flex flex-col *:flex *:items-center *:gap-1">
        <div v-show="selectedStation?.clickcount" class="*:text-mc-3">
          <p>{{ selectedStation?.clickcount }}</p>
          <x-icon :icon="Star" :size="20" />
        </div>
        <div v-show="selectedStation?.votes" class="*:text-teal-500">
          <p>{{ selectedStation?.votes }}</p>
          <x-icon :icon="ThumbsUp" :size="20" />
        </div>
      </div>
      <!-- Codec -->
      <div v-if="selectedStation?.codec">
        {{ selectedStation.codec + " " + (selectedStation.bitrate || "") }}
      </div>
      <!-- Geo -->
      <div>{{ selectedStation?.geo_lat }}</div>
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
        class="mt-1 flex items-center gap-1"
      >
        <x-image
          :src="getFlagImage(selectedStation?.countrycode)"
          class="h-5 w-8"
        />
        <p>
          {{
            // @ts-expect-error
            messages[locale || "en"]?.countries[selectedStation.countrycode] ||
            ""
          }}
        </p>
      </div>
      <!-- Tags -->
      <div v-if="selectedStation?.tags" class="mt-2 flex flex-wrap gap-1">
        <div
          v-for="tag in selectedStation.tags.split(',').splice(0, 10)"
          class="rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
        >
          {{ tag }}
        </div>
      </div>
    </collapsible-content>
  </collapsible>
  <audio
    ref="player"
    :src="streamLink"
    @change="togglePlay()"
    @canplay="autoPlay()"
    @error="errorHandler()"
  ></audio>
</template>
@/stores/userStore
