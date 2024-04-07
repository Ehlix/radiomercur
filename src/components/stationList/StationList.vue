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
import {
  CollapsibleMain,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Play,
  ThumbsUp,
  Star,
  Plus,
  Check,
  X,
  GripVertical,
  ChevronsDown,
  ListPlus,
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
const currentOpenFavMenu = ref<string | null>(null);
const currentOpenId = ref("id");
const el = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const dragTarget = ref<Station | null>(null);

const infoOpenHandler = (station: Station) => {
  if (currentOpenId.value === station.stationuuid) {
    currentOpenId.value = "id";
  } else {
    currentOpenId.value = station.stationuuid || "id";
  }
};

const menuToggle = (id: string) => {
  if (currentOpenFavMenu.value === id) {
    currentOpenFavMenu.value = null;
  } else {
    currentOpenFavMenu.value = id;
  }
};

const checkStationInFavorites = (station: Station, folderID: string) => {
  if (props.favoriteStations[folderID]) {
    return props.favoriteStations[folderID].stations.some(
      (s) => s.stationuuid === station.stationuuid,
    );
  }
};

const addToFavorites = (station: Station, folderID: string) => {
  emits("addStationToFavorites", {
    station,
    folderID,
  });
};
const removeFromFavorites = (station: Station, folderID: string) => {
  emits("removeStationFromFavorites", {
    station,
    folderID,
  });
};

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

onMounted(() => {
  document.addEventListener("mouseup", () => {
    isDragging.value = false;
  });
});
</script>

<template>
  <div
    v-if="stationsList.length"
    ref="el"
    :class="cn('flex h-fit w-full flex-wrap gap-2 px-2', props.class)"
  >
    <collapsible-main
      v-for="station in props.stationsList"
      :key="station.stationuuid"
      :draggable="isDragging"
      :open="currentOpenId === station.stationuuid"
      class="relative flex h-fit w-[19%] min-w-60 max-w-[calc(50%-0.25rem)] grow overflow-hidden shadow-md shadow-black/30 transition-all sm:max-w-full"
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
            'relative flex h-full min-h-32 w-full select-text flex-col justify-start  gap-2 rounded bg-gradient-to-br from-hc-1 to-mc-1 p-2 transition-opacity',
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
              'absolute right-0 top-0 z-30 size-9 overflow-hidden rounded-tr border-b-2 border-t-2 border-mc-2 bg-mc-2 transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_50%)] hover:size-10',
              {
                'size-full rounded border-b-2 border-t-2 bg-mc-1 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)] hover:size-full':
                  currentOpenFavMenu === station.stationuuid,
              },
            )
          "
        >
          <button
            :class="
              cn('group absolute -top-[0.1rem] right-0 size-6', {
                'right-3 top-1 xs:right-2':
                  currentOpenFavMenu === station.stationuuid,
              })
            "
            @click="menuToggle(station.stationuuid || '')"
          >
            <x-tooltip
              trigger-class="cursor-pointer"
              content-side="left"
              :content-side-offset="15"
            >
              <template #trigger>
                <x-icon
                  v-if="currentOpenFavMenu !== station.stationuuid"
                  :icon="ListPlus"
                  :size="18"
                  :stroke-width="2"
                  class="absolute right-0 top-0 transition-opacity group-hover:opacity-90"
                />
                <x-icon
                  v-else
                  :icon="X"
                  :size="18"
                  :stroke-width="2"
                  class="absolute right-0 top-0 text-mc-2 transition-opacity group-hover:opacity-90"
                />
              </template>
              <template #content>
                <div v-if="currentOpenFavMenu !== station.stationuuid">
                  {{ $t("stationCard.addToFavorites") }}
                </div>
                <div v-else>
                  {{ $t("buttons.close") }}
                </div>
              </template>
            </x-tooltip>
          </button>
          <div
            v-if="currentOpenFavMenu === station.stationuuid"
            class="h-full w-full overflow-x-clip overflow-y-scroll p-1 pr-8"
          >
            <div
              v-for="key in Object.keys(props.favoriteStations)"
              :key="key"
              class="flex items-center gap-1"
            >
              <x-button
                v-if="checkStationInFavorites(station, key)"
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
                @click="removeFromFavorites(station, key)"
              >
                <x-icon
                  :icon="Check"
                  :size="20"
                  :stroke-width="2"
                />
                <p class="w-fit text-tc-1">
                  {{ favoriteStations[key].name }}
                </p>
              </x-button>

              <x-button
                v-else
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
                @click="addToFavorites(station, key)"
              >
                <x-icon
                  :icon="Plus"
                  :size="20"
                  :stroke-width="2"
                />
                <p class="text-tc-1">
                  {{ favoriteStations[key].name }}
                </p>
              </x-button>
            </div>
          </div>
          <!-- <button
            v-else-if="false"
            @click="removeFromFavorites(station)"
            class="h-full w-full bg-teal-500 transition-all group-hover:bg-red-600"
          >
            <x-icon
              :icon="Check"
              :size="18"
              :stroke-width="2"
              class="absolute right-0 top-0 transition-all group-hover:hidden"
            />
            <x-icon
              :icon="X"
              :size="18"
              :stroke-width="2"
              class="absolute right-0 top-0 hidden transition-all group-hover:block"
            />
          </button> -->
        </div>

        <!-- Update station data -->
        <x-tooltip
          trigger-class="absolute z-10 -right-[0.1rem] top-[6.05rem]"
          :content-side="'left'"
        >
          <template #trigger>
            <x-button
              v-if="showUpdateButton"
              variant="ghost"
              class="w-8 min-w-8 p-0 opacity-60 hover:bg-white/0"
            >
              <x-icon
                :icon="RefreshCcw"
                :size="20"
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

        <!-- Logo -->
        <div
          class="pointer-events-none absolute right-2 top-4 z-10 size-[6.5rem] select-none overflow-hidden rounded-full opacity-100"
        >
          <div class="absolute inset-0 z-0 bg-mc-1 opacity-100" />
          <x-image
            :src="station.favicon"
            :alt="station.name"
            class="absolute inset-0 z-10 size-[6.5rem] object-cover opacity-40"
          />
        </div>

        <!-- <shadow-overlay class="z-0" /> -->

        <!-- animate-[fadeIn_100ms_ease-out_200ms_forwards] -->

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

        <div class="z-10 mb-1 flex w-fit justify-center gap-2">
          <!-- Station Select -->
          <button
            class="pointer-events-auto -ml-1 flex size-fit h-16 min-w-fit items-center justify-center rounded-full p-1 transition-all"
            @click="selectStation(station)"
          >
            <x-icon
              :icon="Play"
              :size="36"
              :stroke-width="1.5"
              :class="cn('transition-transform hover:scale-105')"
            />
          </button>
          <!-- <button
            @click="selectStation(station)"
            class="group relative flex h-16 min-w-16 overflow-hidden rounded-full bg-bgc-1 *:size-16"
          >
            <div
              class="absolute left-0 top-0 z-10 flex size-full items-center justify-center opacity-0 shadow-[inset_0_0_5000px_2px_rgba(0,0,0,0.4)] transition-all group-hover:opacity-95"
            >
              <x-icon
                :icon="Play"
                :size="40"
                :stroke-width="2.5"
                class="pl-1"
              />
            </div>

            <x-image
              :src="station.favicon || ''"
              :alt="station.name"
              class="z-0 transition-all group-hover:scale-110 group-hover:blur-[0.1rem]"
            />
          </button> -->
          <div class="w-full">
            <!-- Station Codec -->
            <p class="w-fit truncate text-nowrap">
              {{ station.codec + " " + (station.bitrate || "") }}
            </p>
            <!-- Station Country Name With Flag -->
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
                  <p class="truncate text-nowrap">
                    <!-- {{ countriesList[station.countrycode] }} -->

                    {{
                      // @ts-expect-error
                      messages[props.userLocale || "en"]?.countries[
                        station.countrycode
                      ] || ""
                    }}
                  </p>
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
            <div class="flex gap-2">
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
        <!-- Open Trigger -->
        <div
          v-if="props.showExtendedInfo ?? true"
          class="pointer-events-none absolute left-0 top-[6.5rem] h-[0.85rem] w-full text-center"
        >
          <button
            class="pointer-events-auto w-5"
            @click="infoOpenHandler(station)"
          >
            <chevron-down
              stroke-width="2"
              :size="22"
              :class="
                cn('transition-transform', {
                  'rotate-180 ': currentOpenId === station.stationuuid,
                })
              "
            />
          </button>
        </div>
        <collapsible-content
          v-if="props.showExtendedInfo ?? true"
          class="-mt-2 flex flex-col"
        >
          <div class="mt-3">
            <a
              v-if="station.homepage"
              :href="station.homepage"
              target="_blank"
              class="text-tc-2 transition-colors hover:text-hc-2"
            >
              {{ $t("stationCard.homepage") }}
            </a>
          </div>
          <div>
            <a
              v-if="station?.url_resolved || station?.url"
              :href="station.url_resolved || station.url"
              target="_blank"
              class="text-tc-2 transition-colors hover:text-hc-2"
            >
              {{ $t("stationCard.streamSource") }}
            </a>
          </div>
          <div
            v-if="station.tags"
            class="mt-1 flex flex-wrap gap-1"
          >
            <div
              v-for="tag in station.tags.split(',').splice(0, 20)"
              :key="tag"
              class="rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
            >
              {{ tag }}
            </div>
          </div>
        </collapsible-content>
      </div>
    </collapsible-main>
  </div>
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
</style>
