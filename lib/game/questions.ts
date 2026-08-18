const ZH = [
  "我今天面试搞砸了，难受。",
  "今晚吃什么？但请不要说“看你心情”。",
  "帮我画一只戴墨镜的赛博猫。",
  "我失恋了，应该把共同歌单删掉吗？",
  "为什么我明明很累，还是不想睡？",
  "如果今天什么都没做，算不算浪费？",
];

const EN = [
  "Interview went badly. I feel rough.",
  "What should I eat tonight? Do not say it depends.",
  "Draw me a cyber cat in sunglasses.",
  "We broke up. Do I delete the shared playlist?",
  "Why am I exhausted and still not sleepy?",
  "If I did nothing today, did I waste it?",
];

export function randomQuestion(locale: string): string {
  const pool = locale.startsWith("zh") ? ZH : EN;
  return pool[Math.floor(Math.random() * pool.length)] ?? ZH[0];
}
