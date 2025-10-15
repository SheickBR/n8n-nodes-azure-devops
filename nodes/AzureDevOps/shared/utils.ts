export function buildApiUrl(path: string, version = '7.0'): string {
  return `${path}?api-version=${version}`;
}
