<script setup lang="ts">
import { useFavoriteStore } from "@/entities/favorites";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogTrigger,
  XIcon,
  XInput,
} from "@/shared/ui";
import XButton from "@/shared/ui/button/XButton.vue";
import { FolderPen, FolderPlus, X } from "lucide-vue-next";
import { ref } from "vue";

const { createNewFolder } = useFavoriteStore();
const inputValue = ref<string>("");

const clearInput = () => {
  inputValue.value = "";
};
</script>

<template>
  <dialog-main>
    <dialog-trigger
      class="group flex w-fit items-center justify-center rounded"
    >
      <x-button
        class="flex h-8 min-w-10 justify-center gap-1 bg-mc-2 px-2 text-sm hover:bg-hc-2"
        @click="clearInput"
      >
        <x-icon
          :icon="FolderPlus"
          class="text-mc-1 transition-all"
          :size="24"
          :stroke-width="1.5"
        />
        <span class="text-mc-1 xs:hidden">
          {{ $t("favoriteBar.newFolder") }}
        </span>
      </x-button>
    </dialog-trigger>
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <form
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
        @submit.prevent="createNewFolder(inputValue)"
      >
        <dialog-header class="border-b border-mc-2 px-2 pt-2">
          <dialog-title class="text-2xl text-mc-2">
            {{ $t("favoriteBar.addNewFolder") }}
          </dialog-title>
          <dialog-description>
            <div class="flex gap-2 py-2">
              <div class="relative w-full">
                <x-input
                  v-model.trim="inputValue"
                  name="searchInput"
                  type="text"
                  maxlength="25"
                  :placeholder="$t('favoriteBar.addFolderPlaceholder')"
                  class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
                />
                <x-icon
                  :icon="FolderPen"
                  :size="30"
                  :stroke-width="1.5"
                  class="absolute inset-y-[0.15rem] start-[0.29rem] flex items-center justify-center px-1 text-tc-4"
                />
                <x-icon
                  :icon="X"
                  :size="32"
                  :stroke-width="1.5"
                  class="absolute inset-y-0 end-1 flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
                  @click="() => (inputValue = '')"
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
          <dialog-close type="submit">
            {{ $t("buttons.save") }}
          </dialog-close>
        </dialog-footer>
      </form>
    </dialog-content>
  </dialog-main>
</template>

<style scoped></style>
