<script setup lang="ts">
import {
  SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { computed } from "vue";
import XIcon from "@/shared/ui/icon/XIcon.vue";
import DeleteAlert from "@/shared/ui/deleteAlert/DeleteAlert.vue";
import AddFolder from "./AddFolder.vue";
import RenameFolder from "./RenameFolder.vue";
import { Folder, Delete } from "lucide-vue-next";
import { useUserStore } from "@/entities/user";
import { useFavoriteStore } from "@/entities/favorites";

const { deleteFolder, currentFolderId, changePageHandler } = useFavoriteStore();
const { favoriteStations } = useUserStore();
const allFoldersId = computed(() => Object.keys(favoriteStations.value));
</script>

<template>
  <div class="flex w-full justify-between px-2">
    <div class="flex w-full items-center gap-2">
      <div class="w-72">
        <select-main
          v-model="currentFolderId"
          name="folders"
          @update:model-value="() => changePageHandler(1)"
        >
          <select-trigger>
            <div class="flex items-center justify-center gap-2">
              <x-icon
                :icon="Folder"
                class="text-mc-1"
                :size="24"
                :stroke-width="1.5"
              />
              <select-value placeholder="Folders" class="font-medium" />
            </div>
          </select-trigger>
          <select-content>
            <select-group class="text-tc-4">
              <!-- <SelectLabel>Countries</SelectLabel> -->
              <div
                v-for="key in allFoldersId"
                :key="key"
                class="relative flex gap-2"
              >
                <select-item :value="key">
                  {{
                    `(${favoriteStations[key].stations.length}) ${key !== "default" ? favoriteStations[key].name : $t("favoriteBar.defaultFolder")}`
                  }}
                </select-item>
                <div class="absolute right-0 top-0 flex h-full w-fit">
                  <rename-folder
                    v-if="key !== 'default'"
                    :folder-name="favoriteStations[key].name"
                    :folder-id="key"
                  />
                  <delete-alert
                    v-if="key !== 'default'"
                    :title="
                      $t('favoriteBar.deleteFolder', [
                        favoriteStations[key].name,
                      ])
                    "
                    class="group flex w-10 items-center justify-center rounded"
                    @delete="$event && deleteFolder(key)"
                  >
                    <template #default>
                      <x-icon
                        :icon="Delete"
                        class="text-mc-1 transition-all group-hover:text-red-500"
                        :size="18"
                        :stroke-width="2"
                      />
                    </template>
                  </delete-alert>
                </div>
              </div>
            </select-group>
          </select-content>
        </select-main>
      </div>
      <add-folder />
    </div>
  </div>
</template>
