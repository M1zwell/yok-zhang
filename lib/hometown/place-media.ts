export type PlacePhoto = {
  id: "sidianjin" | "houses" | "citang" | "plain" | "college";
  src: string;
  author: string;
  license: string;
  href: string;
};

export const placePhotos: PlacePhoto[] = [
  {
    id: "sidianjin",
    src: "/hometown/puning-sidianjin.jpg",
    author: "张彬",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Puning,_Jieyang,_Guangdong,_China_-_panoramio_(121).jpg",
  },
  {
    id: "citang",
    src: "/hometown/chaoyang-citang.jpg",
    author: "Lai Chuen Siu",
    license: "CC BY-SA 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Taoist_ceremony_at_Xiao_ancestral_temple_in_Chaoyang,_Shantou,_Guangdong_(outside)_(2).jpg",
  },
  {
    id: "houses",
    src: "/hometown/puning-houses.jpg",
    author: "张彬",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Puning,_Jieyang,_Guangdong,_China_-_panoramio_(10).jpg",
  },
  {
    id: "plain",
    src: "/hometown/puning-plain.jpg",
    author: "张彬",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Puning,_Jieyang,_Guangdong,_China_-_panoramio_(159).jpg",
  },
  {
    id: "college",
    src: "/hometown/chaoshan-college.jpg",
    author: "Teo2.01",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Front_Gate_of_Chaoshan_College.JPG",
  },
];
