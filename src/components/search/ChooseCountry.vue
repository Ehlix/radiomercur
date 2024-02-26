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

const codes = Object.keys(countriesList);


const selected = ref("All");

watchEffect(() => {
  console.log(selected.value);
});
</script>

<template>
  <Select v-model="selected" name="countries">
    <SelectTrigger class="text-tc-4">
      <SelectValue placeholder="All countries" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <SelectItem value="All"  > All countries </SelectItem>
        <SelectItem v-for="code in codes" :value="code">
          {{ countriesList[code] }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
