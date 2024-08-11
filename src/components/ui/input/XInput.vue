<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue";
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

const input = ref<HTMLInputElement | null>(null);

defineExpose({ input });
</script>

<template>
  <input
    ref="input"
    v-model="modelValue"
    :class="
      cn(
        'flex h-8 w-full rounded-full border border-mc-3 bg-bgc-1 px-3 py-2 text-left text-base text-tc-1 transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tc-3 focus-visible:border-mc-2 focus-visible:bg-bgc-1 focus-visible:text-left focus-visible:text-tc-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:placeholder:text-tc-3 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
</template>
