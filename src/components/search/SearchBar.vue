<script setup lang="ts">
import XIcon from "../ui/icon/Icon.vue";
import { ref } from "vue";
import ChooseCountry from "@/components/search/ChooseCountry.vue";
import XSwitch from "@/components/ui/switch/Switch.vue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchStations } from "@/stores/searchStations";
import { useUserStations } from "@/stores/userStations";
import { Search } from "lucide-vue-next";
import XInput from "@/components/ui/input/Input.vue";
import { genresList } from "@/lib/static/genresList";
import XProgress from "@/components/ui/progress/Progress.vue";

const searchStore = useSearchStations();
const userStationsStore = useUserStations();
const isOpen = ref(true);
</script>

<template>
  <Tabs default-value="name" class="w-full">
    <TabsList class="gap-2">
      <TabsTrigger value="name"> Name </TabsTrigger>
      <TabsTrigger value="genres" @click="isOpen = true"> Genres </TabsTrigger>
    </TabsList>
    <x-progress :model-value="searchStore.downloadProgress" class="w-full" />
    <TabsContent value="name" class="mt-1">
      <div class="relative w-full items-center">
        <x-input
          name="searchInput"
          type="text"
          v-model="searchStore.searchInput"
          placeholder="Search"
          class="pl-10 text-tc-4 border-0 focus-visible:text-tc-4"
        />
        <x-icon
          :icon="Search"
          :size="34"
          :stroke-width="1.5"
          class="absolute inset-y-0 start-[0.15rem] flex items-center justify-center px-1 text-tc-4"
        />
      </div>
    </TabsContent>
    <TabsContent value="genres" class="mt-1">
      <Collapsible v-model:open="isOpen">
        <!-- <CollapsibleTrigger
          class="flex h-8 w-full items-center justify-center p-1 "
        >
          <span> Genres </span>
        </CollapsibleTrigger> -->
        <CollapsibleContent class="h-fit text-tc-1">
          <div
            class="grid grid-cols-7 gap-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3"
          >
            <button
              v-for="genre in genresList"
              @click="
                () => {
                  isOpen = false;
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
  </Tabs>
  <div class="flex gap-2">
        <div class="flex items-center gap-1 text-sm">
          <x-switch />
          <p class="text-nowrap text-tc-1">HQ Only</p>
        </div>
        <choose-country />
      </div>
</template>
