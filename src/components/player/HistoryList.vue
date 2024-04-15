<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { useUserStore } from "@/stores/userStore";
import { useSearchStore } from "@/stores/searchStore";
import { generateId } from "@/lib/utils/generateId";
import HistoryCard from "./HistoryCard.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import { type HTMLAttributes } from "vue";
const searchStore = useSearchStore();
const userStore = useUserStore();

defineProps<{
  class?: HTMLAttributes["class"];
}>();

const playHandler = (station: Station) => {
  userStore.selectStation(station);
  searchStore.addToHistory(station);
};
</script>

<template>
  <dialog-main>
    <x-tooltip
      :trigger-class="$props.class"
      content-side="right"
    >
      <template #trigger>
        <dialog-trigger as-child>
          <x-icon
            :icon="History"
            :size="20"
            :stroke-width="2"
            class="cursor-pointer"
          />
        </dialog-trigger>
      </template>
      <template #content>
        <span>{{ $tc("searchBar.history") }}</span>
      </template>
    </x-tooltip>

    <dialog-content
      class="w-full max-w-[70dvw] bg-mc-2 p-1 transition-none sm:max-w-[425px]"
    >
      <div
        class="grid h-fit max-h-[80dvh] min-h-[20dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header class="border-b border-mc-2 p-2 px-6 xs:p-1 xs:px-4">
          <dialog-title class="text-2xl text-mc-2">
            {{ $tc("searchBar.history") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <div
          class="my-2 grid gap-2 overflow-y-auto overflow-x-hidden px-6 xs:px-4"
        >
          <history-card
            v-for="station in searchStore.historyList"
            :key="station.stationuuid + generateId()"
            :user-locale="userStore.locale"
            :station="station"
            @play-handler="playHandler"
          />
        </div>
        <!-- <DialogFooter class="p-6 pt-0"> </DialogFooter> -->
      </div>
    </dialog-content>
  </dialog-main>
</template>
