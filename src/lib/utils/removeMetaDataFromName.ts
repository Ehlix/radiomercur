export const removeMetadata = (text: string) => {
  return text.replace(/ *\([^)]*\) */g, "");
};
