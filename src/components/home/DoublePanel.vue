<script setup lang="ts">
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";
import { type HTMLAttributes, computed, onMounted, ref, watch } from "vue";
import {
  useResizeObserver,
  useSwipe,
  type UseSwipeDirection,
} from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";
import { LucideAlignStartHorizontal } from "lucide-vue-next";

// const props = defineProps<{
//   class?: HTMLAttributes["class"];
// }>();
const minLeftZone = ref(0.83);
const minRightZone = ref(0.17);
const DRAGGER_SIZE = 8;
const LEFT_MAX_SCALE = 0.9;
const rightMaxScale = ref(0.1);
const shell = ref<HTMLDivElement>();
const leftPanel = ref<HTMLDivElement>();
const rightPanel = ref<HTMLDivElement>();
const shellWidth = ref<number>(0);
const mousePosition = ref<number>();
const resizingScale = ref<number>(LEFT_MAX_SCALE);
const showLeftOverlay = computed(() => {
  return resizingScale.value >= minLeftZone.value;
});
const showRightOverlay = computed(() => {
  return resizingScale.value <= minRightZone.value;
});
const dragStart = ref(false);

const resize = (event: MouseEvent) => {
  if (!rightPanel.value || !mousePosition.value) {
    return;
  }
  const dx = mousePosition.value - event.x;
  mousePosition.value = event.x;
  const total = parseInt(getComputedStyle(rightPanel.value, "").width) + dx;
  const currentScale = total / shellWidth.value;
  if (currentScale > rightMaxScale.value && currentScale < LEFT_MAX_SCALE) {
    resizingScale.value = currentScale;
  }
};

const startDragHandler = (event: MouseEvent) => {
  dragStart.value = true;
  if (!rightPanel.value) {
    return;
  }
  if (event.offsetX <= DRAGGER_SIZE) {
    mousePosition.value = event.x;
    document.addEventListener("mousemove", resize, false);
  }
};

const goToRight = () => {
  resizingScale.value = rightMaxScale.value;
};
const goToLeft = () => {
  resizingScale.value = LEFT_MAX_SCALE;
};
const goToCenter = () => {
  resizingScale.value = 0.505;
};

const uiSwitchHandler = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    if (showRightOverlay.value) {
      goToCenter();
      return;
    }
    if (!showLeftOverlay.value && !showRightOverlay.value) {
      goToLeft();
      return;
    }
  }
  if (event.deltaY < 0) {
    if (showLeftOverlay.value) {
      goToCenter();
      return;
    }
    if (!showLeftOverlay.value && !showRightOverlay.value) {
      goToRight();
      return;
    }
  }
};

const SwipeEl = ref<HTMLElement | null>(null);
const { isSwiping, direction, lengthX, lengthY } = useSwipe(SwipeEl, {
  // onSwipe(e: TouchEvent) {
  //   console.log(lengthX.value)
  //   if (lengthX.value < 0) {
  //     swipeLength.value = lengthX.value
  //   } else if (lengthX.value > 0) {
  //     swipeLength.value = lengthX.value
  //   }
  // },
  onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
    if (direction === "left") {
      goToLeft();
    } else if (direction === "right") {
      goToRight();
    }
  },
});

onMounted(() => {
  document.addEventListener("mouseup", () => {
    if (showLeftOverlay.value) {
      goToLeft();
    }
    if (showRightOverlay.value) {
      goToRight();
    }
    dragStart.value = false;
    document.removeEventListener("mousemove", resize, false);
  });
});

useResizeObserver(shell, (entries) => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  if (width <= 1000) {
    minLeftZone.value = 0.7;
    minRightZone.value = 0.3;
  }
  if (width <= 700) {
    minLeftZone.value = 0.55;
    minRightZone.value = 0.45;
  }
  shellWidth.value = width | 0;
  rightMaxScale.value = Math.trunc((0.1 + DRAGGER_SIZE / width) * 1000) / 1000;
});

watch([resizingScale, shellWidth], () => {
  if (!rightPanel.value || !leftPanel.value) {
    return;
  }
  rightPanel.value.style.width = shellWidth.value * resizingScale.value + "px";
  leftPanel.value.style.right = shellWidth.value * resizingScale.value + "px";
});
</script>

<template>
  <div
    ref="SwipeEl"
    :class="cn('flex h-full w-full flex-col items-center justify-center gap-2')"
  >
    <!-- Shell -->
    <div
      ref="shell"
      class="relative flex h-full w-full overflow-hidden"
      :class="{
          ' *:duration-300 transition-all': !dragStart,
        }"
    >
      <!-- Left panel -->
      <div
        ref="leftPanel"
        class="absolute bottom-0 left-0 right-[90%] top-0 overflow-hidden rounded"
      >
        <div class="relative h-full w-full">
          <shadow-overlay />
          <button
            @click="goToRight"
            class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-2 transition hover:bg-hc-1"
            :class="{ hidden: !showLeftOverlay }"
          >
            <div class="z-20 flex -rotate-90 flex-nowrap text-nowrap text-xl">
              Favorite stations
            </div>
          </button>

          <slot :v-show="!showLeftOverlay" name="left-panel"></slot>
        </div>
      </div>
      <!-- Right panel -->
      <div
        ref="rightPanel"
        class="absolute bottom-0 right-0 top-0 w-[90%] pl-2"
      >
        <div class="relative h-full w-full overflow-hidden rounded">
          <shadow-overlay />
          <button
            @click="goToLeft"
            class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-2 transition hover:bg-hc-1"
            :class="{ hidden: !showRightOverlay }"
          >
            <div class="z-20 flex rotate-90 flex-nowrap text-nowrap text-xl">
              Search station
            </div>
          </button>
          <slot :v-show="!showRightOverlay" name="right-panel"></slot>
        </div>
        <!-- Dragger -->
        <div
          @mousedown="startDragHandler"
          class="absolute left-0 top-0 z-40 h-full w-2 cursor-ew-resize border-none"
        ></div>
      </div>
    </div>
    <!-- Switcher bar -->
    <div
      @wheel="uiSwitchHandler"
      class="flex h-3 w-full gap-2 overflow-hidden *:relative *:size-full *:overflow-hidden *:rounded *:bg-mc-3 *:transition-all hover:*:bg-hc-1 disabled:*:bg-mc-2"
      :class="{
        'even:*:bg-mc-2': !showRightOverlay && !showLeftOverlay,
      }"
    >
      <button :disabled="showRightOverlay" @click="goToRight">
        <shadow-overlay />
      </button>
      <button @click="goToCenter" class="sm:hidden">
        <shadow-overlay />
      </button>
      <button :disabled="showLeftOverlay" @click="goToLeft">
        <shadow-overlay />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
