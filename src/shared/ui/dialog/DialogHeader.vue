<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { cn } from "@/shared/lib/utils/twMerge";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn('flex flex-col gap-y-1.5 text-center', props.class)">
    <slot />
  </div>
</template>
