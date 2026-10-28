export function localTime(now: Date, offsetHours: number): string {
  const shifted = new Date(now.getTime() + offsetHours * 3600000);
  return String(shifted.getUTCHours()).padStart(2, "0") + ":" + String(shifted.getUTCMinutes()).padStart(2, "0");
}

export function utcOffsetFrom(location: string): number {
  const match = location.match(/UTC\s*([+-−]\s*\d{1,2})/);
  if (!match) return -3;
  return Number(match[1].replace("−", "-").replace(/\s/g, ""));
}
