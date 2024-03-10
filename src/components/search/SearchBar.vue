<script setup lang="ts">
import XIcon from "../ui/icon/Icon.vue";
import { ref, watch } from "vue";
import ChooseCountry from "@/components/search/ChooseCountry.vue";
import XSwitch from "@/components/ui/switch/Switch.vue";
import xButton from "@/components/ui/button/Button.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@vueuse/core";
import {
  Search,
  BookAudio,
  X,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
} from "lucide-vue-next";
import XInput from "@/components/ui/input/Input.vue";
import { genresList } from "@/lib/static/genresList";
import { useUserStore } from "@/stores/userStore";
import { cn } from "@/lib/utils/twMerge";

const props = defineProps<{
  downloadProgress?: number | null | undefined;
  defaultFilters?: SearchFilters;
}>();
const emits = defineEmits<{
  (e: "currentTab", payload: string): void;
  (e: "filters", payload: SearchFilters): void;
}>();

const userStore = useUserStore();
const searchInput = ref<string>();
const debSearch = useDebounce(searchInput, 500);
const currentTab = ref<string>("name");
const filters = ref<SearchFilters>({ ...props.defaultFilters } || {});
const genresIsOpen = ref(false);

const hqOnly = (payload: boolean) => {
  filters.value.highQualityOnly = payload;
};

const reverseSearch = (payload: boolean) => {
  filters.value.reverse = payload;
};

const changeCountryCode = (payload: CountryCodes | "all") => {
  if (payload === "all") {
    filters.value.countryCode = undefined;
  } else {
    filters.value.countryCode = payload;
  }
};

const updateCurrentTab = (payload: string) => {
  currentTab.value = payload;
};

watch(
  [currentTab],
  () => {
    emits("currentTab", currentTab.value);
  },
  {
    immediate: true,
  },
);

watch(
  [filters],
  () => {
    // console.log('searchbar');
    emits("filters", filters.value);
  },
  {
    deep: true,
  },
);

watch([debSearch, currentTab], () => {
  if (currentTab.value === "name") {
    filters.value = { ...filters.value, name: debSearch.value, tag: "" };
  } else if (currentTab.value === "genres") {
    const newName = "";
    const newTags = debSearch.value;
    filters.value = { ...filters.value, name: newName, tag: newTags };
  }
});
</script>

<template>
  <Tabs
    v-on:update:model-value="updateCurrentTab"
    default-value="name"
    class="flex w-full flex-col gap-2"
  >
    <tabs-list class="relative gap-2 transition-none *:transition-none">
      <tabs-trigger value="name">
        {{ $t("searchBar.name") }}
      </tabs-trigger>
      <tabs-trigger value="genres">
        {{ $tc("searchBar.genre", 1) }}
      </tabs-trigger>
      <tabs-trigger value="history">
        {{ $t("searchBar.history") }}
      </tabs-trigger>
    </tabs-list>
    <tabs-content value="name" class="mt-0">
      <div class="relative w-full items-center">
        <x-input
          name="searchInput"
          type="text"
          v-model.trim="searchInput"
          :placeholder="$tc('searchBar.placeholder', 1)"
          class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
        />
        <x-icon
          :icon="Search"
          :size="34"
          :stroke-width="1.5"
          class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
        />
        <x-icon
          @click="() => (searchInput = '')"
          :icon="X"
          :size="32"
          :stroke-width="1.5"
          class="absolute inset-y-0 end-1.5 flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
        />
      </div>
    </tabs-content>
    <tabs-content value="genres" class="mt-0">
      <collapsible v-model:open="genresIsOpen">
        <div class="relative flex w-full items-center gap-2">
          <x-input
            name="searchInput"
            type="text"
            v-model.trim="searchInput"
            :placeholder="$tc('searchBar.placeholder', 2)"
            class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
          />
          <x-icon
            :icon="Search"
            :size="34"
            :stroke-width="1.5"
            class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
          />
          <x-icon
            @click="() => (searchInput = '')"
            :icon="X"
            :size="32"
            :stroke-width="1.5"
            class="absolute inset-y-0 end-[4.1rem] flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
          />
          <collapsible-trigger
            class="flex h-8 w-14 items-center justify-center rounded-full bg-mc-3 p-1 text-tc-4 transition hover:bg-hc-3"
          >
            <span>
              <!-- {{ $tc("searchBar.genre", 2) }} -->
              <x-icon :icon="BookAudio" />
            </span>
          </collapsible-trigger>
        </div>
        <collapsible-content class="mt-2 h-fit text-base text-tc-4">
          <div
            class="grid grid-cols-7 gap-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3"
          >
            <button
              v-for="genre in genresList"
              @click="
                () => {
                  genresIsOpen = false;
                  searchInput = genre.name;
                }
              "
              class="aspect-square rounded bg-mc-3"
            >
              {{ $t(`genres.${genre.name}`) }}
            </button>
          </div>
        </collapsible-content>
      </collapsible>
    </tabs-content>
    <div
      v-show="currentTab !== 'history'"
      class="flex items-center gap-2 text-sm xs:flex-col"
    >
      <div class="flex gap-2">
        <div class="flex items-center gap-2 text-nowrap text-tc-1">
          <x-switch
            :checked="filters.highQualityOnly"
            @update:checked="hqOnly"
          />
          HQ Only
        </div>
        <!-- <div class="border-r border-mc-3 w-1 h-full mr-1"/> -->
        <!-- <div class="flex text-nowrap gap-2 items-center text-tc-1">
        <x-switch :checked="!filters.reverse" @update:checked="reverseSearch" />
        Reverse
      </div> -->
        <!-- <div class="border-r border-mc-3 w-1 h-full"/> -->
        <div class="flex items-center gap-2 text-tc-1">
          <x-button
            @click="reverseSearch(true)"
            :disabled="filters.reverse"
            :variant="'ghost'"
            class="size-8 min-w-5 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
          >
            <x-icon :icon="ArrowDownWideNarrow" :size="21" :stroke-width="2" />
          </x-button>
          <x-button
            @click="reverseSearch(false)"
            :disabled="!filters.reverse"
            :variant="'ghost'"
            class="size-8 min-w-8 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
          >
            <x-icon :icon="ArrowDownNarrowWide" :size="21" :stroke-width="2" />
          </x-button>
        </div>
      </div>
      <choose-country
        :user-locale="userStore.locale"
        :country-code="filters.countryCode || undefined"
        @change-country-code="(e) => changeCountryCode(e)"
      />
    </div>
  </Tabs>
</template>
