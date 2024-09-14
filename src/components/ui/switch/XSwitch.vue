<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits,
} from "radix-vue";
import { cn } from "@/common/utils/twMerge";

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes["class"] }
>();

const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        'peer relative inline-flex h-8 w-12 shrink-0 cursor-pointer items-center overflow-hidden rounded px-0 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-mc-2 data-[state=unchecked]:bg-mc-3',
        props.class,
      )
    "
  >
    <div
      :class="
        cn(
          'absolute right-[0.5rem] font-semibold text-mc-1 transition-transform',
          {
            'translate-x-8': props.checked,
          },
        )
      "
    >
      Off
    </div>
    <div
      :class="
        cn(
          'absolute left-[0.45rem] font-semibold text-mc-1 transition-transform',
          {
            '-translate-x-7': !props.checked,
          },
        )
      "
    >
      On
    </div>
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block h-7 w-2 rounded-sm bg-mc-1 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-9 data-[state=unchecked]:translate-x-1',
        )
      "
    />
  </SwitchRoot>
</template>
