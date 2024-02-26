<script setup lang="ts">
import { cn } from '@/lib/utils/twMerge';
import type { HTMLAttributes } from 'vue';


type Props = {
  variant?: "1" | "2";
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn('pointer-events-none absolute top-0 left-0 z-20 size-full shadow-[inset_1px_1px_4px_2px_rgba(0,0,0,0.2)]', props.class)"
  ></div>
</template>
