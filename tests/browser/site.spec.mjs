import { test, expect } from '@playwright/test';
async function ready(page) {
  await page.goto('/');
  await page.waitForFunction(() => document.querySelector('#labels button') && document.querySelector('header [aria-current]'));
  await expect(page.locator('#map')).toBeVisible();
}
async function select(page, name, mobile = false) {
  await page.locator('#search-toggle').click();
  await page.locator('#search').fill(name);
  await page.locator('#results button').first().click();
  if (mobile) {
    await expect(page.locator('.house-callout-card')).toBeVisible();
    await page.locator('.house-callout-card').click();
  }
  await expect(page.locator('#focus')).toBeVisible();
  await expect(page.locator('#more')).toContainText('Project details');
  await expect(page.locator('#modelStatus')).toBeHidden({ timeout: 30000 });
}
test('desktop 3D, search, zoom and project photograph viewer', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.locator('#labels button:not([disabled])')).toHaveCount(25);
  await page.keyboard.press('+');
  await page.keyboard.press('-');
  await select(page, 'Marboy');
  await page.locator('#more').click();
  await expect(page.locator('#marboy')).toBeVisible();
  await expect(page.locator('#marboy-title')).toContainText('Marboy');
  await expect.poll(() => page.locator('#project-film').evaluate(video => video.currentTime), {timeout:30000}).toBeGreaterThan(.1);
  const photo = page.locator('#marboy img.expandable-photo').first();
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => photo.evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await photo.click();
  await expect(page.locator('.photo-viewer')).toBeVisible();
  await expect(page.locator('.photo-viewer img')).toBeVisible();
  expect(errors).toEqual([]);
});
test('desktop project dialogs preserve all published detail routes', async ({ page }) => {
  await ready(page);
  for (const [name, id] of [['Rumah Anas','rumah-anas'],['Rumahsoka','rumasoka'],['Jangkrik','jangkrik'],['Flute','flute'],['Rumah Zubair','zubair'],['RR House','rr-house'],['Rempoa','rempoa'],['Cipete','jh37']]) {
    await select(page, name);
    await page.locator('#more').click();
    await expect(page.locator(`#${id}`)).toBeVisible();
    await page.locator(`#${id} .close`).click();
    await expect(page.locator(`#${id}`)).toBeHidden();
    await page.locator('#back').click();
    await expect(page.locator('#focus')).toBeHidden();
  }
});
test('about, cached Instagram gallery, contact card and outbound links', async ({ page }) => {
  await ready(page);
  await page.locator('#studio').click();
  await expect(page.locator('#about-page')).toBeVisible();
  await expect(page.locator('.about-feed-track a')).toHaveCount(12);
  await page.locator('.about-feed-track img').first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.about-feed-track img').first().evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await page.locator('#contact').click();
  await expect(page.locator('#contact-page')).toBeVisible();
  await page.locator('.studio-location-chip').click();
  await expect(page.locator('#studio-location-card')).toBeVisible();
  await expect(page.locator('.studio-card-phone')).toHaveAttribute('href','tel:+628118111439');
  await expect(page.locator('.studio-card-actions a').first()).toHaveAttribute('href', /destination=-6\.3104695/);
  await page.locator('.studio-card-close').click();
  await expect(page.locator('#studio-location-card')).toBeHidden();
});
test('phone navigation, two-step project exploration and landscape layout', async ({ browser }) => {
  const context = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForFunction(() => document.body.classList.contains('touch-layout'));
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded','true');
  await page.locator('#studio').click();
  await expect(page.locator('#about-page')).toBeVisible();
  await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded','false');
  await page.locator('#menu-toggle').click();
  await page.locator('#projects').click();
  await select(page,'Marboy',true);
  await page.locator('#more').click();
  await expect(page.locator('#marboy')).toBeVisible();
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#marboy')).toBeHidden();
  await page.setViewportSize({width:844,height:390});
  await expect(page.locator('body')).toHaveClass(/landscape-layout/);
  await expect(page.locator('#map')).toBeVisible();
  await context.close();
});
