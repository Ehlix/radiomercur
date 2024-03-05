<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computed, ref, watchEffect } from "vue";
import { messages } from "@/lib/locale/locale";
import { useUserStations } from "@/stores/userStations";

const props = defineProps<{
  country?: string;
}>();
const selected = ref(props.country || "All");

const userStore = useUserStations();
const countries = computed(() =>
  Object.entries(messages[userStore.locale].countries).sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  }),
);

const emits = defineEmits<{
  (e: "changeCountry", value: string): void;
}>();

watchEffect(() => {
  emits("changeCountry", selected.value);
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
        <SelectItem value="All">
          {{ $t("searchBar.defaultCountry") }}
        </SelectItem>
        <SelectItem v-for="country in countries" :value="country[0]">
          {{ country[1] }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
