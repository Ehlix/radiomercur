<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import {
  DialogDescription,
  type DialogDescriptionProps,
  useForwardProps,
} from "radix-vue";

import { cn } from "@/shared/lib/utils/twMerge";


const props = defineProps<
  DialogDescriptionProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-sm text-zinc-500 dark:text-zinc-400', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
