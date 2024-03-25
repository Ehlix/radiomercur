<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { DialogTitle, type DialogTitleProps } from "radix-vue";
import { cn } from "@/lib/utils/twMerge";

const props = defineProps<
  DialogTitleProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <DialogTitle
    :class="
      cn('text-lg font-semibold text-zinc-950 dark:text-zinc-50', props.class)
    "
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>
