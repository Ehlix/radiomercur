<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { ChevronDown } from "lucide-vue-next";
import {
  SelectIcon,
  SelectTrigger,
  type SelectTriggerProps,
  useForwardProps,
} from "radix-vue";

import { cn } from "@/shared/lib/utils/twMerge";
import ShadowOverlay from "../shadowOverlay/ShadowOverlay.vue";

const props = defineProps<
  SelectTriggerProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex h-8 w-full items-center justify-between overflow-hidden rounded bg-mc-3 p-2 pr-1.5 text-base text-mc-1 placeholder:text-tc-3 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class,
      )
    "
  >
    <shadow-overlay variant="2" />
    <slot />
    <SelectIcon as-child>
      <ChevronDown :size="22" stroke-width="2" class="min-w-6" />
    </SelectIcon>
  </SelectTrigger>
</template>
