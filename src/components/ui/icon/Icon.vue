<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { cn } from "@/lib/utils/twMerge";

type Props = {
  icon: typeof Search;
  size?: number;
  strokeWidth?: number;
  class?:string
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
