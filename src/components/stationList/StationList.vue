<script setup lang="ts">
import { cn } from "@/lib/utils/twMerge";
import { getFlagImage } from "@/api/getFlagImage";
import { messages } from "@/lib/locale/locale";
import { onMounted, ref, type HTMLAttributes } from "vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import xButton from "@/components/ui/button/XButton.vue";
import XImage from "@/components/ui/image/XImage.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import ExtendedInfo from "./ExtendedInfo.vue";
import AddToFavorite from "./AddToFavorite.vue";
import {
  Play,
  ThumbsUp,
  Star,
  GripVertical,
  ChevronsDown,
  RefreshCcw,
} from "lucide-vue-next";

const props = defineProps<{
  stationsList: Station[];
  favoriteStations: FavoriteStations;
  class?: HTMLAttributes["class"];
  userLocale?: "en" | "ru";
  showExtendedInfo?: boolean;
  currentFolderId?: string | null;
  showUpdateButton?: boolean;
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
  (e: "addStationToFavorites", stationAndId: StationAndId): void;
  (e: "removeStationFromFavorites", stationAndId: StationAndId): void;
  (e: "positionUp", stationAndId: StationAndId): void;
  (e: "positionDown", stationAndId: StationAndId): void;
  (
    e: "replaceStations",
    stations: {
      stationOne: Station;
      stationTwo: Station;
      folderID: string;
    },
  ): void;
  (
    e: "updateFavData",
    value: {
      station: Station;
      folderID: string;
    },
  ): void;
}>();

const selectStation = (station: Station) => {
  emits("selectStation", station);
};
const currentOpenId = ref("id");
const el = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragTarget = ref<Station | null>(null);

const dragStartHandler = (e: DragEvent, station: Station) => {
  dragTarget.value = station;
};

const dragEndHandler = () => {
  isDragging.value = false;
};

const dragOverHandler = (e: DragEvent, station: Station) => {
  e.preventDefault();
  if (dragTarget.value?.stationuuid === station.stationuuid) {
    return;
  }
  const stationOneIndex = props.stationsList.findIndex(
    (s) => s.stationuuid === dragTarget.value?.stationuuid,
  );
  const stationTwoIndex = props.stationsList.findIndex(
    (s) => s.stationuuid === station.stationuuid,
  );
  if (stationOneIndex > stationTwoIndex) {
    (e.currentTarget as HTMLElement).classList.add("left-drag-preview");
  } else {
    (e.currentTarget as HTMLElement).classList.add("right-drag-preview");
  }
};

const dragLeaveHandler = (e: DragEvent) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement).classList.remove(
    "left-drag-preview",
    "right-drag-preview",
  );
};

const dropHandler = (e: DragEvent, station: Station) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement).classList.remove(
    "left-drag-preview",
    "right-drag-preview",
  );
  isDragging.value = false;
  if (dragTarget.value && station && props.currentFolderId) {
    emits("replaceStations", {
      stationOne: dragTarget.value,
      stationTwo: station,
      folderID: props.currentFolderId,
    });
  }
  dragTarget.value = null;
};

const positionUpHandler = (station: Station) => {
  if (!props.currentFolderId) {
    return;
  }
  emits("positionUp", {
    station,
    folderID: props.currentFolderId,
  });
};
const positionDownHandler = (station: Station) => {
  if (!props.currentFolderId) {
    return;
  }
  emits("positionDown", {
    station,
    folderID: props.currentFolderId,
  });
};

const updateStationData = (station: Station) => {
  if (!props.currentFolderId) {
    return;
  }
  const value = {
    folderID: props.currentFolderId,
    station,
  };
  emits("updateFavData", value);
};

const addToFavorites = (value: StationAndId) => {
  emits("addStationToFavorites", value);
};
const removeFromFavorites = (value: StationAndId) => {
  emits("removeStationFromFavorites", value);
};

onMounted(() => {
  document.addEventListener("mouseup", () => {
    isDragging.value = false;
  });
});
</script>

