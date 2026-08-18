export function isCrisisAsk(text: string): boolean {
  try {
    const re =
      /(自杀|自殺|不想活|活不下去|结束生命|结束自己|轻生|輕生|自我了断|割腕|跳楼|跳樓|寻死|尋死|kill myself|killing myself|end my life|suicide|suicidal|self[- ]?harm|want to die|wanna die|hurt myself)/i;
    return re.test(text);
  } catch {
    return true;
  }
}
