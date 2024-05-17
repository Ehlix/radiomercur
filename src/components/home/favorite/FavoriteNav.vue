<script setup lang="ts">
import {
  SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { computed } from "vue";
import XIcon from "@/components/ui/icon/XIcon.vue";
import DeleteAlert from "../DeleteAlert.vue";
import AddFolder from "./AddFolder.vue";
import RenameFolder from "./RenameFolder.vue";
import { Folder, Delete } from "lucide-vue-next";

const props = defineProps<{
  favoriteStations: FavoriteStations;
}>();

const model = defineModel<string>();

const emits = defineEmits<{
  (e: "createNewFolder", name: string): void;
  (e: "deleteFolderById", FolderId: string): void;
  (e: "renameFolder", folderData: { folderID: string; name: string }): void;
}>();

const keys = computed(() => Object.keys(props.favoriteStations));

const addNewFolder = (name: string) => {
  if (!name) {
    return;
  }
  emits("createNewFolder", name);
};

const deleteFolder = (status: boolean, folderID: string) => {
  if (status) {
    emits("deleteFolderById", folderID);
  }
};

const renameFolderHandler = (folderID: string, name: string) => {
  if (!name || !folderID) {
    return;
  }
  emits("renameFolder", { folderID: folderID, name: name });
};
</script>

<template>
  <div class="flex w-full justify-between px-2">
    <div class="flex w-full items-center gap-2">
      <div class="w-72">
        <select-main
          v-model="model"
          name="folders"
        >
          <select-trigger>
            <div class="flex items-center justify-center gap-2">
              <x-icon
                :icon="Folder"
                class="text-mc-1"
                :size="24"
                :stroke-width="1.5"
              />
              <select-value
                placeholder="Folders"
                class="font-medium"
              />
            </div>
          </select-trigger>
          <select-content>
            <select-group class="text-tc-4">
              <!-- <SelectLabel>Countries</SelectLabel> -->
              <div
                v-for="key in keys"
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
                    @rename-folder="renameFolderHandler(key, $event)"
                  />
                  <delete-alert
                    v-if="key !== 'default'"
                    :title="
                      $t('favoriteBar.deleteFolder', [
                        favoriteStations[key].name,
                      ])
                    "
                    class="group flex w-10 items-center justify-center rounded"
                    @delete="deleteFolder($event, key)"
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
      <add-folder @add-folder="addNewFolder($event)" />
    </div>
  </div>
</template>
