<script setup lang="ts">
import XButton from "@/components/ui/button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import XInput from "@/components/ui/input/Input.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { FolderPen, Pen, X } from "lucide-vue-next";
import DialogClose from "../ui/dialog/DialogClose.vue";
import { ref } from "vue";

const props = defineProps<{
  folderName: string;
}>();

const emits = defineEmits<{
  (e: "renameFolder", value: string): void;
}>();

const inputValue = ref<string>(props.folderName);

const addHandler = () => {
  if (!inputValue.value) {
    return;
  }
  emits("renameFolder", inputValue.value);
};
</script>

<template>
  <Dialog>
    <DialogTrigger class="group flex w-fit items-center justify-center rounded">
      <x-button
        @click="inputValue = props.folderName"
        class="group flex h-8 w-8 min-w-8 justify-center bg-mc-3 p-0 hover:bg-white/0"
      >
        <x-icon
          :icon="Pen"
          class="text-tc-4 transition-all group-hover:text-mc-2"
          :size="20"
          :stroke-width="1.5"
        />
      </x-button>
    </DialogTrigger>
    <DialogContent class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <DialogHeader class="border-b border-mc-2 px-2 pt-2">
          <DialogTitle class="text-2xl text-mc-2">
            {{ $t("favoriteBar.renameFolder") }}
          </DialogTitle>
          <DialogDescription>
            <div class="flex gap-2 py-2">
              <div class="relative w-full">
                <x-input
                  name="searchInput"
                  type="text"
                  maxlength="25"
                  v-model.trim="inputValue"
                  :placeholder="$t('favoriteBar.renameFolderPlaceholder')"
                  class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
                />
                <x-icon
                  :icon="FolderPen"
                  :size="30"
                  :stroke-width="1.5"
                  class="absolute inset-y-[0.15rem] start-[0.29rem] flex items-center justify-center px-1 text-tc-4"
                />
                <x-icon
                  @click="() => (inputValue = '')"
                  :icon="X"
                  :size="32"
                  :stroke-width="1.5"
                  class="absolute inset-y-0 end-1 flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex flex-row gap-2 p-2">
          <DialogClose
            class="border border-mc-2 bg-white/0 text-mc-2 hover:border-hc-2 hover:bg-white/0 hover:text-hc-2"
          >
            {{ $t("buttons.cancel") }}
          </DialogClose>
          <DialogClose @click="addHandler">
            {{ $t("buttons.save") }}
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
