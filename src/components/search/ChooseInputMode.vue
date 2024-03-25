<script setup lang="ts">
import {
  SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ref, watchEffect, type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const selected = ref<"name" | "genres">("name");

const emits = defineEmits<{
  (e: "currentSelect", value: typeof selected.value): void;
}>();

watchEffect(() => {
  emits("currentSelect", selected.value);
});
</script>

<template>
  <select-main v-model="selected" name="mode">
    <select-trigger class="text-tc-4" :class="props.class">
      <select-value placeholder="Search by" class="font-medium" />
    </select-trigger>
    <select-content>
      <select-group class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <select-item value="name">
          {{ $t("searchBar.name") }}
        </select-item>
        <select-item value="genres">
          {{ $tc("searchBar.genre", 1) }}
        </select-item>
      </select-group>
    </select-content>
  </select-main>
</template>
