<script setup lang="ts">
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History, Play } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { useUserStore } from "@/stores/userStore";
import { useSearchStations } from "@/stores/searchStations";
import { getFlagImage } from "@/api/getFlagImage";
import XImage from "@/components/ui/image/XImage.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
const searchStore = useSearchStations();
const userStore = useUserStore();
import { messages } from "@/lib/locale/locale";
import { generateId } from "@/lib/utils/generateId";

const playHandler = (station: Station) => {
  userStore.selectStation(station);
  searchStore.addToHistory(station);
};
</script>

<template>
  <dialog-main>
    <x-tooltip
      trigger-class="absolute -left-1 top-8 sm:top-6"
      content-side="right"
    >
      <template #trigger>
        <dialog-trigger as-child>
          <button>
            <x-icon :icon="History" :size="20" :stroke-width="2" />
          </button>
        </dialog-trigger>
      </template>
      <template #content>
        <span>{{ $tc("searchBar.history") }}</span>
      </template>
    </x-tooltip>

    <dialog-content
      class="w-full max-w-[70dvw] bg-mc-2 p-1 transition-none sm:max-w-[425px]"
    >
      <div
        class="grid h-fit max-h-[80dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header class="border-b border-mc-2 p-2 px-6 xs:p-1 xs:px-4">
          <dialog-title class="text-2xl text-mc-2">
            {{ $tc("searchBar.history") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <div
          class="my-2 grid gap-2 overflow-y-auto overflow-x-hidden px-6 xs:px-4"
        >
          <div
            v-for="station in searchStore.historyList"
            :key="generateId + station.stationuuid!"
            class="flex items-center gap-2"
          >
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
                    messages[userStore.locale || "en"]?.countries[
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
        </div>
        <!-- <DialogFooter class="p-6 pt-0"> </DialogFooter> -->
      </div>
    </dialog-content>
  </dialog-main>
</template>
