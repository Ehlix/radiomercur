<script setup lang="ts">
import { getFlagImage } from "@/api/getFlagImage";
import XImage from "@/components/ui/image/Image.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { onMounted, ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils/twMerge";
import { messages } from "@/lib/locale/locale";
import xButton from "@/components/ui/button/Button.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
} from "lucide-vue-next";

const props = defineProps<{
  stationsList: Station[];
  favoriteStations: FavoriteStations;
  class?: HTMLAttributes["class"];
  userLocale?: "en" | "ru";
  showExtendedInfo?: boolean;
  currentFolderId?: string | null;
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

const dragEndHandler = (e: DragEvent) => {
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

onMounted(() => {
  document.addEventListener("mouseup", () => {
    isDragging.value = false;
  });
});
</script>

<template>
  <div
    ref="el"
    v-if="stationsList.length"
    :class="cn('flex h-fit w-full flex-wrap gap-2 px-2', props.class)"
  >
    <Collapsible
      v-for.lazy="station in props.stationsList"
      :draggable="isDragging"
      @dragstart="dragStartHandler($event, station)"
      @dragend="dragEndHandler"
      @dragover="dragOverHandler($event, station)"
      @dragleave="dragLeaveHandler"
      @drop="dropHandler($event, station)"
      :open="currentOpenId === station.stationuuid"
      :key="station.stationuuid"
      class="relative flex h-fit w-[19%] min-w-60 grow transition-all"
    >
      <!-- Drag Mask -->
      <div
        v-if="isDragging"
        class="absolute left-0 top-0 z-50 h-full w-full"
      ></div>

      <div
        :class="
          cn(
            'relative flex h-full min-h-32 w-full select-text flex-col justify-start  gap-2 rounded bg-gradient-to-br from-hc-1 to-mc-1  p-2 shadow-md shadow-black/30 transition-all',
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
          class="absolute bottom-0 left-0 flex h-full w-4 flex-col items-center justify-between py-[0.05rem] pl-[0.2rem]"
        >
          <button @click.stop="positionUpHandler(station)" class="">
            <x-icon
              :icon="ChevronsDown"
              :size="22"
              :stroke-width="2"
              class="rotatorUp rotate-90 text-tc-3 transition-all"
            />
          </button>
          <button @mousedown="isDragging = true" class="cursor-move">
            <x-icon
              :icon="GripVertical"
              :size="23"
              :stroke-width="1.8"
              class="text-tc-3"
            />
          </button>
          <button @click.stop="positionDownHandler(station)" class="">
            <x-icon
              :icon="ChevronsDown"
              :size="22"
              :stroke-width="2"
              class="rotatorDown -rotate-90 text-tc-3 transition-all"
            />
          </button>
        </div>
        <!-- Add To Favorites -->
        <div
          :class="
            cn(
              'absolute right-0 top-0 z-30 size-8 overflow-hidden rounded-tr border-b-2 border-t-2 border-mc-2 bg-mc-2 transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_50%)]',
              {
                'size-full rounded border-b-2 border-t-2 bg-mc-1 [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]':
                  currentOpenFavMenu === station.stationuuid,
              },
            )
          "
        >
          <button
            @click="menuToggle(station.stationuuid || '')"
            :class="
              cn('group absolute -top-[0.1rem] right-0 size-6 transition-all', {
                'right-3 top-1 xs:right-2':
                  currentOpenFavMenu === station.stationuuid,
              })
            "
          >
            <x-icon
              :icon="Plus"
              :size="18"
              :stroke-width="2"
              :class="
                cn(
                  'absolute right-0 top-0 transition-all group-hover:opacity-90',
                  {
                    'rotate-45 text-mc-2':
                      currentOpenFavMenu === station.stationuuid,
                  },
                )
              "
            />
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
                @click="removeFromFavorites(station, key)"
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
              >
                <x-icon :icon="Check" :size="20" :stroke-width="2" />
                <p class="w-fit text-tc-1">
                  {{ favoriteStations[key].name }}
                </p>
              </x-button>

              <x-button
                v-else
                @click="addToFavorites(station, key)"
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
              >
                <x-icon :icon="Plus" :size="20" :stroke-width="2" />
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
        <!-- <shadow-overlay class="z-0" /> -->

        <!-- animate-[fadeIn_100ms_ease-out_200ms_forwards] -->

        <!-- Station Name -->
        <h2 class="-mb-2 w-full truncate text-nowrap px-2 text-center">
          {{ removeMetadata(station.name || "Unknown station") }}
        </h2>
        <div class="mb-1 flex w-fit justify-center gap-2">
          <!-- Station Select / Logo -->
          <button
            @click="selectStation(station)"
            class="group relative flex h-16 min-w-16 overflow-hidden rounded-full bg-bgc-1 transition-all *:size-16"
          >
            <!-- <shadow-overlay class=" rounded-full" /> -->
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
          </button>
          <div class="w-full">
            <!-- Station Codec -->
            <p class="w-fit truncate text-nowrap">
              {{ station.codec + " " + (station.bitrate || "") }}
            </p>
            <!-- Station Country Name With Flag -->
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
            <!-- Station Popularity -->
            <div class="flex gap-2 *:flex *:items-start *:gap-1">
              <div v-show="station.clickcount" class="*:text-tc-2">
                <p>{{ station.clickcount }}</p>
                <x-icon :icon="Star" :size="18" :stroke-width="1.6" />
              </div>
              <div v-show="station.votes" class="*:text-teal-500">
                <p>{{ station.votes }}</p>
                <x-icon :icon="ThumbsUp" :size="18" :stroke-width="1.6" />
              </div>
            </div>
          </div>
        </div>
        <!-- Open Trigger -->
        <div
          v-if="props.showExtendedInfo ?? true"
          class="absolute left-0 top-[6.5rem] h-[0.85rem] w-full text-center"
        >
          <button @click="infoOpenHandler(station)" class="w-5">
            <chevron-down
              stroke-width="2"
              :size="22"
              :class="
                cn('transition-all', {
                  'rotate-180 ': currentOpenId === station.stationuuid,
                })
              "
            />
          </button>
        </div>
        <CollapsibleContent
          v-if="props.showExtendedInfo ?? true"
          class="-mt-2 flex flex-col"
        >
          <div class="mt-3">
            <a
              v-if="station.homepage"
              :href="station.homepage"
              target="_blank"
              class="text-tc-2 transition-all hover:text-hc-2"
            >
              {{ $t("stationCard.homepage") }}
            </a>
          </div>
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
          <div v-if="station.tags" class="mt-1 flex flex-wrap gap-1">
            <div
              v-for="tag in station.tags.split(',').splice(0, 20)"
              class="rounded-sm border border-tc-3 px-1 text-sm capitalize text-tc-3"
            >
              {{ tag }}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
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

@media (max-width: 557px) {
  .rotatorUp {
    @apply rotate-180;
  }
  .rotatorDown {
    @apply rotate-0;
  }
}
</style>
