<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";

const DRAGGER_SIZE = 4;
const LEFT_MAX_SCALE = 0.9;
const RIGHT_MAX_SCALE = 0.1;
const shell = ref<HTMLDivElement>();
const leftPanel = ref<HTMLDivElement>();
const rightPanel = ref<HTMLDivElement>();
const shellWidth = ref<number>(0);
const mousePosition = ref<number>();
const resizingScale = ref<number>(LEFT_MAX_SCALE);
const showLeftOverlay = computed(() => {
  return resizingScale.value >= 0.83;
});
const showRightOverlay = computed(() => {
  return resizingScale.value <= 0.17;
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
  if (currentScale > RIGHT_MAX_SCALE && currentScale < LEFT_MAX_SCALE) {
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
  resizingScale.value = RIGHT_MAX_SCALE;
};
const goToLeft = () => {
  resizingScale.value = LEFT_MAX_SCALE;
};
const goToCenter = () => {
  resizingScale.value = 0.5;
};

const switcherHandler = (status: number) => {
  switch (status) {
    case 1:
      goToRight();
      break;
    case 2:
      goToCenter();
      break;
    case 3:
      goToLeft();
      break;
  }
};

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
  shellWidth.value = width | 0;
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
  <div class="flex h-full w-full flex-col items-center justify-center gap-1">
    <!-- Shell -->
    <div
      ref="shell"
      class="relative flex h-full w-full *:*:border *:*:border-mc-3 *:*:*:py-4"
    >
      <!-- Left panel -->
      <div
        ref="leftPanel"
        class="absolute bottom-0 left-0 right-[90%] top-0"
        :class="{
          ' duration-400 transition-all': !dragStart,
        }"
      >
        <div class="relative h-full w-full bg-red-200/50">
          <button
            @click="goToRight"
            class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-opc-1 backdrop-blur-md"
            :class="{ hidden: !showLeftOverlay }"
          >
            <div class="z-20 flex -rotate-90 flex-nowrap text-nowrap text-xl">
              My stationsList
            </div>
          </button>

          <slot name="left-panel"></slot>
        </div>
      </div>
      <!-- Right panel -->
      <div
        ref="rightPanel"
        class="absolute bottom-0 right-0 top-0 w-[90%] pl-1"
        :class="{
          ' duration-400 transition-all': !dragStart,
        }"
      >
        <div class="relative h-full w-full bg-red-100/40">
          <button
            @click="goToLeft"
            class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-opc-1 backdrop-blur-md"
            :class="{ hidden: !showRightOverlay }"
          >
            <div class="z-20 flex rotate-90 flex-nowrap text-nowrap text-xl">
              Search station
            </div>
          </button>
          <slot name="right-panel"></slot>
        </div>
        <!-- Dragger -->
        <div
          @mousedown="startDragHandler"
          class="absolute left-0 top-0 z-40 h-full w-1 cursor-ew-resize border-none"
        ></div>
      </div>
    </div>
    <!-- Switcher bar -->
    <div
      class="flex h-3 w-full overflow-hidden border border-mc-3 bg-red-900/50"
    >
      <button
        v-for="i in 3"
        :key="i"
        @click="() => switcherHandler(i)"
        class="h-full w-full transition-all duration-300 hover:bg-mc-3"
        :class="{
          'border-x border-mc-3': i === 2,
        }"
      ></button>
    </div>
  </div>
</template>

<style scoped></style>
