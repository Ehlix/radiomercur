<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Check } from "lucide-vue-next";
import xButton from "@/components/ui/button/XButton.vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { removeMetadata } from "@/common/utils/removeMetaDataFromName";
import { useUserStore } from "@/stores/userStore";

const props = defineProps<{
  station: Station;
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();

const { favoriteStations, addToFavorite, removeFromFavorite } = useUserStore();

const checkStationInFavorites = (station: Station, folderID: string) => {
  if (favoriteStations.value[folderID]) {
    return favoriteStations.value[folderID].stations.some(
      (s) => s.stationuuid === station.stationuuid,
    );
  }
};

const addToFavorites = (station: Station, folderId: string) => {
  addToFavorite({ station, folderId });
};
const removeFromFavorites = (station: Station, folderId: string) => {
  removeFromFavorite({ station, folderId });
};

const close = () => {
  emits("close");
};
</script>

<template>
  <dialog-main
    :open="props.open"
    @update:open="close"
  >
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="min-h-58 grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header
          class="truncate text-wrap border-b border-mc-2 bg-mc-1 p-2 px-10 xs:p-1 xs:px-6"
        >
          <dialog-title
            class="-my-1 truncate text-wrap px-3 text-center text-xl text-mc-2"
          >
            {{
              $t("stationCard.addToFavorites", [
                `"${removeMetadata(station.name || "Unknown station")}"`,
              ])
            }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <!-- Station Info -->
        <div
          class="relative z-10 grid gap-2 overflow-y-auto px-10 py-6 xs:px-6"
        >
          <div class="relative z-20 flex flex-col">
            <div
              v-for="key in Object.keys(favoriteStations)"
              :key="key"
              class="flex items-center gap-1"
            >
              <x-button
                v-if="checkStationInFavorites(station, key)"
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
                @click="removeFromFavorites(station, key)"
              >
                <x-icon
                  :icon="Check"
                  :size="20"
                  :stroke-width="2"
                />
                <p class="w-fit text-tc-1">
                  {{
                    `(${favoriteStations[key].stations.length}) ${key !== "default" ? favoriteStations[key].name : $t("favoriteBar.defaultFolder")}`
                  }}
                </p>
              </x-button>

              <x-button
                v-else
                variant="ghost"
                class="hover:text-c-1 h-8 w-full min-w-8 justify-start gap-2 p-0 px-2"
                @click="addToFavorites(station, key)"
              >
                <x-icon
                  :icon="Plus"
                  :size="20"
                  :stroke-width="2"
                />
                <p class="text-tc-1">
                  {{
                    `(${favoriteStations[key].stations.length}) ${key !== "default" ? favoriteStations[key].name : $t("favoriteBar.defaultFolder")}`
                  }}
                </p>
              </x-button>
            </div>
          </div>
        </div>
      </div>
    </dialog-content>
  </dialog-main>
</template>