<template>
  <transition-group
    v-if="stationsList.length"
    ref="el"
    tag="div"
    name="list"
    :class="cn('flex h-fit w-full flex-wrap gap-2 px-2', props.class)"
  >
    <div
      v-for="station in props.stationsList"
      :key="station.stationuuid"
      :draggable="isDragging"
      :open="currentOpenId === station.stationuuid"
      class="item-list relative flex h-fit w-[19%] min-w-60 max-w-[calc(50%-0.25rem)] grow overflow-hidden shadow-md shadow-black/30 transition-all sm:max-w-full"
      @dragstart="dragStartHandler($event, station)"
      @dragend="dragEndHandler"
      @dragover="dragOverHandler($event, station)"
      @dragleave="dragLeaveHandler"
      @drop="dropHandler($event, station)"
    >
      <!-- Drag Mask -->
      <div
        v-if="isDragging"
        class="absolute left-0 top-0 z-50 h-full w-full"
      />

      <div
        :class="
          cn(
            'relative flex h-[6.4rem] w-full select-text flex-col justify-start  gap-2 rounded bg-gradient-to-br from-hc-1 to-mc-1 p-2 transition-opacity',
            {
              'pl-6': currentFolderId,
              'opacity-20':
                station.stationuuid === dragTarget?.stationuuid && isDragging,
            },
          )
        "
      >
        <!-- Dragger -->
        <div
          v-if="currentFolderId"
          class="absolute bottom-0 left-0 z-10 flex h-full w-5 flex-col items-center justify-between px-[0.2rem] py-[0.05rem] opacity-60"
        >
          <button
            class=""
            @click.stop="positionUpHandler(station)"
          >
            <x-icon
              :icon="ChevronsDown"
              :size="22"
              :stroke-width="2"
              class="rotatorUp rotate-90 text-tc-1 transition-transform"
            />
          </button>
          <button
            class="cursor-move"
            @mousedown="isDragging = true"
          >
            <x-icon
              :icon="GripVertical"
              :size="23"
              :stroke-width="1.8"
              class="text-tc-1"
            />
          </button>
          <button
            class=""
            @click.stop="positionDownHandler(station)"
          >
            <x-icon
              :icon="ChevronsDown"
              :size="22"
              :stroke-width="2"
              class="rotatorDown -rotate-90 text-tc-1 transition-transform"
            />
          </button>
        </div>
        <!-- Add To Favorites -->
        <div
          :class="
            cn(
              'absolute right-0 top-0 z-30 size-8 overflow-hidden rounded-tr border-b-2 border-t-2 border-mc-2 bg-mc-2 transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_50%)] hover:size-9',
            )
          "
        >
          <add-to-favorite
            :station="station"
            :favorite-stations="favoriteStations"
            class="size-4.5 absolute right-0 top-0 z-30"
            @add-station-to-favorites="addToFavorites($event)"
            @remove-station-from-favorites="removeFromFavorites($event)"
          />
        </div>

        <div class="absolute bottom-1 right-1 z-20 flex h-6 items-center gap-1">
          <!-- Update station data -->
          <x-tooltip
            v-if="showUpdateButton"
            content-side="left"
          >
            <template #trigger>
              <x-button
                variant="ghost"
                class="w-8 min-w-8 p-0 opacity-60 hover:bg-white/0"
              >
                <x-icon
                  :icon="RefreshCcw"
                  :size="22"
                  :stroke-width="2"
                  class="text-tc-1"
                  @click="updateStationData(station)"
                />
              </x-button>
            </template>
            <template #content>
              {{ $t("stationCard.updateData") }}
            </template>
          </x-tooltip>
          <!-- Extended Info -->
          <x-tooltip content-side="left">
            <template #trigger>
              <extended-info
                :station="station"
                :locale="userLocale"
                class="opacity-60 hover:bg-white/0"
              />
            </template>
            <template #content>
              {{ $t("stationCard.extendedInfo") }}
            </template>
          </x-tooltip>
        </div>
        <!-- Logo -->
        <div
          class="pointer-events-none absolute left-6 top-4 z-10 size-[6rem] select-none overflow-hidden rounded-full opacity-100"
        >
          <div class="absolute inset-0 z-0 bg-mc-1 opacity-100" />
          <x-image
            :src="station.favicon"
            :alt="station.name"
            class="absolute inset-0 z-10 size-[6rem] object-cover opacity-40"
          />
        </div>
        <!-- Station Name -->
        <x-tooltip trigger-class="z-20 w-full">
          <template #trigger>
            <h2 class="-my-1 truncate text-nowrap px-3 text-center text-tc-1">
              {{ removeMetadata(station.name || "Unknown station") }}
            </h2>
          </template>
          <template #content>
            {{ removeMetadata(station.name || "Unknown station") }}
          </template>
        </x-tooltip>

        <div class="absolute left-0 top-[0.4rem] h-6 w-full">
          <div class="h-full w-full bg-gradient-to-r via-mc-1 opacity-80" />
        </div>
        <div class="z-10 flex w-full items-start justify-between gap-2">
          <!-- Play -->
          <button
            class="pointer-events-auto -ml-1 flex size-fit h-fit min-w-fit items-center justify-center rounded-full px-1 transition-all"
            @click="selectStation(station)"
          >
            <x-icon
              :icon="Play"
              :size="40"
              :stroke-width="1.5"
              :class="cn('transition-transform hover:scale-105')"
            />
          </button>
          <!-- Station Info -->
          <div class="mt-1 flex gap-2">
            <x-tooltip>
              <template #trigger>
                <div
                  v-if="station.countrycode"
                  class="my-1 flex items-center gap-1 overflow-clip"
                >
                  <x-image
                    :src="getFlagImage(station.countrycode)"
                    class="h-5 w-8"
                  />
                </div>
              </template>
              <template #content>
                <div>
                  {{
                    messages[props.userLocale || "en"]?.countries[
                      // @ts-expect-error
                      station.countrycode
                    ] || ""
                  }}
                </div>
              </template>
            </x-tooltip>
            <!-- Station Popularity -->
            <div class="order-first flex gap-2">
              <x-tooltip trigger-class="">
                <template #trigger>
                  <div
                    v-show="station.clickcount"
                    class="flex items-start gap-1 *:text-tc-2"
                  >
                    <p>{{ station.clickcount }}</p>
                    <x-icon
                      :icon="Star"
                      :size="18"
                      :stroke-width="1.6"
                    />
                  </div>
                </template>
                <template #content>
                  {{ $t("stationCard.clickCount") }}
                </template>
              </x-tooltip>
              <x-tooltip>
                <template #trigger>
                  <div
                    v-show="station.votes"
                    class="flex items-start gap-1 *:text-tc-1"
                  >
                    <p>{{ station.votes }}</p>
                    <x-icon
                      :icon="ThumbsUp"
                      :size="18"
                      :stroke-width="1.6"
                    />
                  </div>
                </template>
                <template #content>
                  {{ $t("stationCard.votes") }}
                </template>
              </x-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<style scoped>
.left-drag-preview {
  @apply pl-4;
}
.left-drag-preview::before {
  content: "";
  @apply absolute left-0 top-0 h-full w-2 animate-fade-in rounded bg-mc-3;
}
.right-drag-preview {
  @apply pr-4;
}
.right-drag-preview::before {
  content: "";
  @apply absolute right-0 top-0 h-full w-2 animate-fade-in rounded bg-mc-3;
}

@media (max-width: 597px) {
  .rotatorUp {
    @apply rotate-180;
  }
  .rotatorDown {
    @apply rotate-0;
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 0ms cubic-bezier(0.19, 1, 0.22, 1);
}

.list-enter,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  opacity: 0;
  position: absolute;
}
</style>
