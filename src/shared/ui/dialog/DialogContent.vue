<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { X } from "lucide-vue-next";
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useForwardPropsEmits,
} from "radix-vue";

import { cn } from "@/shared/lib/utils/twMerge";
import XIcon from "@/shared/ui/icon/XIcon.vue";

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-[0.15rem] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      v-bind="forwarded"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded bg-bgc-1 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[57%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[57%]',
          props.class,
        )
      "
    >
      <slot />

      <DialogClose
        class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-tc-1 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-mc-2 disabled:pointer-events-none data-[state=open]:bg-mc-2 data-[state=open]:text-mc-2"
      >
        <x-icon :icon="X" :size="20" :stroke-width="2.5" class="text-mc-2" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
