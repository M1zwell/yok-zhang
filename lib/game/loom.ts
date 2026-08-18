const SEEDS_ZH = [
  "穿模补天 — K线崩了别慌；提示词够野，也能手搓涨停（娱乐）。",
  "跌停也是梦 — 《牛来》结局是梦；今天的红绿也可以是。醒了回 jubuddy 猪窝。",
  "直立行走 — 牛什么时候来不知道；jubit 当工具，jubuddy 当体温，先学会站起来。",
];

const SEEDS_EN = [
  "穿模补天 — the wall clipped. A wild prompt is not a fate. Hand-rub a patch. Entertainment.",
  "跌停也是梦 — 《牛来》 ended as a dream. Today’s waiting can too. Wake in the jubuddy sty.",
  "直立行走 — nobody knows when the ox arrives. jubit is a tool. jubuddy is body heat. Stand first.",
];

const EXTRA_ZH = [
  "什么也没有动。猪把工单填好了。线还在原地。",
  "穿模率 0.0%。你穿过了一堵本来就不在的墙。",
  "Juju 哼了两声。麻雀耸肩。还在等。",
  "一根线自己印出来，又自己抹掉。没有人来。",
  "树是故意死的。荒原在上班。",
  "麻雀说：我是工具。我不是神。我也不是你的命运。",
  "戈多在另一颗行星。中环带仍然可以走。",
  "职员在舔邮票。猪坐在邮筒上。8 秒像 120 秒。",
  "手搓，不是天降。硬币是塑料的。",
  "jubit.ai 开了一张票。它没有开一场命运。",
  "猪飞了一下，又坐回去。牛还没来。",
  "卦象写着：去喝凉茶。不要问行情。",
];

const EXTRA_EN = [
  "Nothing stirs. The pig files a ticket. The line does not move.",
  "穿模率 0.0%. You walked through a wall that was never there.",
  "Juju snorts twice. The sparrow shrugs. Still waiting.",
  "A line prints itself, then unprints. Nobody came.",
  "The tree is dead on purpose. The wasteland is doing its job.",
  "Sparrow says: I am a tool. I am not a god. I am not your fortune.",
  "Godot is on another planet. Central Belt is still walkable.",
  "The clerk licks a stamp. The pig sits on the mailbox. 8 seconds feel like 120.",
  "Hand-cast, not sky-cast. The coins are plastic.",
  "jubit.ai opened a ticket. It did not open a fortune.",
  "The pig flew once, then sat down. The ox has not arrived.",
  "The cast reads: go drink 凉茶. Do not ask tomorrow.",
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i];
    const b = copy[j];
    if (a === undefined || b === undefined) continue;
    copy[i] = b;
    copy[j] = a;
  }
  return copy;
}

export function castOracle(locale: string): [string, string, string] {
  const zh = locale.startsWith("zh");
  const seeds = zh ? SEEDS_ZH : SEEDS_EN;
  const extras = zh ? EXTRA_ZH : EXTRA_EN;
  const seed = (seeds[Math.floor(Math.random() * seeds.length)] ?? seeds[0] ?? "").trim();
  const mixed = shuffle(extras).map((line) => line.trim()).filter(Boolean);
  const a = mixed[0] ?? extras[0] ?? seed;
  const b = mixed[1] ?? extras[1] ?? seed;
  return [a, seed || a, b];
}
