<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from "radix-vue";

import { cn } from "@/shared/lib/utils/twMerge";

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
    class: "",
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="
      cn(
        'relative flex h-1 w-full items-center justify-center overflow-hidden rounded-full',
        props.class,
      )
    "
  >
    <ProgressIndicator
      v-if="props.modelValue"
      class="h-full w-full flex-1 bg-mc-3 transition-all dark:bg-zinc-50"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
