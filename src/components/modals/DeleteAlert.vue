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
import DialogClose from "@/components/ui/dialog/DialogClose.vue";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  title: string;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "delete", value: boolean): void;
}>();
</script>

<template>
  <dialog-main>
    <dialog-trigger :class="props.class">
      <slot />
    </dialog-trigger>
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header class="border-b border-mc-2 px-8 pt-2 xs:px-4">
          <dialog-title class="text-2xl text-mc-2">
            {{ props.title }}
          </dialog-title>
          <DialogDescription />
        </dialog-header>

        <dialog-footer class="flex flex-row gap-2 p-2">
          <dialog-close
            class="border border-mc-2 bg-white/0 text-mc-2 hover:border-hc-2 hover:bg-white/0 hover:text-hc-2"
            @click="emits('delete', false)"
          >
            {{ $t("buttons.cancel") }}
          </dialog-close>
          <dialog-close @click="emits('delete', true)">
            {{ $t("buttons.continue") }}
          </dialog-close>
        </dialog-footer>
      </div>
    </dialog-content>
  </dialog-main>
</template>

<style scoped></style>
