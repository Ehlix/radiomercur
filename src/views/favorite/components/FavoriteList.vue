<script setup lang="ts">
import { cn } from "@/lib/utils/twMerge";
import { getFlagImage } from "@/lib/api/flagImage";
import { onMounted, onUnmounted, ref, type HTMLAttributes } from "vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import XImage from "@/components/ui/image/XImage.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import XButton from "@/components/ui/button/XButton.vue";
import {
  Play,
  ThumbsUp,
  Star,
  GripVertical,
  ChevronsDown,
  ListPlus,
  Info,
  RefreshCw,
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
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
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
    (e.currentTarget as HTMLElement).classList.add("top-drag-preview");
  } else {
    (e.currentTarget as HTMLElement).classList.add("bottom-drag-preview");
  }
};

const dragLeaveHandler = (e: DragEvent) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement).classList.remove(
    "top-drag-preview",
    "bottom-drag-preview",
  );
};

const dropHandler = (e: DragEvent, station: Station) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement).classList.remove(
    "top-drag-preview",
    "bottom-drag-preview",
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

onUnmounted(() => {
  document.removeEventListener("mouseup", () => {
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
    class="flex h-fit w-full flex-col gap-2 px-2"
  >
    <div
      v-for="station in props.stationsList"
      :key="station.stationuuid"
      :draggable="isDragging"
      class="item-list relative w-full transition-all"
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
            'flex h-10 w-full select-text items-center justify-start gap-2 rounded bg-hc-1 p-2 py-1 transition-opacity sm:h-16 sm:flex-wrap sm:gap-0.5 sm:p-1 sm:pr-6',
            {
              'opacity-20':
                station.stationuuid === dragTarget?.stationuuid && isDragging,
            },
          )
        "
      >
        <div
          class="flex h-full items-center gap-2 sm:h-6 sm:justify-between sm:gap-1"
        >
          <!-- Add To Favorites -->
          <x-tooltip
            content-side="left"
            trigger-class="cursor-pointer"
          >
            <template #trigger>
              <ListPlus
                :size="25"
                :stroke-width="1.8"
                @click="openAddToFavoriteModal(station)"
              />
            </template>
            <template #content>
              <span>{{ `${$t("buttons.addFavorite")}` }}</span>
            </template>
          </x-tooltip>
          <!-- Update station data -->
          <x-tooltip
            content-side="left"
            trigger-class="cursor-pointer"
          >
            <template #trigger>
              <RefreshCw
                :size="22"
                :stroke-width="2"
                @click="updateStationData(station)"
              />
            </template>
            <template #content>
              {{ $t("stationCard.updateData") }}
            </template>
          </x-tooltip>
          <!-- Extended Info -->
          <x-tooltip
            content-side="left"
            trigger-class="cursor-pointer"
          >
            <template #trigger>
              <Info
                :size="22"
                :stroke-width="2"
                @click="openExtendedInfo(station)"
              />
            </template>
            <template #content>
              {{ $t("stationCard.extendedInfo") }}
            </template>
          </x-tooltip>
        </div>
        <!-- Play -->
        <x-button
          variant="ghost"
          class="group flex h-full w-full justify-start px-1 sm:order-first sm:h-8 sm:min-w-full"
          @click="selectStation(station)"
        >
          <Play
            :stroke-width="1.5"
            class="-ml-1 size-8 min-w-8 transition-transform group-hover:scale-105 sm:size-10"
          />
          <!-- Station Name -->
          <h2
            class="-ml-1 w-fit truncate text-nowrap px-3 text-start uppercase text-tc-1 sm:max-h-6 sm:text-wrap sm:text-base"
          >
            {{ station.name }}
          </h2>
        </x-button>
        <!-- Logo -->
        <!-- <div
          :class="cn('pointer-events-none absolute left-6 top-4 z-10 size-[6rem] select-none overflow-hidden rounded-full opacity-100', {
            'ml-4': showUpdatex-button,
          })"
        >
          <div class="absolute inset-0 z-0 bg-mc-1 opacity-100" />
          <x-image
            :src="station.favicon"
            :height="6"
            :width="6"
            alt="logo"
            class="absolute inset-0 z-10 size-[6rem] object-cover opacity-40"
          />
        </div> -->
        <div class="ml-auto flex h-full w-fit items-center gap-2 sm:h-4">
          <!-- Station Popularity -->
          <div
            v-show="station.clickcount"
            class="flex w-full items-start justify-end gap-1 *:text-tc-2"
          >
            <p>{{ station.clickcount }}</p>
            <x-icon
              :icon="Star"
              :size="18"
              :stroke-width="1.6"
              class="w-6 min-w-6 max-w-6"
            />
          </div>
          <div
            v-show="station.votes"
            class="flex min-w-16 items-start justify-end gap-1 *:text-tc-1"
          >
            <p>{{ station.votes }}</p>
            <x-icon
              :icon="ThumbsUp"
              :size="18"
              :stroke-width="1.6"
              class="w-6 min-w-6 max-w-6"
            />
          </div>
          <!-- Station Flag -->
          <div class="flex w-fit items-center justify-end">
            <x-image
              :src="getFlagImage(station.countrycode)"
              :height="20"
              :width="40"
              class="h-5 min-h-5 w-8 min-w-8"
            />
          </div>
        </div>
        <!-- Dragger -->
        <div
          class="right-0 top-0 flex h-full opacity-60 sm:absolute sm:flex-col sm:justify-between sm:py-0"
        >
          <x-button
            variant="ghost"
            size="icon"
            @click.stop="positionUpHandler(station)"
          >
            <ChevronsDown
              :size="22"
              :stroke-width="2"
              class="rotate-180 text-tc-1"
            />
          </x-button>
          <x-button
            variant="ghost"
            size="icon"
            @click.stop="positionDownHandler(station)"
          >
            <ChevronsDown
              :size="22"
              :stroke-width="2"
              class="text-tc-1"
            />
          </x-button>
          <x-button
            variant="ghost"
            size="icon"
            class="-mr-2 cursor-move sm:hidden"
            @mousedown="isDragging = true"
          >
            <GripVertical
              :size="25"
              :stroke-width="1.8"
              class="text-tc-1"
            />
          </x-button>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<style scoped>
.top-drag-preview {
  @apply pt-6;
}
.top-drag-preview::before {
  content: "";
  @apply absolute left-0 top-0 h-4 w-full animate-fade-in rounded bg-mc-3;
}
.bottom-drag-preview {
  @apply pb-6;
}
.bottom-drag-preview::before {
  content: "";
  @apply absolute bottom-0 right-0 h-4 w-full animate-fade-in rounded bg-mc-3;
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
