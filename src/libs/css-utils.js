export function classNamesToStr(names) {
  return Array.isArray(names) ? names.filter(v => v).join(' ') : names;
}