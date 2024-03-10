<script setup lang="ts">
import { getFlagImage } from "@/api/getFlagImage";
import XImage from "@/components/ui/image/Image.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { removeMetadata } from "@/lib/utils/removeMetaDataFromName";
import { onMounted, ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils/twMerge";
import { messages } from "@/lib/locale/locale";
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
  favoriteStations: Station[] | "add" | "remove";
  class?: HTMLAttributes["class"];
  userLocale?: "en" | "ru";
  showExtendedInfo?: boolean;
  canDrag?: boolean;
}>();

const emits = defineEmits<{
  (e: "selectStation", station: Station): void;
  (e: "addStationToFavorites", station: Station): void;
  (e: "removeStationFromFavorites", station: Station): void;
  (e: "positionUp", station: Station): void;
  (e: "positionDown", station: Station): void;
  (
    e: "replaceStations",
    stations: {
      stationOne: Station;
      stationTwo: Station;
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

const infoOpenHandler = (station: Station) => {
  if (currentOpenId.value === station.stationuuid) {
    currentOpenId.value = "id";
  } else {
    currentOpenId.value = station.stationuuid || "id";
  }
};

const checkStationInFavorites = (station: Station) => {
  if (props.favoriteStations === "add") {
    return false;
  } else if (props.favoriteStations === "remove") {
    return true;
  } else {
    return props.favoriteStations.some(
      (s) => s.stationuuid === station.stationuuid,
    );
  }
};

const addToFavorites = (station: Station) => {
  emits("addStationToFavorites", station);
};
const removeFromFavorites = (station: Station) => {
  emits("removeStationFromFavorites", station);
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
      :class="
        cn(
          'animate-fade-i relative flex h-fit w-[19%] min-w-56 grow  select-text flex-col justify-start gap-2  rounded bg-gradient-to-br from-hc-1 to-mc-1 p-2  shadow-md shadow-black/30 transition-all',
          {
            'pl-6': canDrag,
            'opacity-20':
              station.stationuuid === dragTarget?.stationuuid && isDragging,
          },
        )
      "
    >
      <!-- Drag Mask -->
      <div
        v-if="isDragging"
        class="absolute left-0 top-0 z-50 h-full w-full"
      ></div>
      <!-- Dragger -->
      <div
        v-if="canDrag"
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
        class="group absolute right-0 top-0 size-[2.2rem] overflow-hidden rounded-tr transition-all [clip-path:polygon(15%_0%,100%_0%,100%_85%)] hover:[clip-path:polygon(0%_0%,100%_0%,100%_100%)]"
      >
        <button
          v-if="!checkStationInFavorites(station)"
          @click="addToFavorites(station)"
          class="h-full w-full bg-mc-2"
        >
          <x-icon
            :icon="Plus"
            :size="18"
            :stroke-width="2"
            class="absolute right-0 top-0 transition-all"
          />
        </button>
        <button
          v-else-if="checkStationInFavorites(station)"
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
        </button>
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
            <x-icon :icon="Play" :size="40" :stroke-width="2.5" class="pl-1" />
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
            <x-image :src="getFlagImage(station.countrycode)" class="h-5 w-8" />
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
        class="-mt-3 h-[1.20rem] w-full text-center"
      >
        <button @click="infoOpenHandler(station)" class="w-5">
          <chevron-down
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
        <div>
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
    </Collapsible>
  </div>
</template>

<style scoped>
.left-drag-preview {
  @apply ml-12;
}
.left-drag-preview::before {
  content: "";
  @apply absolute right-full top-0 mr-2 h-full w-10 animate-fade-in rounded bg-mc-3;
}
.right-drag-preview {
  @apply mr-12;
}
.right-drag-preview::before {
  content: "";
  @apply absolute left-full top-0 ml-2 h-full w-10 animate-fade-in rounded bg-mc-3;
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
