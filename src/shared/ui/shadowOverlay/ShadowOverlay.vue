<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { cn } from "@/shared/lib/utils/twMerge";


type Props = {
  variant?: "1" | "2";
  class?: HTMLAttributes["class"];
};

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="
      cn(
        'pointer-events-none absolute left-0 top-0 z-20 size-full',
        variant === '2'
          ? 'shadow-[inset_1px_1px_4px_2px_rgba(0,0,0,.1)]'
          : 'shadow-[inset_1px_1px_4px_2px_rgba(0,0,0,0.2)]',
        props.class,
      )
    "
  />
</template>
