<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import XButton from "@/components/ui/button/XButton.vue";
import { FolderSync, FileDown, FileUp } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { onUnmounted, ref } from "vue";
import { getLSData, setLSData } from "@/api/localStorage";
import { useDropZone } from "@vueuse/core";
import { cn } from "@/lib/utils/twMerge";

const dropZoneRef = ref<HTMLDivElement>();
const errorMessage = ref<boolean>(false);

const validateUploadData = (text: string) => {
  try {
    const data = JSON.parse(text);
    if (!data) {
      return;
    }
    const lsData: LocalStorageData = {
      favoritesStations: data.favoritesStations || [],
      historyStations: data.historyStations || [],
      searchFilters: {
        highQualityOnly: data.searchFilters?.highQualityOnly || false,
      },
      userSettings: {
        borders: data?.userSettings?.borders || "rounded",
        colorTheme: data?.userSettings?.colorTheme || "defaultLight",
        language: data?.userSettings?.language || "en",
      },
    };
    return lsData;
  } catch (error) {
    console.log("Upload error: ", (error as Error).message);
    errorMessage.value = true;
  }
};

const onDrop = (files: File[] | null) => {
  errorMessage.value = false;
  if (!files) {
    return;
  }
  const reader = new FileReader();
  reader.readAsText(files[0]);
  reader.onload = () => {
    const lsData = validateUploadData(reader.result as string);
    if (lsData) {
      setLSData(lsData);
      window.location.reload();
    }
    reader.abort();
  };
};

const downloadData = () => {
  const lsData = getLSData();
  if (!lsData) {
    return;
  }
  const blob = new Blob([JSON.stringify(lsData)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "radiomercur-data.txt";
  link.click();
  URL.revokeObjectURL(url);
  link.remove();
};

const uploadData = () => {
  errorMessage.value = false;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    const lsData = validateUploadData(text);
    if (!lsData) {
      return;
    }
    setLSData(lsData);
    window.location.reload();
  };
  input.click();
  input.remove();
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ["text/plain", "text/csv"],
});

onUnmounted(() => {
  errorMessage.value = false;
});
</script>

<template>
  <dialog-main>
    <dialog-trigger as-child>
      <x-button
        class="h-full min-w-full bg-none p-1"
        @click="errorMessage = false"
      >
        <x-icon
          :icon="FolderSync"
          :size="25"
          :stroke-width="2"
          class="text-tc-1"
        />
      </x-button>
    </dialog-trigger>
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header class="border-b border-mc-2 p-3 px-8 xs:px-4">
          <dialog-title class="text-2xl text-mc-2">
            {{ $tc("syncUserData.title") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <div class="grid gap-2 overflow-y-auto p-8 xs:p-4">
          <div class="grid grid-cols-2 gap-8 *:aspect-square *:gap-2 md:gap-4">
            <x-button
              variant="ghost"
              class="flex h-full w-full flex-col items-center justify-start whitespace-normal rounded border border-mc-2 p-4 pt-10 sm:py-10 xs:py-16"
              @click="downloadData"
            >
              <x-icon
                :icon="FileDown"
                :size="30"
                :stroke-width="1.5"
                class="text-mc-2"
              />
              <h3 class="text-wrap text-base text-mc-2">
                {{ $tc("syncUserData.downloadDescription") }}
              </h3>
            </x-button>

            <x-button
              ref="dropZoneRef"
              variant="ghost"
              :class="
                cn(
                  'relative h-full w-full flex-col items-center justify-start whitespace-normal rounded border border-dashed border-mc-2 p-4 pt-10 text-mc-2 sm:py-10 xs:py-16',
                  {
                    'bg-hc-1': isOverDropZone,
                  },
                )
              "
              @click="uploadData"
            >
              <x-icon
                :icon="FileUp"
                :size="30"
                :stroke-width="1.5"
                class="text-mc-2"
              />
              <h3 class="text-base text-mc-2">
                {{ $tc("syncUserData.uploadDescription") }}
              </h3>
              <p v-if="errorMessage" class="absolute bottom-2 text-red-500">
                {{ $t("syncUserData.errorMessage") }}
              </p>
            </x-button>
          </div>
        </div>
        <!-- <DialogFooter class="p-6 pt-0"></DialogFooter> -->
      </div>
    </dialog-content>
  </dialog-main>
</template>
