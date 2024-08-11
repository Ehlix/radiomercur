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
import HistoryCard from "./HistoryCard.vue";
import { type HTMLAttributes } from "vue";

const { selectStation, historyList, locale } = useUserStore();

defineProps<{
  class?: HTMLAttributes["class"];
}>();

const playHandler = (station: Station) => {
  selectStation(station);
};
</script>

<template>
  <dialog-main>
    <dialog-trigger
      as-child
      class="flex w-8 cursor-pointer items-center justify-center"
    >
      <div v-tooltip:bottom="$t('searchBar.history')">
        <x-icon
          :icon="History"
          :size="20"
          :stroke-width="2"
        />
      </div>
    </dialog-trigger>

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
          class="contain-inline-size-[100dvh] my-2 grid gap-2 overflow-y-auto overflow-x-hidden px-6 content-visibility-auto xs:px-4"
        >
          <history-card
            v-for="station in historyList"
            :key="station.stationuuid"
            :user-locale="locale"
            :station="station"
            @play-handler="playHandler"
          />
          <div
            v-if="!historyList.length"
            class="flex w-full items-center justify-center px-2 py-4 text-center text-lg font-semibold text-mc-2"
          >
            {{ $tc("favoriteBar.empty") }}
          </div>
        </div>
        <!-- <DialogFooter class="p-6 pt-0"> </DialogFooter> -->
      </div>
    </dialog-content>
  </dialog-main>
</template>
