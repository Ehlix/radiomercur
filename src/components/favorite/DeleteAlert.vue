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
import { Delete } from "lucide-vue-next";
import DialogClose from "../ui/dialog/DialogClose.vue";

const props = defineProps<{
  folderName: string;
}>();

const emits = defineEmits<{
  (e: "delete", value: boolean): void;
}>();
</script>

<template>
  <Dialog>
    <DialogTrigger class="group flex w-10 items-center justify-center rounded">
      <x-icon
        :icon="Delete"
        class="text-tc-4 transition-all group-hover:text-red-500"
        :size="18"
        :stroke-width="2"
      />
    </DialogTrigger>
    <DialogContent class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <DialogHeader class="border-b border-mc-2 px-8 pt-2 xs:px-4">
          <DialogTitle class="text-2xl text-mc-2">
            {{ $t("favoriteBar.deleteFolder", [`"${props.folderName}"`]) }}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex flex-row gap-2 p-2">
          <DialogClose
            @click="emits('delete', false)"
            class="border border-mc-2 bg-white/0 text-mc-2 hover:border-hc-2 hover:bg-white/0 hover:text-hc-2"
          >
            {{ $t("buttons.cancel") }}
          </DialogClose>
          <DialogClose @click="emits('delete', true)">
            {{ $t("buttons.continue") }}
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
