import { Disc3, ListMusic, Search } from "lucide-vue-next";

type NavList = {
  title: string;
  link: string;
  icon: typeof Search;
};

export const navList: NavList[] = [
  {
    title: "genres",
    link: "/genres",
    icon: Disc3,
  },
  {
    title: "my stations",
    link: "/my-stations",
    icon: ListMusic,
  },
  {
    title: "find stations",
    link: "/search",
    icon: Search,
  },
];
