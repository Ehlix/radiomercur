<script setup lang="ts">
import {
  Select,
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
  <Select v-model="selected" name="mode">
    <SelectTrigger class="text-tc-4" :class="class">
      <SelectValue placeholder="Search by" class="font-medium" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <SelectItem value="name">
          {{ $t("searchBar.name") }}
        </SelectItem>
        <SelectItem value="genres">
          {{ $tc("searchBar.genre", 1) }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
