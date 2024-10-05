<script setup lang="ts">
import { useSearchStore } from "@/entities/search";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectMain,
  SelectTrigger,
  SelectValue,
  XButton,
  XIcon,
  XInput,
  XSwitch,
} from "@/shared/ui";
import { useDebounce } from "@vueuse/core";
import {
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  Search,
  Star,
  ThumbsUp,
  X,
} from "lucide-vue-next";
import { ref, watch } from "vue";
import ChooseCountry from "./ChooseCountry.vue";

const { filters, updateFilters } = useSearchStore();
const searchInput = ref<InstanceType<typeof XInput> | null>(null);
const searchValue = ref<string>();
const debSearch = useDebounce(searchValue, 500);
const currentTab = ref<"name" | "genres">("name");

const hqOnly = (highQualityOnly: boolean) => {
  updateFilters({ highQualityOnly });
};

const reverseSearch = (reverse: boolean) => {
  updateFilters({ reverse });
};

const changeOrder = (order: ParamsOrder) => {
  updateFilters({ order });
};

const changeCountryCode = (countryCode: string) => {
  if (countryCode === "all") {
    updateFilters({ countryCode: undefined });
  } else {
    updateFilters({ countryCode });
  }
};

const searchInputFocus = () => {
  searchInput.value?.input?.focus();
};

const clearSearch = () => {
  searchValue.value = "";
};

watch([debSearch, currentTab], () => {
  if (currentTab.value === "name") {
    updateFilters({ name: debSearch.value, tag: "" });
  } else if (currentTab.value === "genres") {
    updateFilters({ name: "", tag: debSearch.value });
  }
});
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div class="flex w-full items-center gap-2 sm:flex-col">
      <!-- Input Mode -->
      <select-main v-model="currentTab" name="mode">
        <select-trigger class="w-fit min-w-24 sm:order-2 sm:w-full">
          <select-value placeholder="Search by" class="font-medium" />
        </select-trigger>
        <select-content class="min-w-20">
          <select-group>
            <!-- <SelectLabel>Countries</SelectLabel> -->
            <select-item value="name">
              {{ $t("searchBar.name") }}
            </select-item>
            <select-item value="genres">
              {{ $t("searchBar.genre", 1) }}
            </select-item>
          </select-group>
        </select-content>
      </select-main>
      <!-- Search Input -->
      <div class="relative w-full">
        <x-input
          ref="searchInput"
          v-model.trim="searchValue"
          name="searchInput"
          type="text"
          :placeholder="
            currentTab === 'name'
              ? $t('searchBar.placeholder', 1)
              : $t('searchBar.placeholder', 2)
          "
          class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
        />
        <x-icon
          :icon="Search"
          :size="32"
          :stroke-width="1.5"
          class="absolute inset-y-0 flex items-center justify-center pl-2 pr-0 text-tc-4"
          @click="searchInputFocus"
        />
        <x-button
          variant="ghost"
          class="absolute inset-y-0 -end-0.5 min-w-12 max-w-12 p-2.5"
          @click.prevent="clearSearch"
        >
          <x-icon :icon="X" :size="22" :stroke-width="1.5" class="text-tc-4" />
        </x-button>
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm sm:flex-col">
      <div class="flex gap-2">
        <!-- Quality -->
        <x-button
          class="flex w-24 justify-start p-0"
          variant="ghost"
          @click="() => hqOnly(!filters.highQualityOnly)"
        >
          <div
            class="flex w-full flex-col items-center justify-center text-wrap text-sm font-semibold leading-none text-tc-3"
          >
            HQ <span class="text-xs font-semibold">only</span>
          </div>
          <x-switch :checked="filters.highQualityOnly" />
        </x-button>

        <!-- Star/Likes filter -->
        <div class="flex items-center gap-2 text-tc-1">
          <x-button
            v-tooltip="$t('stationCard.clickCount')"
            :variant="'ghost'"
            class="size-8 min-w-5 p-0 px-1 *:text-tc-3"
            :class="filters.order !== 'votes' ? 'bg-mc-2 *:text-mc-1' : ''"
            @click="changeOrder('clickcount')"
          >
            <x-icon :icon="Star" :size="21" :stroke-width="2" />
          </x-button>
          <x-button
            v-tooltip="$t('stationCard.votes')"
            :variant="'ghost'"
            class="size-8 min-w-8 p-0 px-1 *:text-tc-3"
            :class="filters.order === 'votes' ? 'bg-mc-2 *:text-mc-1' : ''"
            @click="changeOrder('votes')"
          >
            <x-icon :icon="ThumbsUp" :size="21" :stroke-width="2" />
          </x-button>
        </div>

        <!-- Reverse order -->
        <div class="flex items-center gap-2 text-tc-1">
          <x-button
            v-tooltip="$t('searchBar.descendingOrder')"
            :variant="'ghost'"
            class="size-8 min-w-5 p-0 px-1 *:text-tc-3"
            :class="filters.reverse ? 'bg-mc-2 *:text-mc-1' : ''"
            @click="reverseSearch(true)"
          >
            <x-icon :icon="ArrowDownWideNarrow" :size="21" :stroke-width="2" />
          </x-button>
          <x-button
            v-tooltip="$t('searchBar.ascendingOrder')"
            :variant="'ghost'"
            class="size-8 min-w-8 p-0 px-1 *:text-tc-3"
            :class="!filters.reverse ? 'bg-mc-2 *:text-mc-1' : ''"
            @click="reverseSearch(false)"
          >
            <x-icon :icon="ArrowDownNarrowWide" :size="21" :stroke-width="2" />
          </x-button>
        </div>
      </div>
      <choose-country
        :country-code="filters.countryCode || undefined"
        class="pr-2.5 sm:order-first"
        @change-country-code="(e) => changeCountryCode(e)"
      />
    </div>
  </div>
</template>
