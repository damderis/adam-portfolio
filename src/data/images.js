// Astro-only: resolves product captures in src/assets/images so astro:assets can resize them.
const files = import.meta.glob('../assets/images/*.{png,webp}', { eager: true, import: 'default' });
const find = name => files[`../assets/images/${name}`];

// Square, face-centred crop of adam-idris.webp for the circular avatar.
export const portrait = find('adam-idris-avatar.webp');

export const shotsFor = slug => ({
  desktop: find(`${slug}-desktop.png`) ?? find(`${slug}-desktop.webp`) ?? find(`${slug}.png`),
  mobile: find(`${slug}-mobile.png`) ?? find(`${slug}-mobile.webp`),
  desktopDetail: find(`${slug}-desktop-detail.png`),
  mobileDetail: find(`${slug}-mobile-detail.png`),
  // Drop-in extras: <slug>-gallery-1.png… for case-study galleries, <slug>-phone-1.png… for phone-only apps.
  gallery: numbered(`${slug}-gallery-`),
  phones: numbered(`${slug}-phone-`),
});

function numbered(prefix) {
  return Object.entries(files)
    .map(([path, image]) => [path.split('/').pop(), image])
    .filter(([name]) => name.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, image]) => image);
}
