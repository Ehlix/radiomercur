<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        'focus-visible:bg-mc-4 text-mc-3 flex h-8 text-left w-full border border-mc-3 bg-opc-1 px-3 py-2 text-base transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tc-3 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-mc-3 focus-visible:placeholder:text-opc-1 focus-visible:text-left disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
