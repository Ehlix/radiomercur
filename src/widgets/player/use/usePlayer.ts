import { nextTick, type Ref, ref } from "vue";


export const usePlayer = (
  player: Ref<HTMLAudioElement | null>,
  streamLink: Ref<string | undefined>,
  maxVolume?: number,
) => {
  const isPaused = ref<boolean>(true);
  const isLoading = ref<boolean>(false);
  const loadingError = ref<boolean>(false);
  const volume = ref([100]);
  const muteCache = ref([100]);
  const MAX_VOLUME = maxVolume || 100;
  const MIN_VOLUME = 0;

  const pauseCheck = () => {
    if (!player.value) {
      return;
    }
    isPaused.value = player.value.paused;
  };

  const togglePlay = (newStreamLink?: string) => {
    if (!player.value || !newStreamLink || isLoading.value) {
      return;
    }
    if (player.value.paused) {
      streamLink.value = undefined;
      nextTick(() => {
        streamLink.value = newStreamLink;
        isLoading.value = true;
        loadingError.value = false;
      });
    } else {
      player.value.pause();
      streamLink.value = undefined;
    }
    pauseCheck();
  };

  const play = (newStreamLink: string) => {
    player.value?.pause();
    isLoading.value = false;
    loadingError.value = false;
    togglePlay(newStreamLink);
  };

  const autoPlay = () => {
    if (!player.value || !streamLink.value) {
      return;
    }
    player.value.play();
    isLoading.value = false;
    pauseCheck();
  };

  const errorHandler = () => {
    if (!player.value) {
      return;
    }
    isLoading.value = false;
    loadingError.value = true;
  };

  const wheelHandler = (event: WheelEvent) => {
    if (event.deltaY < 0) {
      volume.value = [Math.min(volume.value[0] + 2, MAX_VOLUME)];
    }
    if (event.deltaY > 0) {
      volume.value = [Math.max(volume.value[0] - 2, MIN_VOLUME)];
    }
  };

  const muteToggle = () => {
    if (volume.value[0] === 0) {
      volume.value = muteCache.value || [100];
    } else {
      muteCache.value = volume.value;
      volume.value = [0];
    }
  };

  return {
    isLoading,
    isPaused,
    loadingError,
    volume,
    muteToggle,
    play,
    wheelHandler,
    togglePlay,
    errorHandler,
    autoPlay,
  };
};
