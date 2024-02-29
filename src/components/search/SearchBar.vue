<script setup lang="ts">
import XIcon from "../ui/icon/Icon.vue";
import { ref, watch } from "vue";
import ChooseCountry from "@/components/search/ChooseCountry.vue";
import XSwitch from "@/components/ui/switch/Switch.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@vueuse/core";
import { Search } from "lucide-vue-next";
import XInput from "@/components/ui/input/Input.vue";
import { genresList } from "@/lib/static/genresList";

const props = defineProps<{
  downloadProgress?: number | null | undefined;
}>();
const emits = defineEmits<{
  (e: "currentTab", payload: string): void;
  (e: "filters", payload: SearchFilters): void;
}>();

const searchInput = ref<string>();
const debSearch = useDebounce(searchInput, 500);
const currentTab = ref<string>("name");
const filters = ref<SearchFilters>({});
const genresIsOpen = ref(false);

const hqOnly = (payload: boolean) => {
  filters.value.highQualityOnly = payload;
};

const changeCountry = (payload: string) => {
  if (payload.toLowerCase() === "all") {
    filters.value.country = " ";
  } else {
    filters.value.country = payload;
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
    emits("filters", filters.value);
  },
  {
    immediate: true,
  },
);

watch([debSearch, currentTab], () => {
  if (currentTab.value === "name") {
    filters.value = {...filters.value, name: debSearch.value , tag: ''};
  } else if (currentTab.value === "genres") {
    const newName = '';
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
    <TabsList class="relative gap-2">
      <TabsTrigger value="name"> Name </TabsTrigger>
      <TabsTrigger value="genres"> Genres </TabsTrigger>
      <TabsTrigger value="history"> History </TabsTrigger>
    </TabsList>
    <TabsContent value="name" class="mt-0">
      <div class="relative w-full items-center">
        <x-input
          name="searchInput"
          type="text"
          v-model.trim="searchInput"
          placeholder="Search by name"
          class="border-0 pl-10 text-tc-4 focus-visible:text-tc-4"
        />
        <x-icon
          :icon="Search"
          :size="34"
          :stroke-width="1.5"
          class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
        />
      </div>
    </TabsContent>
    <TabsContent value="genres" class="mt-0">
      <Collapsible v-model:open="genresIsOpen">
        <div class="relative flex w-full items-center gap-2">
          <x-input
            name="searchInput"
            type="text"
            v-model.trim="searchInput"
            placeholder="Search by genres"
            class="border-0 pl-10 text-tc-4 focus-visible:text-tc-4"
          />
          <x-icon
            :icon="Search"
            :size="34"
            :stroke-width="1.5"
            class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
          />
          <CollapsibleTrigger
            class="flex h-8 w-20 items-center justify-center rounded-full bg-mc-4 p-1 transition hover:bg-hc-2 text-tc-4"
          >
            <span>Genres</span>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent class="mt-2 h-fit text-base text-tc-4">
          <div
            class="grid grid-cols-7 gap-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3"
          >
            <button
              v-for="genre in genresList"
              @click="
                () => {
                  genresIsOpen = false;
                  searchInput = genre.name
                }
              "
              class="aspect-square rounded bg-mc-4"
            >
              {{ genre.name }}
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TabsContent>
    <div
      v-show="currentTab !== 'history'"
      class="flex items-center gap-2 text-sm"
    >
      <x-switch @update:checked="hqOnly" />
      <p class="text-nowrap text-tc-1">HQ Only</p>
      <choose-country @change-country="(e) => changeCountry(e)" />
    </div>
  </Tabs>
</template>
