<script setup lang="ts">
import {
  TooltipWrap,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HTMLAttributes } from "vue";

const slots = defineSlots<{
  trigger: () => any;
  content: () => any;
}>();

const props = defineProps<{
  triggerClass?: HTMLAttributes["class"];
  contentClass?: HTMLAttributes["class"];
  contentSide?: "top" | "bottom" | "left" | "right";
  contentSideOffset?: number;
}>();
</script>

<template>
  <TooltipProvider>
    <TooltipWrap>
      <TooltipTrigger :class="props.triggerClass" class="cursor-default">
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipContent
        :class="props.contentClass"
        :side="props.contentSide"
        :side-offset="props.contentSideOffset"
      >
        <slot name="content" />
      </TooltipContent>
    </TooltipWrap>
  </TooltipProvider>
</template>

<style scoped></style>
