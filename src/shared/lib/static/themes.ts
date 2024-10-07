type Themes = {
  classes: ThemeClasses;
  list: ThemeObj[];
};

export const themes: Themes = {
  classes: {
    default: "default",
    defaultDark: "default-dark",
    pastelLight: "pastel-light",
    darkContrast: "dark-contrast",
  },
  list: [
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
  ],
};
