<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThumbsUp, Star } from "lucide-vue-next";
import { getFlagImage } from "@/common/api/flagImage";
import XImage from "@/components/ui/image/XImage.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { removeMetadata } from "@/common/utils/removeMetaDataFromName";
import { messages } from "@/common/locale/locale";
import { useUserStore } from "@/stores/userStore";

defineProps<{
  station: Station;
  open: boolean;
}>();

const { locale } = useUserStore();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emits("close");
};
</script>

<template>
  <dialog-main :open="open" @update:open="close">
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="min-h-58 grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header
          class="truncate text-wrap border-b border-mc-2 bg-mc-1 p-2 px-10 xs:p-1 xs:px-6"
        >
          <dialog-title
            class="-my-1 truncate text-wrap px-3 text-center text-2xl uppercase text-mc-2"
          >
            {{ removeMetadata(station.name || "Unknown station") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <!-- Station Info -->
        <div
          class="relative z-10 grid gap-2 overflow-y-auto px-10 py-6 xs:px-6"
        >
          <!-- Logo -->
          <div
            class="absolute right-6 top-6 z-0 size-[8rem] select-none overflow-hidden"
          >
            <div class="absolute inset-0 z-0 bg-mc-1" />
            <x-image
              :src="station.favicon"
              :alt="station.name"
              class="absolute inset-0 size-[8rem] object-cover"
            />
          </div>
          <div class="relative z-20 flex flex-col">
            <!-- Popularity -->
            <div class="flex flex-col gap-1">
              <div :v-if="station?.clickcount" class="flex items-start gap-1">
                <p>
                  {{ $t("stationCard.clickCount") }}:
                  <span class="text-tc-2">
                    {{ station?.clickcount }}
                  </span>
                </p>
                <x-icon
                  :icon="Star"
                  :size="18"
                  :stroke-width="1.6"
                  class="text-tc-2"
                />
              </div>
              <div v-show="station?.votes" class="flex items-start gap-1">
                <p class="text-tc-1">
                  {{ $t("stationCard.votes") }}:
                  <span class="text-tc-1">
                    {{ station?.votes }}
                  </span>
                </p>
                <x-icon
                  :icon="ThumbsUp"
                  :size="18"
                  :stroke-width="1.6"
                  class="text-tc-1"
                />
              </div>
            </div>
            <!-- Codec -->
            <div v-if="station?.codec">
              {{ station.codec + " " + (station.bitrate || "") }}
            </div>
            <!-- Home Page -->
            <div>
              <a
                v-if="station?.homepage"
                :href="station.homepage"
                target="_blank"
                class="text-tc-2 transition-all hover:text-hc-2"
              >
                {{ $t("stationCard.homepage") }}
              </a>
            </div>
            <!-- Stream Source -->
            <div>
              <a
                v-if="station?.url_resolved || station?.url"
                :href="station.url_resolved || station.url"
                target="_blank"
                class="text-tc-2 transition-all hover:text-hc-2"
              >
                {{ $t("stationCard.streamSource") }}
              </a>
            </div>
            <!-- Flag ana Country Name -->
            <div
              v-if="station?.countrycode"
              class="my-1 flex items-center gap-1 overflow-clip"
            >
              <x-image
                :src="getFlagImage(station?.countrycode)"
                class="h-5 w-8"
              />
              <p class="truncate text-nowrap">
                <!-- {{ countriesList[station.countrycode] }} -->

                {{
                  // @ts-expect-error
                  messages[locale || "en"]?.countries[station?.countrycode] ||
                  ""
                }}
              </p>
            </div>
            <!-- Tags -->
            <div v-if="station?.tags" class="mt-2 flex flex-wrap gap-1">
              <div
                v-for="tag in station.tags.split(',').splice(0, 10)"
                :key="tag"
                class="text-wrap rounded-sm border border-tc-3 px-1.5 text-sm capitalize italic text-tc-3"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-content>
  </dialog-main>
</template>
