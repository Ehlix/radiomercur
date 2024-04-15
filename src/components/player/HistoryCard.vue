<script setup lang="ts">
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { Play } from "lucide-vue-next";
import { messages } from "@/lib/locale/locale";
import { getFlagImage } from "@/api/getFlagImage";
import XImage from "@/components/ui/image/XImage.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";

defineProps<{
  station: Station;
  userLocale?: string;
}>();

const emit = defineEmits<{
  (e: "playHandler", station: Station): void;
}>();

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

      <x-image
        :src="station.favicon"
        :alt="station.name"
        class="z-0"
      />
    </button>
    <x-tooltip>
      <template #trigger>
        <x-image
          v-if="station.countrycode"
          :src="getFlagImage(station.countrycode)"
          class="h-5 w-8 min-w-8"
        />
      </template>
      <template #content>
        <div>
          {{
            // @ts-expect-error
            messages[userLocale || "en"]?.countries[
              // @ts-expect-error
              station.countrycode
            ] || ""
          }}
        </div>
      </template>
    </x-tooltip>

    <x-tooltip>
      <template #trigger>
        <h2
          class="w-[50dvw] truncate text-nowrap text-left text-base xs:w-[60dvw]"
        >
          {{ removeMetadata(station.name || "Unknown station") }}
        </h2>
      </template>
      <template #content>
        {{ station.name || "Unknown station" }}
      </template>
    </x-tooltip>
  </div>
</template>

<style scoped></style>
