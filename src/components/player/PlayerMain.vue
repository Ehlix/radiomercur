<script setup lang="ts">
import { cn } from "@/lib/utils/twMerge";
import XImage from "@/components/ui/image/Image.vue";
import { ref, watch } from "vue";
import { ChevronDown, ChevronUp, Play, Pause } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useUserStations } from "@/stores/userStations";
import XIcon from "@/components/ui/icon/Icon.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const { selectedStation } = storeToRefs(useUserStations());
const player = ref<HTMLAudioElement | null>(null);
const paused = ref<boolean>(true);
const loading = ref<boolean>(false);
const chevronIsOpen = ref(false);
const streamLink = ref<string | undefined>();

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
    streamLink.value = selectedStation.value.url_resolved;
    loading.value = true;
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

watch(selectedStation, () => {
  paused.value = true;
  loading.value = true;
  streamLink.value = selectedStation.value?.url_resolved;
});
</script>

<template>

    <collapsible v-model:open="chevronIsOpen">

      <div class=" h-full w-full">
        <div class="flex h-full gap-2">
          <div class="flex items-center justify-center">
            <collapsible-trigger class="w-5">
              <chevron-up v-if="!chevronIsOpen" />
              <chevron-down v-else />
            </collapsible-trigger>
          </div>
          <div class="flex items-center justify-center">
            <x-image
              :src="selectedStation?.favicon || ''"
              :alt="selectedStation?.name"
              class="h-20 w-20"
            />
          </div>
          <div class="flex w-full flex-col items-start justify-center">
            <div class="h-7">
              <p class="flex items-center justify-center">
                {{ selectedStation?.name || "123" }}
              </p>
            </div>
            <div class="flex h-full items-center justify-center">
              <button @click="togglePlay()">
                <x-icon :icon="paused ? Play : Pause" />
              </button>
            </div>
            <div class="flex h-7 items-center justify-center">
              <p>
                {{ loading ? "Loading..." : selectedStation?.bitrate }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <collapsible-content>
        <div>{{ selectedStation?.bitrate }} bitrate</div>
        <div>{{ selectedStation?.clickcount }} clicks</div>
        <div>{{ selectedStation?.country }}</div>
        <div>{{ selectedStation?.codec }} codec</div>
        <div>{{ selectedStation?.countrycode }} code country</div>
        <div>{{ selectedStation?.geo_lat }}</div>
        <div>Tags: {{ selectedStation?.tags }}</div>
        <div>Home page: {{ selectedStation?.homepage }}</div>
        <div>Music source: {{ selectedStation?.url }}</div>
      </collapsible-content>
    </collapsible>
  <audio
    ref="player"
    :src="streamLink"
    @change="togglePlay()"
    @canplay="autoPlay()"

  ></audio>
</template>
