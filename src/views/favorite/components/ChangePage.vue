<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import XInput from "@/components/ui/input/XInput.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { Milestone } from "lucide-vue-next";
import DialogClose from "@/components/ui/dialog/DialogClose.vue";
import { ref } from "vue";
import { useFavoriteStore } from "../favoriteStore";

const { currentPage, STATIONS_PER_PAGE, totalStationCount } =
  useFavoriteStore();

const inputValue = ref<number>(currentPage.value);
</script>

<template>
  <dialog-main>
    <dialog-trigger
      :disabled="totalStationCount <= STATIONS_PER_PAGE"
      class="flex h-8 w-5 min-w-8 items-center justify-center gap-1 bg-mc-1 px-2 text-mc-2 hover:bg-mc-1 hover:text-hc-2 disabled:opacity-50 xs:min-w-5"
      @click="inputValue = currentPage"
    >
      {{ currentPage }}
    </dialog-trigger>
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <form
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
        @click.prevent=""
      >
        <dialog-header class="border-b border-mc-2 px-2 pt-2">
          <dialog-title class="text-2xl text-mc-2">
            {{
              `${$t("favoriteBar.changePage")} (${$t("buttons.total", { count: totalStationCount / STATIONS_PER_PAGE }).toLowerCase()})`
            }}
          </dialog-title>
          <dialog-description>
            <div class="flex gap-2 py-2">
              <div class="relative w-full">
                <x-input
                  v-model.trim.number="inputValue"
                  name="searchInput"
                  type="number"
                  maxlength="25"
                  :placeholder="$t('favoriteBar.enterPage')"
                  class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
                />
                <x-icon
                  :icon="Milestone"
                  :size="30"
                  :stroke-width="1.5"
                  class="absolute inset-y-[0.15rem] start-[0.29rem] flex items-center justify-center px-1 text-tc-4"
                />
              </div>
            </div>
          </dialog-description>
        </dialog-header>

        <dialog-footer class="flex flex-row gap-2 p-2">
          <dialog-close
            class="border border-mc-2 bg-white/0 text-mc-2 hover:border-hc-2 hover:bg-white/0 hover:text-hc-2"
          >
            {{ $t("buttons.cancel") }}
          </dialog-close>
          <DialogClose type="submit">
            {{ $t("buttons.save") }}
          </DialogClose>
        </dialog-footer>
      </form>
    </dialog-content>
  </dialog-main>
</template>
