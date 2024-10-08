<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { TabsList, type TabsListProps } from "radix-vue";

import { cn } from "@/shared/lib/utils/twMerge";


const props = defineProps<
  TabsListProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex h-8 w-full items-center justify-center gap-1 text-tc-3',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
