/** Strip hash fragment from a path string. */
export function stripHash(path: string): string {
  return path.split("#")[0];
}
