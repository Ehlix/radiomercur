<script setup lang="ts">
import XButton from "@/components/ui/button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import XInput from "@/components/ui/input/Input.vue";
import XIcon from "@/components/ui/icon/Icon.vue";
import { Milestone } from "lucide-vue-next";
import DialogClose from "../ui/dialog/DialogClose.vue";
import { ref, watchEffect } from "vue";

const props = defineProps<{
  currentPage: number;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "changePage", value: number): void;
}>();

const inputValue = ref<number>(props.currentPage);

const saveHandler = () => {
  emits("changePage", inputValue.value);
};

watchEffect(() => {
  inputValue.value = props.currentPage;
});
</script>

<template>
  <Dialog>
    <DialogTrigger
      :disabled="props.disabled ?? false"
      class="group flex w-fit items-center justify-center rounded"
    >
      <x-button
        :disabled="props.disabled ?? false"
        @click="inputValue = props.currentPage"
        class="flex h-8 w-5 min-w-8 justify-center gap-1 bg-mc-1 px-2 hover:bg-mc-1 hover:text-mc-2 xs:min-w-5"
      >
        {{ inputValue }}
      </x-button>
    </DialogTrigger>
    <DialogContent class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <form
        @click.prevent="saveHandler"
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <DialogHeader class="border-b border-mc-2 px-2 pt-2">
          <DialogTitle class="text-2xl text-mc-2">
            {{ $t("favoriteBar.changePage") }}
          </DialogTitle>
          <DialogDescription>
            <div class="flex gap-2 py-2">
              <div class="relative w-full">
                <x-input
                  name="searchInput"
                  type="number"
                  maxlength="25"
                  v-model.trim="inputValue"
                  :placeholder="$t('favoriteBar.enterPage')"
                  class="border-0 px-10 text-tc-4 focus-visible:text-tc-4"
                />
                <x-icon
                  :icon="Milestone"
                  :size="30"
                  :stroke-width="1.5"
                  class="absolute inset-y-[0.15rem] start-[0.29rem] flex items-center justify-center px-1 text-tc-4"
                />
                <!-- <x-icon
                  @click="() => (inputValue = '')"
                  :icon="X"
                  :size="32"
                  :stroke-width="1.5"
                  class="absolute inset-y-0 end-1 flex cursor-pointer items-center justify-center px-1 text-tc-4 transition-all hover:opacity-60"
                /> -->
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="flex flex-row gap-2 p-2">
          <DialogClose
            class="border border-mc-2 bg-white/0 text-mc-2 hover:border-hc-2 hover:bg-white/0 hover:text-hc-2"
          >
            {{ $t("buttons.cancel") }}
          </DialogClose>
          <DialogClose type="submit">
            {{ $t("buttons.save") }}
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
