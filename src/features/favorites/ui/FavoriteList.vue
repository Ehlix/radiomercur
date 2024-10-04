<script setup lang="ts">
import { cn } from "@/shared/lib/utils/twMerge";
import { getFlagImage } from "@/shared/api/flagImage";
import { onMounted, onUnmounted, ref } from "vue";
import XImage from "@/shared/ui/image/XImage.vue";
import XIcon from "@/shared/ui/icon/XIcon.vue";
import XButton from "@/shared/ui/button/XButton.vue";
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
import { useFavoriteStore } from "@/entities/favorites/model/favoriteStore";

const {
  stationsList,
  updateStation,
  replaceHandler,
  selectStationHandler,
  openDialogHandler,
  positionHandler,
} = useFavoriteStore();

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
  const stationOneIndex = stationsList.value.findIndex(
    (s) => s.stationuuid === dragTarget.value?.stationuuid,
  );
  const stationTwoIndex = stationsList.value.findIndex(
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
    replaceHandler({
      stationOne: dragTarget.value,
      stationTwo: station,
    });
  }
  dragTarget.value = null;
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
    v-if="stationsList"
    ref="el"
    tag="div"
    name="list"
    class="flex h-fit w-full flex-col gap-2 px-2"
  >
    <div
      v-for="station in stationsList"
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
        class="absolute left-0 top-0 z-50 h-[calc(100%+0.5rem)] w-full"
      />

      <div
        :class="
          cn(
            'flex h-fit w-full select-text items-center justify-start gap-2 rounded bg-hc-1 px-2 py-1 transition-opacity sm:flex-wrap sm:gap-0.5 sm:pr-6',
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
          <x-button
            v-tooltip="$t('buttons.addFavorite')"
            variant="ghost"
            size="icon"
            @click="openDialogHandler(station, 'favorite')"
          >
            <ListPlus :size="25" :stroke-width="1.8" />
          </x-button>
          <!-- Update station data -->
          <x-button
            v-tooltip="$t('stationCard.updateData')"
            variant="ghost"
            size="icon"
            @click="updateStation(station)"
          >
            <RefreshCw :size="22" :stroke-width="2" />
          </x-button>
          <!-- Extended Info -->
          <x-button
            v-tooltip="$t('stationCard.extendedInfo')"
            variant="ghost"
            size="icon"
            @click="openDialogHandler(station, 'info')"
          >
            <Info :size="22" :stroke-width="2" />
          </x-button>
        </div>
        <!-- Play -->
        <x-button
          variant="ghost"
          class="flex h-full w-full justify-start p-0 px-1 sm:order-first sm:h-8 sm:min-w-full"
          @click="selectStationHandler(station)"
        >
          <Play
            :stroke-width="1.5"
            class="-ml-1 size-8 min-w-8 transition-transform sm:size-10"
          />
          <!-- Station Name -->
          <h2
            class="-ml-1 w-fit truncate text-nowrap px-3 text-start uppercase text-tc-1 sm:max-h-6 sm:text-wrap sm:text-base"
          >
            {{ station.name }}
          </h2>
        </x-button>
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
            @click.stop="positionHandler(station, 'up')"
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
            @click.stop="positionHandler(station, 'down')"
          >
            <ChevronsDown :size="22" :stroke-width="2" class="text-tc-1" />
          </x-button>
          <x-button
            variant="ghost"
            size="icon"
            class="-mr-2 cursor-move sm:hidden"
            @mousedown="isDragging = true"
          >
            <GripVertical :size="25" :stroke-width="1.8" class="text-tc-1" />
          </x-button>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<style scoped lang="postcss">
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
