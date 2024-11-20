<script setup lang="ts">
import type { HTMLAttributes } from "vue";

import { cn } from "@/shared/lib/utils/twMerge";

type Props = {
  icon: any;
  size?: number;
  strokeWidth?: number;
  class?: HTMLAttributes["class"];
};

const props = defineProps<Props>();
</script>

<template>
  <component
    :is="icon"
    :size="size || 24"
    :stroke-width="strokeWidth"
    :class="cn('text-tc-1', props.class)"
  />
</template>
