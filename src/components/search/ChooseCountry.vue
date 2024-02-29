<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countriesList } from "@/lib/static/countriesList";
import { ref, watchEffect } from "vue";

const names = Object.values(countriesList);
const selected = ref("All");

const emits = defineEmits<{
  (e: "changeCountry", value: string): void;
}>();

watchEffect(() => {
  emits("changeCountry", selected.value);
})

</script>

<template>
  <Select v-model="selected" name="countries">
    <SelectTrigger class="text-tc-4">
      <SelectValue placeholder="All countries" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <SelectItem value="All"> All countries </SelectItem>
        <SelectItem v-for="country in names" :value="country">
          {{ country }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
