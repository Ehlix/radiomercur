<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { SliderRootEmits, SliderRootProps } from "radix-vue";
import {
  SliderRange,
  SliderRoot,
  SliderTrack,
  useForwardPropsEmits,
} from "radix-vue";
import { cn } from "@/shared/lib/utils/twMerge";

const props = defineProps<
  SliderRootProps & { class?: HTMLAttributes["class"] }
>();
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SliderRoot
    :class="
      cn(
        'relative flex w-full touch-none select-none items-center',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <SliderTrack
      class="relative h-8 w-20 grow overflow-hidden bg-bgc-1 [clip-path:polygon(100%_10%,0%_100%,100%_100%)]"
    >
      <SliderRange class="absolute h-full bg-mc-2" />
      <!-- <SliderThumb
      class="block h-8 w-0 border-r border-mc-1 opacity ring-mc-1 transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50"
    /> -->
    </SliderTrack>
  </SliderRoot>
</template>
