import { test, expect } from '@playwright/test';
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
// Send optional Vercel automation authentication only to this Preview origin.
// Never use context-wide headers, which would expose it to fonts/maps hosts.
test.beforeEach(async ({ page, baseURL }) => {
  if (bypass) await page.route(`${baseURL}/**`, route => route.continue({
    headers: { ...route.request().headers(), 'x-vercel-protection-bypass': bypass }
  }));
});
async function ready(page) {
  const response = await page.goto('/');
  expect(response.status(), 'Preview may require Vercel authentication; do not test the login screen as the website').toBe(200);
  await expect(page).toHaveTitle('Jou & Bou — A neighborhood of ideas');
  await expect(page.locator('#map')).toBeVisible();
  await expect(page.locator('#labels button:not([disabled])')).toHaveCount(25);
}
async function select(page, name) {
  await page.locator('#search-toggle').click();
  await page.locator('#search').fill(name);
  await page.locator('#results button').first().click();
  await expect(page.locator('#focus')).toBeVisible();
  await expect(page.locator('#modelStatus')).toBeHidden({ timeout: 30000 });
}
test('hosted build serves original HTML, ES modules and noindex header', async ({ page, request, baseURL }) => {
  await ready(page);
  const headers = bypass ? { 'x-vercel-protection-bypass': bypass } : {};
  const response = await request.get(`${baseURL}/` , { headers });
  expect(response.headers()['x-robots-tag']).toContain('noindex');
  const module = await request.get(`${baseURL}/app.mjs?v=129`, { headers });
  expect(module.status()).toBe(200);
  expect(module.headers()['content-type']).toMatch(/javascript/);
  expect(await module.text()).toContain('createTouchOrbit');
  const missing = await request.get(`${baseURL}/not-a-real-asset-123456.bin`, { headers });
  expect(missing.status()).toBe(404);
});
test('3D orbit, zoom, project navigation and eight detail routes on staging', async ({ page }) => {
  const modelErrors = [];
  page.on('console', message => { if (message.type() === 'error' && message.text().includes('House model unavailable')) modelErrors.push(message.text()); });
  await ready(page);
  await select(page, 'Marboy');
  const canvas = page.locator('#map');
  await page.waitForTimeout(1500); // Allow the existing camera-entry animation to settle.
  const before = await canvas.screenshot();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.35);
  await page.mouse.down();await page.mouse.move(box.x+box.width*.65,box.y+box.height*.45,{steps:12});await page.mouse.up();
  await expect.poll(async () => (await canvas.screenshot()).equals(before)).toBe(false);
  const orbited = await canvas.screenshot();
  await page.mouse.wheel(0,-300);
  await expect.poll(async () => (await canvas.screenshot()).equals(orbited)).toBe(false);
  await page.locator('#more').click();
  await expect(page.locator('#marboy')).toBeVisible();
  await page.locator('#marboy .close').click();
  await page.locator('#back').click();
  for (const [name, id] of [['Rumah Anas','rumah-anas'],['Rumahsoka','rumasoka'],['Jangkrik','jangkrik'],['Flute','flute'],['Rumah Zubair','zubair'],['RR House','rr-house'],['Rempoa','rempoa'],['Cipete','jh37']]) {
    await select(page, name);
    await page.locator('#more').click();
    await expect(page.locator(`#${id}`)).toBeVisible();
    await page.locator(`#${id} .close`).click();
    await expect(page.locator(`#${id}`)).toBeHidden();
    await page.locator('#back').click();
  }
  expect(modelErrors).toEqual([]);
});
test('real Google Fonts stylesheet and font files load', async ({ page }) => {
  const fonts = [];
  page.on('response', response => { if (new URL(response.url()).hostname === 'fonts.gstatic.com' && response.ok()) fonts.push(response.url()); });
  const stylesheet = page.waitForResponse(response => new URL(response.url()).hostname === 'fonts.googleapis.com', {timeout:30000});
  await ready(page);
  expect((await stylesheet).ok()).toBe(true);
  await page.locator('#studio').click();
  await expect(page.locator('#about-page')).toBeVisible();
  await expect.poll(async () => page.evaluate(async () => {
    await document.fonts.load('400 16px Lato');
    await document.fonts.load('400 16px "Open Sans"');
    return ['Lato','Open Sans'].every(name => [...document.fonts].some(face => face.family.replace(/["']/g,'') === name && face.status === 'loaded'));
  }), { timeout:30000 }).toBe(true);
  expect(fonts.length, 'Font declarations alone do not prove font binaries loaded').toBeGreaterThan(0);
});
test('real contact map tiles load and studio card works', async ({ page }) => {
  const tiles = [];
  page.on('response', response => {
    const url = new URL(response.url());
    if (response.ok() && ((url.hostname === 'tiles.openfreemap.org' && (/\/planet\/.*\/\d+\/\d+\/\d+(?:\.(pbf|mvt))?$/.test(url.pathname) || /\.(pbf|mvt)$/.test(url.pathname) && !url.pathname.includes('/fonts/'))) || (url.hostname === 'tile.openstreetmap.org' && /\.png$/.test(url.pathname)))) tiles.push(response.url());
  });
  await ready(page);
  await page.locator('#contact').click();
  await expect(page.locator('#contact-page')).toBeVisible();
  await expect.poll(() => tiles.length, {timeout:45000}).toBeGreaterThan(0);
  await expect(page.locator('#studio-map-status')).toBeHidden({timeout:15000});
  await page.locator('.studio-location-chip').click();
  await expect(page.locator('#studio-location-card')).toBeVisible();
  await expect(page.locator('.studio-card-phone')).toHaveAttribute('href','tel:+628118111439');
});
