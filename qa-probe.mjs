export default async function run(page) {
  // Hide the gradient overlay and the card so ONLY the ::before photo layer
  // can contribute pixels, then read a real rendered pixel.
  await page.addStyleTag({
    content: `
      .ds-app-auth::after { display: none !important; }
      .ds-auth-card { visibility: hidden !important; }
      .ds-nav { visibility: hidden !important; }
    `,
  });
  await page.waitForTimeout(700);

  const rendered = await page.evaluate(() => {
    const el = document.querySelector('.ds-app-auth');
    if (!el) return { error: 'no .ds-app-auth' };
    const before = getComputedStyle(el, '::before');
    return {
      bgImage: before.backgroundImage,
      bgSize: before.backgroundSize,
      bgPos: before.backgroundPosition,
      bgColor: before.backgroundColor,
      display: before.display,
      content: before.content,
      opacity: before.opacity,
      zIndex: before.zIndex,
      position: before.position,
      elemW: el.offsetWidth,
      elemH: el.offsetHeight,
    };
  });

  // Sample the decoded source image itself, via canvas.
  const source = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 16;
          c.height = 8;
          const x = c.getContext('2d');
          x.drawImage(img, 0, 0, 16, 8);
          const d = x.getImageData(0, 0, 16, 8).data;
          const colors = new Set();
          for (let i = 0; i < d.length; i += 4) {
            colors.add(`${d[i]},${d[i + 1]},${d[i + 2]}`);
          }
          resolve({
            natural: `${img.naturalWidth}x${img.naturalHeight}`,
            distinct: colors.size,
            first: [...colors].slice(0, 8),
          });
        };
        img.onerror = () => resolve({ error: 'load failed' });
        img.src = '/b.png';
      })
  );

  return { computedStyleOfBefore: rendered, decodedSourcePixels: source };
}
