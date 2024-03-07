<script setup lang="ts">
import shadowOverlay from "../ui/shadowOverlay/shadowOverlay.vue";
import { type HTMLAttributes, ref, onMounted } from "vue";
import { type UseSwipeDirection, useSwipe } from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";

const props = defineProps<{
  leftPanelName: string;
  rightPanelName: string;
  class?: HTMLAttributes["class"];
}>();

const currentRightPanel = ref<boolean>(true);
const firstAnimation = ref<boolean>(true);

const showLeftPanel = () => {
  firstAnimation.value = false;
  currentRightPanel.value = false;
};
const showRightPanel = () => {
  // firstAnimation.value = false;
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
  <div ref="SwipeEl" :class="cn('relative h-full w-full', props.class)">
    <div class="absolute flex h-full w-full flex-col gap-2">
      <!-- Shell -->
      <div
        class="flex h-full w-full gap-2 overflow-hidden transition-all *:transition-all"
      >
        <!-- Left panel -->
        <div class="grow overflow-hidden rounded">
          <div class="relative h-full w-full overflow-x-hidden">
            <shadow-overlay class="z-50"/>
            <button
              @click="showLeftPanel"
              class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-1 transition hover:bg-hc-1"
              :class="{
                'closed text-mc-1 hover:text-hc-1 hover:bg-mc-1': !currentRightPanel,
              }"
            >
              <div class="z-20 flex -rotate-90 flex-nowrap text-nowrap text-xl">
                {{ leftPanelName }}
              </div>
            </button>

            <slot :v-show="!currentRightPanel" name="left-panel"></slot>
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
          <div class="relative h-full w-full overflow-x-hidden rounded">
            <shadow-overlay class="z-50"/>
            <button
              @click="showRightPanel"
              class="absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-mc-1 transition hover:bg-hc-1"
              :class="{
                'closed hover:bg-mc-1 text-mc-1 hover:text-hc-1':
                  currentRightPanel && !firstAnimation,
                hidden: firstAnimation,
              }"
            >
              <div class="z-20 flex rotate-90 flex-nowrap text-nowrap text-xl">
                {{ rightPanelName }}
              </div>
            </button>
            <slot :v-show="currentRightPanel" name="right-panel"></slot>
          </div>
        </div>
      </div>
      <!-- Switch bar -->
      <div
        @wheel="uiSwitchHandler"
        class="flex h-3 w-full gap-2 overflow-hidden *:relative *:size-full *:overflow-hidden *:bg-mc-1 *:transition-all hover:*:bg-hc-1 disabled:*:bg-mc-2"
      >
        <button
          :disabled="!currentRightPanel"
          @click="showLeftPanel"
          class="rounded"
        >
          <shadow-overlay />
        </button>
        <button
          :disabled="currentRightPanel"
          @click="showRightPanel"
          class="rounded"
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
  }
}
</style>
