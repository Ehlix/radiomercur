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

const props = defineProps<{
  countryCode?: CountryCodes | 'all';
  userLocale: "en" | "ru";
}>();
const selected = ref<CountryCodes | 'all'>(props.countryCode || "all");
const countries = computed(() =>
  Object.entries(messages[props.userLocale].countries).sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  }),
);

const emits = defineEmits<{
  (e: "changeCountryCode", value: CountryCodes | 'all'): void;
}>();

watchEffect(() => {
  emits("changeCountryCode", selected.value);
});
</script>

<template>
  <Select v-model="selected" name="countries">
    <SelectTrigger class="text-tc-4">
      <SelectValue placeholder="All countries" class="font-medium"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <SelectItem value="all">
          {{ $t("searchBar.defaultCountry") }}
        </SelectItem>
        <SelectItem v-for="country in countries" :value="country[0]">
          {{ country[1] }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
@/stores/userStore
