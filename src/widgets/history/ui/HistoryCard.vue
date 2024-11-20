<script setup lang="ts">
import { Play } from "lucide-vue-next";

import { useUserStore } from "@/entities/user";
import { getFlagImage } from "@/shared/api";
import { messages } from "@/shared/lib/locale/locale";
import { removeMetadata } from "@/shared/lib/utils/removeMetaDataFromName";
import XIcon from "@/shared/ui/icon/XIcon.vue";
import XImage from "@/shared/ui/image/XImage.vue";

defineProps<{
  station: Station;
}>();

const emit = defineEmits<{
  (e: "playHandler", station: Station): void;
}>();
const { locale } = useUserStore();
const playHandler = (station: Station) => {
  emit("playHandler", station);
};
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- <button @click="playHandler(station)">
                    <x-icon :icon="Play" :size="22" :stroke-width="1.8" class="text-tc-1"/>
                  </button> -->
    <button
      class="group relative flex h-8 min-w-8 overflow-hidden rounded-full bg-bgc-1 *:size-8"
      @click="playHandler(station)"
    >
      <!-- <shadow-overlay class=" rounded-full" /> -->
      <div
        class="absolute top-0 z-10 flex size-full items-center justify-center opacity-95 shadow-[inset_0_0_5000px_2px_rgba(0,0,0,0.3)]"
      >
        <x-icon
          :icon="Play"
          :size="24"
          :stroke-width="2.5"
          class="ml-[0.12rem]"
        />
      </div>

      <x-image :src="station.favicon" :alt="station.name" class="z-0" />
    </button>
    <div
      v-if="station.countrycode"
      v-tooltip="
        // @ts-expect-error
        messages[locale || 'en']?.countries[station.countrycode] || ''
      "
    >
      <x-image
        :src="getFlagImage(station.countrycode)"
        class="h-5 w-8 min-w-8"
      />
    </div>
    <h2
      v-tooltip="station.name || 'Unknown station'"
      class="w-[50dvw] truncate text-nowrap text-left text-base xs:w-[60dvw]"
    >
      {{ removeMetadata(station.name || "Unknown station") }}
    </h2>
  </div>
</template>

<style scoped></style>
