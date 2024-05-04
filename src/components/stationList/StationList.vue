<script setup lang="ts">
import { cn } from "@/lib/utils/twMerge";
import { getFlagImage } from "@/lib/api/getFlagImage";
import { messages } from "@/lib/locale/locale";
import { onMounted, ref, type HTMLAttributes } from "vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import xButton from "@/components/ui/button/XButton.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XImage from "@/components/ui/image/XImage.vue";
import {
  Play,
  ThumbsUp,
  Star,
  GripVertical,
  ChevronsDown,
  RefreshCcw,
  ListPlus,
  Info,
} from "lucide-vue-next";
// import { defineAsyncComponent } from "vue";
// const XTooltip = defineAsyncComponent(
//   () => import("@/components/ui/tooltip/XTooltip.vue"),
// );
// const XImage = defineAsyncComponent(() => import("@/components/ui/image/XImage.vue"));
// const XIcon = defineAsyncComponent(() => import("@/components/ui/icon/XIcon.vue"));

const props = defineProps<{
  stationsList: Station[];
  class?: HTMLAttributes["class"];
  userLocale?: "en" | "ru";
  showUpdateButton?: boolean;
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
  // (e: "addStationToFavorites", stationAndId: StationAndId): void;
  // (e: "removeStationFromFavorites", stationAndId: StationAndId): void;
  (e: "positionUp", station: Station): void;
  (e: "positionDown", station: Station): void;
  (e: "openAddToFavorite", station: Station): void;
  (e: "openExtendedInfo", station: Station): void;
  (
    e: "replaceStations",
    stations: {
      stationOne: Station;
      stationTwo: Station;
    },
  ): void;
  (e: "updateFavData", station: Station): void;
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
  if (dragTarget.value && station) {
    emits("replaceStations", {
      stationOne: dragTarget.value,
      stationTwo: station,
    });
  }
  dragTarget.value = null;
};

const positionUpHandler = (station: Station) => {
  emits("positionUp", station);
};
const positionDownHandler = (station: Station) => {
  emits("positionDown", station);
};

const updateStationData = (station: Station) => {
  emits("updateFavData", station);
};

const openAddToFavoriteModal = (station: Station) => {
  emits("openAddToFavorite", station);
};

const openExtendedInfo = (station: Station) => {
  emits("openExtendedInfo", station);
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
    :class="
      cn(
        'grid h-fit w-full grid-cols-5 gap-2 px-2 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1',
        props.class,
      )
    "
  >
    <div
      v-for="station in props.stationsList"
      v-cloak
      :key="station.stationuuid"
      :draggable="isDragging"
      :open="currentOpenId === station.stationuuid"
      class="item-list relative w-full overflow-hidden shadow-md shadow-black/30 transition-all"
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
              'pl-6': showUpdateButton,
              'opacity-20':
                station.stationuuid === dragTarget?.stationuuid && isDragging,
            },
          )
        "
      >
        <!-- Dragger -->
        <div
          v-if="showUpdateButton"
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
        <button
          :class="
            cn(
              'absolute right-0 top-0 z-30 size-9 overflow-hidden rounded-tr border-b-2 border-t-2 border-mc-2 bg-mc-2 transition-all duration-300 [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_50%)] hover:size-10',
            )
          "
          @click="openAddToFavoriteModal(station)"
        >
          <x-tooltip content-side="left">
            <template #trigger>
              <x-icon
                :icon="ListPlus"
                :size="18"
                :stroke-width="2"
                class="size-4.5 absolute right-0 top-0 z-30 min-h-5 cursor-pointer"
              />
            </template>
            <template #content>
              <span>{{ `${$t("buttons.addFavorite")}` }}</span>
            </template>
          </x-tooltip>
        </button>

        <div class="absolute bottom-1 right-1 z-20 flex h-6 items-center gap-2">
          <!-- Update station data -->
          <x-tooltip
            v-if="showUpdateButton"
            content-side="left"
          >
            <template #trigger>
              <x-button
                variant="ghost"
                class="w-6 min-w-6 p-0 opacity-60 hover:bg-white/0"
                @click="updateStationData(station)"
              >
                <x-icon
                  :icon="RefreshCcw"
                  :size="20"
                  :stroke-width="2"
                  class="text-tc-1"
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
              <x-button
                variant="ghost"
                class="w-6 min-w-6 p-0 opacity-60 hover:bg-white/0"
                @click="openExtendedInfo(station)"
              >
                <x-icon
                  :icon="Info"
                  :size="20"
                  :stroke-width="2"
                  class="text-tc-1"
                />
              </x-button>
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
            :height="6"
            :width="6"
            alt="logo"
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
                    :height="5"
                    :width="8"
                  />
                </div>
              </template>
              <template #content>
                <div>
                  {{
                    // @ts-expect-error
                    messages[props.userLocale || "en"]?.countries[
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

[v-cloak] {
  display: none !important;
}
</style>
