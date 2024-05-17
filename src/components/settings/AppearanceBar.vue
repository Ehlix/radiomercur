<script setup lang="ts">
import {
  DialogMain,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import XButton from "@/components/ui/button/XButton.vue";
import { Settings } from "lucide-vue-next";
import XIcon from "@/components/ui/icon/XIcon.vue";
import { ref } from "vue";
import { getLSData, setLSData } from "@/lib/api/localStorage";
import { useUserStore } from "@/stores/userStore";

const themeClasses: ThemeClasses = {
  default: "default",
  defaultDark: "default-dark",
  pastelLight: "pastel-light",
  darkContrast: "dark-contrast",
};

const themeList: ThemeObj[] = [
  {
    name: "default",
    value: "default",
  },
  {
    name: "default dark",
    value: "defaultDark",
  },
  {
    name: "pastel light",
    value: "pastelLight",
  },
  {
    name: "Hight contrast",
    value: "darkContrast",
  },
];
const ls = getLSData();

const currentTheme = ref<Theme>(ls?.userSettings?.colorTheme ?? "default");
if (ls?.userSettings?.colorTheme) {
  document.documentElement.className =
    themeClasses[ls.userSettings.colorTheme] || "";
}

const { changeLocale, changeBorders, changePlayerVisualMode } = useUserStore();
const { borders, playerVisualMode } = useUserStore();

const changeThemeHandler = (theme: Theme) => {
  currentTheme.value = theme;
  document.documentElement.className = themeClasses[theme] || "";
  setLSData({ userSettings: { colorTheme: theme } });
};
</script>

<template>
  <dialog-main>
    <dialog-trigger as-child>
      <x-button class="h-full min-w-full bg-none p-1">
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
            {{ $tc("settingsBar.title") }}
          </dialog-title>
          <dialog-description />
        </dialog-header>
        <div class="grid gap-2 overflow-y-auto px-10 py-2 xs:px-6">
          <div class="flex flex-col gap-1">
            <h3 class="text-center text-base text-tc-1">
              {{ $tc("settingsBar.theme") }}
            </h3>
            <x-button
              v-for:="theme in themeList"
              variant="reversed"
              :disabled="currentTheme === theme.value"
              class="capitalize"
              @click="changeThemeHandler(theme.value)"
            >
              {{ theme.name }}
            </x-button>
            <h3 class="text-center text-base text-tc-1">
              {{ $tc("settingsBar.lang") }}
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
              {{ $tc("settingsBar.appearance.title") }}
            </h3>
            <div class="flex gap-2 *:w-full">
              <x-button
                variant="reversed"
                :disabled="borders === 'rounded'"
                @click="changeBorders('rounded')"
              >
                {{ $tc("settingsBar.appearance.round") }}
              </x-button>
              <x-button
                variant="reversed"
                :disabled="borders === 'square'"
                @click="changeBorders('square')"
              >
                {{ $tc("settingsBar.appearance.square") }}
              </x-button>
            </div>
            <h3 class="text-center text-base text-tc-1">
              {{ $tc("settingsBar.playerVisual.title") }}
            </h3>
            <div class="flex gap-2 *:w-full">
              <x-button
                variant="reversed"
                :disabled="playerVisualMode === '1'"
                @click="changePlayerVisualMode('1')"
              >
                {{ $tc("settingsBar.playerVisual.wave") }}
              </x-button>
              <x-button
                variant="reversed"
                :disabled="playerVisualMode === '2'"
                @click="changePlayerVisualMode('2')"
              >
                {{ $tc("settingsBar.playerVisual.columns") }}
              </x-button>
            </div>
          </div>
        </div>
        <dialog-footer class="p-6 pt-0" />
      </div>
    </dialog-content>
  </dialog-main>
</template>
