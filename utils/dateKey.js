export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
