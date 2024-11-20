<script setup lang="ts">
import { ref } from "vue";
import { Settings } from "lucide-vue-next";

import { useUserStore } from "@/entities/user";
import { getLSData, setLSData } from "@/shared/api";
import { themes } from "@/shared/lib/static/themes";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogMain,
  DialogTitle,
  DialogTrigger,
  XButton,
  XIcon,
} from "@/shared/ui";

const ls = getLSData();

const currentTheme = ref<Theme>(ls?.userSettings?.colorTheme ?? "default");
if (ls?.userSettings?.colorTheme) {
  document.documentElement.className =
    themes.classes[ls.userSettings.colorTheme] || "";
}

const { changeLocale, changeBorders, changePlayerVisualMode } = useUserStore();
const { borders, playerVisualMode } = useUserStore();

const changeThemeHandler = (theme: Theme) => {
  currentTheme.value = theme;
  document.documentElement.className = themes.classes[theme] || "";
  setLSData({ userSettings: { colorTheme: theme } });
};
</script>

<template>
  <dialog-main>
    <dialog-trigger as-child>
      <x-button
        class="h-full min-w-full bg-mc-1 bg-none p-1 hover:bg-hc-1 focus-visible:ring-offset-0"
      >
        <x-icon
          :icon="Settings"
          :size="27"
          :stroke-width="2"
          class="text-tc-1"
        />
      </x-button>
    </dialog-trigger>
    <dialog-content class="w-full bg-mc-2 p-1 transition-none sm:max-w-[425px]">
      <div
        class="grid h-fit max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] rounded bg-mc-1 sm:max-w-[425px]"
      >
        <dialog-header class="border-b border-mc-2 p-2 px-10 xs:p-1 xs:px-6">
          <dialog-title class="text-2xl text-mc-2">
            {{ $t("settingsBar.title") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <div class="grid gap-2 overflow-y-auto px-10 py-2 xs:px-6">
          <div class="flex flex-col gap-1">
            <h3 class="text-center text-base text-tc-1">
              {{ $t("settingsBar.theme") }}
            </h3>
            <x-button
              v-for:="theme in themes.list"
              variant="reversed"
              :disabled="currentTheme === theme.value"
              class="capitalize"
              @click="changeThemeHandler(theme.value)"
            >
              {{ theme.name }}
            </x-button>
            <h3 class="text-center text-base text-tc-1">
              {{ $t("settingsBar.lang") }}
            </h3>
            <div class="flex gap-2 *:w-full">
              <x-button
                variant="reversed"
                :disabled="$i18n.locale === 'en'"
                @click="($i18n.locale = 'en'), changeLocale('en')"
              >
                English
              </x-button>
              <x-button
                variant="reversed"
                :disabled="$i18n.locale === 'ru'"
                @click="($i18n.locale = 'ru'), changeLocale('ru')"
              >
                Русский
              </x-button>
            </div>
            <h3 class="text-center text-base text-tc-1">
              {{ $t("settingsBar.appearance.title") }}
            </h3>
            <div class="flex gap-2 *:w-full">
              <x-button
                variant="reversed"
                :disabled="borders === 'rounded'"
                @click="changeBorders('rounded')"
              >
                {{ $t("settingsBar.appearance.round") }}
              </x-button>
              <x-button
                variant="reversed"
                :disabled="borders === 'square'"
                @click="changeBorders('square')"
              >
                {{ $t("settingsBar.appearance.square") }}
              </x-button>
            </div>
            <h3 class="text-center text-base text-tc-1">
              {{ $t("settingsBar.playerVisual.title") }}
            </h3>
            <div class="flex gap-2 *:w-full">
              <x-button
                variant="reversed"
                :disabled="playerVisualMode === '1'"
                @click="changePlayerVisualMode('1')"
              >
                {{ $t("settingsBar.playerVisual.wave") }}
              </x-button>
              <x-button
                variant="reversed"
                :disabled="playerVisualMode === '2'"
                @click="changePlayerVisualMode('2')"
              >
                {{ $t("settingsBar.playerVisual.columns") }}
              </x-button>
            </div>
          </div>
        </div>
        <dialog-footer class="p-6 pt-0" />
      </div>
    </dialog-content>
  </dialog-main>
</template>
