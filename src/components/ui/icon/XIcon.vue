<script setup lang="ts">
import { cn } from "@/common/utils/twMerge";
import type { HTMLAttributes } from "vue";

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
