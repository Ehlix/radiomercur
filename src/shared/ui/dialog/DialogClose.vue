<script setup lang="ts">
import { DialogClose, type DialogCloseProps } from "radix-vue";


const props = defineProps<DialogCloseProps>();
</script>

<template>
  <DialogClose
    v-bind="props"
    class="text-md inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-mc-2 text-base font-medium text-mc-1 transition hover:bg-hc-2"
  >
    <slot />
  </DialogClose>
</template>
