<script setup lang="ts">
import { ref, watch } from "vue";
import ChooseCountry from "@/components/search/ChooseCountry.vue";
import XIcon from "../ui/icon/XIcon.vue";
import XInput from "@/components/ui/input/XInput.vue";
import XSwitch from "@/components/ui/switch/XSwitch.vue";
import xButton from "@/components/ui/button/XButton.vue";
import XTooltip from "@/components/ui/tooltip/XTooltip.vue";
import ChooseInputMode from "@/components/search/ChooseInputMode.vue";
import { useDebounce } from "@vueuse/core";
import {
  Search,
  X,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide,
  Star,
  ThumbsUp,
} from "lucide-vue-next";
import { useUserStore } from "@/stores/userStore";

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
// const genresIsOpen = ref(false);

const hqOnly = (payload: boolean) => {
  filters.value.highQualityOnly = payload;
};

const reverseSearch = (payload: boolean) => {
  filters.value.reverse = payload;
};

const changeOrder = (order: ParamsOrder) => {
  filters.value.order = order;
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
  <div class="flex w-full flex-col gap-2">
    <!-- <collapsible v-model:open="genresIsOpen">
        <div class="relative flex w-full items-center gap-2">
          <collapsible-trigger
            class="flex h-8 w-14 items-center justify-center rounded-full bg-mc-3 p-1 text-tc-4 transition hover:bg-hc-3"
          >
            <span>
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
      </collapsible> -->
    <div class="flex w-full items-center gap-2 sm:flex-col">
      <choose-input-mode
        class="w-fit min-w-24 sm:order-2 sm:w-full"
        @current-select="updateCurrentTab($event)"
      />
      <div class="relative w-full">
        <x-input
          v-model.trim="searchInput"
          name="searchInput"
          type="text"
          :placeholder="
            currentTab === 'name'
              ? $tc('searchBar.placeholder', 1)
              : $tc('searchBar.placeholder', 2)
          "
          class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
        />
        <x-icon
          :icon="Search"
          :size="34"
          :stroke-width="1.5"
          class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
        />
        <x-icon
          :icon="X"
          :size="32"
          :stroke-width="1.5"
          class="absolute inset-y-0 end-1 flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
          @click="() => (searchInput = '')"
        />
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm sm:flex-col">
      <div class="flex gap-2">
        <!-- Quality -->
        <div
          class="flex items-center gap-2 whitespace-nowrap text-nowrap font-medium text-tc-1 xs:whitespace-normal"
        >
          <x-switch
            :checked="filters.highQualityOnly"
            @update:checked="hqOnly"
          />
          HQ Only
        </div>

        <!-- Star/Likes filter -->
        <div class="flex items-center gap-2 text-tc-1">
          <x-tooltip>
            <template #trigger>
              <x-button
                :disabled="filters.order !== 'votes'"
                :variant="'ghost'"
                class="size-8 min-w-5 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
                @click="changeOrder('clickcount')"
              >
                <x-icon
                  :icon="Star"
                  :size="21"
                  :stroke-width="2"
                />
              </x-button>
            </template>
            <template #content>
              {{ $t("stationCard.clickCount") }}
            </template>
          </x-tooltip>
          <x-tooltip>
            <template #trigger>
              <x-button
                :disabled="filters.order === 'votes'"
                :variant="'ghost'"
                class="size-8 min-w-8 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
                @click="changeOrder('votes')"
              >
                <x-icon
                  :icon="ThumbsUp"
                  :size="21"
                  :stroke-width="2"
                />
              </x-button>
            </template>
            <template #content>
              {{ $t("stationCard.votes") }}
            </template>
          </x-tooltip>
        </div>

        <!-- Reverse order -->
        <div class="flex items-center gap-2 text-tc-1">
          <x-tooltip>
            <template #trigger>
              <x-button
                :disabled="filters.reverse"
                :variant="'ghost'"
                class="size-8 min-w-5 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
                @click="reverseSearch(true)"
              >
                <x-icon
                  :icon="ArrowDownWideNarrow"
                  :size="21"
                  :stroke-width="2"
                />
              </x-button>
            </template>
            <template #content>
              {{ $t("searchBar.descendingOrder") }}
            </template>
          </x-tooltip>

          <x-tooltip>
            <template #trigger>
              <x-button
                :disabled="!filters.reverse"
                :variant="'ghost'"
                class="size-8 min-w-8 p-0 px-1 *:text-tc-3 disabled:bg-mc-3 disabled:opacity-100 *:disabled:text-mc-1"
                @click="reverseSearch(false)"
              >
                <x-icon
                  :icon="ArrowDownNarrowWide"
                  :size="21"
                  :stroke-width="2"
                />
              </x-button>
            </template>
            <template #content>
              {{ $t("searchBar.ascendingOrder") }}
            </template>
          </x-tooltip>
        </div>
      </div>
      <choose-country
        :user-locale="userStore.locale"
        :country-code="filters.countryCode || undefined"
        class="sm:order-first"
        @change-country-code="(e) => changeCountryCode(e)"
      />
    </div>
  </div>
</template>
