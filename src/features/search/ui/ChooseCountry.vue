<script setup lang="ts">
import { messages } from "@/shared/lib/locale/locale";
import { useUserStore } from "@/entities/user";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectMain,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { type HTMLAttributes, computed, ref, watchEffect } from "vue";

const props = defineProps<{
  countryCode?: string;
  class?: HTMLAttributes["class"];
}>();

const { locale } = useUserStore();
const selected = ref<string>(props.countryCode || "all");
const countries = computed(() =>
  Object.entries(messages[locale.value].countries).sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  }),
);

const emits = defineEmits<{
  (e: "changeCountryCode", value: string): void;
}>();

watchEffect(() => {
  emits("changeCountryCode", selected.value);
});
</script>

<template>
  <select-main v-model="selected" name="countries">
    <select-trigger :class="props.class">
      <select-value placeholder="All countries" class="font-medium" />
    </select-trigger>
    <select-content>
      <select-group>
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
