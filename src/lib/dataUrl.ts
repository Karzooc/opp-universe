/** JSON under public/data — works with Vite base `./` and subfolder deploys */
export function dataJsonUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}data/${filename}`;
}
