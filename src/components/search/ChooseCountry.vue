<script setup lang="ts">
import {
  SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computed, ref, watchEffect, type HTMLAttributes } from "vue";
import { messages } from "@/lib/locale/locale";

const props = defineProps<{
  countryCode?: CountryCodes | "all";
  userLocale: "en" | "ru";
  class?: HTMLAttributes["class"];
}>();
const selected = ref<CountryCodes | "all">(props.countryCode || "all");
const countries = computed(() =>
  Object.entries(messages[props.userLocale].countries).sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  }),
);

const emits = defineEmits<{
  (e: "changeCountryCode", value: CountryCodes | "all"): void;
}>();

watchEffect(() => {
  emits("changeCountryCode", selected.value);
});
</script>

<template>
  <select-main
    v-model="selected"
    name="countries"
  >
    <select-trigger
      class="text-tc-4"
      :class="props.class"
    >
      <select-value
        placeholder="All countries"
        class="font-medium"
      />
    </select-trigger>
    <select-content>
      <select-group class="text-tc-4">
        <!-- <SelectLabel>Countries</SelectLabel> -->
        <select-item value="all">
          {{ $t("searchBar.defaultCountry") }}
        </select-item>
        <select-item
          v-for="country in countries"
          :key="country[0]"
          :value="country[0]"
        >
          {{ country[1] }}
        </select-item>
      </select-group>
    </select-content>
  </select-main>
</template>
