<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { computed, ref, watch, watchEffect } from "vue";
import XButton from "@/components/ui/button/Button.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import XInput from "@/components/ui/input/Input.vue";
import DeleteAlert from "./DeleteAlert.vue";
import AddFolder from "./AddFolder.vue";
import RenameFolder from "./RenameFolder.vue";
import { Folder, Plus, Check, FolderPen, X, FolderPlus } from "lucide-vue-next";

const props = defineProps<{
  currentFolder: string;
  favoriteStations: FavoriteStations;
}>();

const newFolderIsOpen = ref(false);
const folderNameInput = ref<string>();
const selected = ref<string>(props.currentFolder);

watch([() => props.currentFolder], () => {
  selected.value = props.currentFolder;
});

const emits = defineEmits<{
  (e: "changeCurrentFolder", value: string): void;
  (e: "createNewFolder", value: string): void;
  (e: "deleteFolderById", value: string): void;
  (e: "renameFolder", value: { folderID: string; name: string }): void;
}>();

const keys = computed(() => Object.keys(props.favoriteStations));

const newFolderOpen = () => {
  if (newFolderIsOpen.value) {
    folderNameInput.value = undefined;
  }
  newFolderIsOpen.value = !newFolderIsOpen.value;
};

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

watchEffect(() => {
  emits("changeCurrentFolder", selected.value);
});
</script>

<template>
  <Collapsible :open="newFolderIsOpen" class="w-full px-2">
    <div class="flex items-center gap-2">
      <div class="w-72">
        <Select v-model="selected" name="folders">
          <SelectTrigger class="text-tc-4">
            <div class="flex items-center justify-center gap-2">
              <x-icon
                :icon="Folder"
                class="text-tc-4"
                :size="24"
                :stroke-width="1.5"
              />
              <SelectValue placeholder="Folders" class="font-medium" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup class="text-tc-4">
              <!-- <SelectLabel>Countries</SelectLabel> -->
              <div v-for="key in keys" :key="key" class="flex gap-2">
                <SelectItem :value="key">
                  {{
                    `(${favoriteStations[key].stations.length}) ${favoriteStations[key].name}`
                  }}
                </SelectItem>
                <!-- <x-button @click="deleteFolder(key)" class="text-tc-4 min-w-10 p-0 bg-mc-none hover:bg-hc-3">
                  <x-icon :icon="Delete" class="text-tc-4" :size="18" :stroke-width="2" />
                </x-button> -->
                <rename-folder
                  v-if="key !== 'default'"
                  :folder-name="favoriteStations[key].name"
                  @rename-folder="renameFolderHandler(key, $event)"
                />
                <delete-alert
                  v-if="key !== 'default'"
                  :folder-name="favoriteStations[key].name"
                  @delete="deleteFolder($event, key)"
                />
              </div>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <!-- <CollapsibleTrigger>
      <x-icon :icon="Plus" class="text-tc-4" :size="20" :stroke-width="1.8" />
    </CollapsibleTrigger> -->
      <add-folder @add-folder="addNewFolder($event)" />
    </div>
  </Collapsible>
</template>

<style scoped></style>
./AddFolder.vue
