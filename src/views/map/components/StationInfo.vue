<script setup lang="ts">
import XButton from "@/components/ui/button/XButton.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XImage from "@/components/ui/image/XImage.vue";
import ShadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import { getFlagImage } from "@/lib/api/flagImage";
import { messages } from "@/lib/locale/locale";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { useMapStore } from "@/stores/mapStore";
import { useUserStore } from "@/stores/userStore";
import { Info, ListPlus, Play, Star, ThumbsUp, ZoomIn } from "lucide-vue-next";
import { defineAsyncComponent, ref } from "vue";
const AddToFavorite = defineAsyncComponent(
  () => import("@/components/modals/AddToFavorite.vue"),
);
const ExtendedInfo = defineAsyncComponent(
  () => import("@/components/modals/ExtendedInfo.vue"),
);

const { locale, selectStation } = useUserStore();
const { selectedStation } = useMapStore();

const dialogOpen = ref<"favorite" | "info" | false>(false);

const emits = defineEmits({
  zoomIn: () => true,
});

const zoomIn = () => {
  emits("zoomIn");
};
</script>

<template>
  <!-- Station Info -->
  <div
    v-if="selectedStation"
    class="absolute inset-2 z-40 flex h-fit min-h-56 w-72 flex-col gap-2 overflow-hidden rounded bg-mc-1 p-2 sm:inset-0 sm:max-h-28 sm:min-h-28 sm:w-full sm:gap-1 sm:rounded-none"
  >
    <shadow-overlay />
    <!-- Name -->
    <div class="flex w-full items-center gap-2">
      <x-image
        :src="getFlagImage(selectedStation.countrycode)"
        class="hidden h-5 w-8 sm:flex"
      />
      <h2 class="truncate text-nowrap text-lg uppercase">
        {{ removeMetadata(selectedStation?.name || "Unknown") }}
      </h2>
      <!-- Extended Info -->
      <x-button
        class="ml-auto hidden w-8 min-w-8 max-w-8 p-0 sm:flex"
        variant="ghost"
        @click="dialogOpen = 'info'"
      >
        <extended-info
          :open="dialogOpen === 'info'"
          :station="selectedStation"
          @close="dialogOpen = false"
        />
        <x-icon
          :icon="Info"
          :size="22"
          :stroke-width="2"
          class="cursor-pointer"
        />
      </x-button>
    </div>
    <div class="relative z-10 flex grow flex-col gap-2">
      <!-- Logo -->
      <div
        class="absolute right-0 top-0 z-0 size-[8rem] select-none overflow-hidden opacity-70 sm:hidden"
      >
        <div class="absolute inset-0 z-0 bg-mc-1" />
        <x-image
          :src="selectedStation.favicon"
          :alt="selectedStation.name"
          class="absolute inset-0 size-[8rem] object-cover"
        />
      </div>
      <div class="relative z-20 flex flex-col sm:flex-row sm:gap-4">
        <!-- Codec -->
        <div v-if="selectedStation?.codec">
          {{ selectedStation.codec + " " + (selectedStation.bitrate || "") }}
        </div>
        <!-- Popularity -->
        <div class="flex flex-col gap-1 sm:flex-row">
          <div
            :v-if="selectedStation?.clickcount"
            class="flex items-start gap-1"
          >
            <p class="text-tc-2">
              <span class="text-tc-2 sm:hidden">
                {{ $t("stationCard.clickCount") }}:
              </span>
              <span class="text-tc-2">
                {{ selectedStation?.clickcount }}
              </span>
            </p>
            <x-icon
              :icon="Star"
              :size="18"
              :stroke-width="1.6"
              class="text-tc-2"
            />
          </div>
          <div
            v-show="selectedStation?.votes"
            class="flex items-start gap-1"
          >
            <p>
              <span class="text-tc-1 sm:hidden">
                {{ $t("stationCard.votes") }}:
              </span>
              <span class="text-tc-1">
                {{ selectedStation?.votes }}
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
        <!-- Home Page -->
        <div class="sm:hidden">
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
        <div class="sm:hidden">
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
          v-if="selectedStation.countrycode"
          class="my-1 flex items-center gap-1 overflow-clip sm:hidden"
        >
          <x-image
            :src="getFlagImage(selectedStation?.countrycode)"
            class="h-5 w-8"
          />
          <p class="truncate text-nowrap">
            <!-- {{ countriesList[currentStation.countrycode] }} -->

            {{
              // @ts-expect-error
              messages[locale || "en"]?.countries[
                selectedStation?.countrycode
              ] || ""
            }}
          </p>
        </div>
        <!-- Tags -->
        <div
          v-if="selectedStation?.tags"
          class="mt-2 flex flex-wrap gap-1 pb-1 pt-2 sm:hidden"
        >
          <div
            v-for="tag in selectedStation.tags.split(',').splice(0, 10)"
            :key="tag"
            class="text-wrap rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
          >
            {{ tag }}
          </div>
        </div>
      </div>
      <!-- Controls -->
      <div class="z-10 mt-auto flex justify-between gap-2">
        <!-- Add To Favorites -->
        <x-button
          class="h-10 min-w-10 max-w-10 p-0 sm:h-8 sm:min-w-8 sm:max-w-8"
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
        <!-- Play -->
        <x-button
          class="z-10 mt-auto h-10 w-full p-0 sm:h-8"
          @click="() => selectedStation && selectStation(selectedStation)"
        >
          <x-icon
            :icon="Play"
            :size="22"
            :stroke-width="2"
            class="cursor-pointer"
          />
        </x-button>
        <!-- Zoom In -->
        <x-button
          class="h-10 min-w-10 max-w-10 p-0 sm:h-8 sm:min-w-8 sm:max-w-8"
          @click="zoomIn"
        >
          <x-icon
            :icon="ZoomIn"
            :size="22"
            :stroke-width="2"
            class="cursor-pointer"
          />
        </x-button>
      </div>
    </div>
  </div>
</template>
