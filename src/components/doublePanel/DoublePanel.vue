<script setup lang="ts">
import shadowOverlay from "@/components/ui/shadowOverlay/ShadowOverlay.vue";
import { type HTMLAttributes, ref } from "vue";
import { type UseSwipeDirection, useSwipe } from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";

defineSlots<{
  "left-panel": () => any;
  "right-panel": () => any;
}>();

const props = defineProps<{
  leftPanelName: string;
  rightPanelName: string;
  class?: HTMLAttributes["class"];
  defaultOpen?: "right" | "left";
}>();

const currentRightPanel = ref<boolean>(
  props.defaultOpen === "right" ? true : false,
);
const rightAnimation = ref<boolean>(
  props.defaultOpen === "right" ? true : false,
);

const leftAnimation = ref<boolean>(props.defaultOpen === "left" ? true : false);

const showLeftPanel = () => {
  rightAnimation.value = false;
  currentRightPanel.value = false;
};
const showRightPanel = () => {
  leftAnimation.value = false;
  currentRightPanel.value = true;
};

const SwipeEl = ref<HTMLElement | null>(null);
useSwipe(SwipeEl, {
  onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
    if (direction === "left") {
      showRightPanel();
    } else if (direction === "right") {
      showLeftPanel();
    }
  },
});

const uiSwitchHandler = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    showLeftPanel();
    return;
  }
  if (event.deltaY < 0) {
    showRightPanel();
    return;
  }
};
</script>

<template>
  <div
    ref="SwipeEl"
    :class="cn('relative h-full w-full', props.class)"
  >
    <div class="absolute flex h-full w-full flex-col gap-2">
      <!-- Shell -->
      <div
        class="flex h-full w-full gap-2 overflow-hidden transition-all *:transition-all"
      >
        <!-- Left panel -->
        <div class="grow overflow-hidden rounded">
          <div class="relative h-full w-full overflow-x-hidden">
            <shadow-overlay class="z-50" />
            <button
              class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-1 transition hover:bg-hc-1"
              :class="{
                'closed text-mc-1 hover:bg-mc-1 hover:text-hc-1':
                  !currentRightPanel && !leftAnimation,
                hidden: leftAnimation,
              }"
              @click="showLeftPanel"
            >
              <div class="z-20 -rotate-90 whitespace-nowrap text-xl">
                {{ leftPanelName }}
              </div>
            </button>
            <div
              v-show="!currentRightPanel"
              class="h-full w-full overflow-hidden"
            >
              <slot name="left-panel" />
            </div>
          </div>
        </div>
        <!-- Right panel -->
        <div
          :class="
            cn('w-[calc(90%-0.5rem)] shrink-0 overflow-hidden ', {
              'w-[10%]': !currentRightPanel,
            })
          "
        >
          <div class="relative z-50 h-full w-full overflow-x-hidden rounded">
            <shadow-overlay class="z-50" />
            <button
              class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-1 transition hover:bg-hc-1"
              :class="{
                'closed text-mc-1 hover:bg-mc-1 hover:text-hc-1':
                  currentRightPanel && !rightAnimation,
                hidden: rightAnimation,
              }"
              @click="showRightPanel"
            >
              <div class="z-20 rotate-90 whitespace-nowrap text-xl">
                {{ rightPanelName }}
              </div>
            </button>
            <div
              v-show="currentRightPanel"
              class="h-full w-full overflow-hidden"
            >
              <slot name="right-panel" />
            </div>
          </div>
        </div>
      </div>
      <!-- Switch bar -->
      <div
        class="flex h-3 w-full gap-2 overflow-hidden *:relative *:size-full *:overflow-hidden *:bg-mc-1 *:transition-all hover:*:bg-hc-1 disabled:*:bg-mc-2"
        @wheel="uiSwitchHandler"
      >
        <button
          :disabled="!currentRightPanel"
          class="rounded"
          @click="showLeftPanel"
        >
          <shadow-overlay />
        </button>
        <button
          :disabled="currentRightPanel"
          class="rounded"
          @click="showRightPanel"
        >
          <shadow-overlay />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.closed {
  animation: 300ms fade-out-hidden linear forwards;
}

@keyframes fade-out-hidden {
  0% {
    opacity: 1;
  }
  100% {
    display: none;
    visibility: hidden;
  }
}
</style>
