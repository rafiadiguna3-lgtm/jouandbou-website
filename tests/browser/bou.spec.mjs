import { test, expect } from '@playwright/test';
for (const mobile of [false, true]) {
  test(`Bou routes, seven SVG icons, scroll restoration and return navigation (${mobile ? 'phone' : 'desktop'})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: mobile ? {width:390,height:844} : {width:1280,height:800}, isMobile:mobile, hasTouch:mobile });
    const page = await context.newPage();
    const errors=[];page.on('pageerror', e=>errors.push(e.message));
    await page.goto('/#about');
    await expect(page.locator('#about-page')).toBeVisible();
    const footer = await page.locator('#about-page .about-footer').innerHTML();
    const header = await page.locator('header .brand').innerHTML();
    await page.locator('.about-work[href="#bou-works"]').click();
    await expect(page).toHaveURL(/#bou-works$/);
    const panel=page.locator('#bou-page');
    await expect(panel).toBeVisible();
    expect(await panel.locator('.about-footer').innerHTML()).toBe(footer);
    await expect(panel.locator('.bou-project-picker nav a')).toHaveCount(7);
    for (const slug of ['diantara','temu','koru','selebu','sabang','ikat','raindeer']) {
      const icon=panel.locator(`a[href="#bou-works/${slug}"]`);
      await expect(icon.locator('img')).toHaveAttribute('src',`assets/bou/${slug}-icon.svg`);
      await icon.scrollIntoViewIfNeeded();
      await expect.poll(()=>icon.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
      const previousTop=await panel.evaluate(el=>el.scrollTop);
      expect(previousTop).toBeGreaterThan(0);
      await icon.click();
      await expect(page).toHaveURL(new RegExp(`#bou-works/${slug}$`));
      await expect(panel.locator('article.bou-project')).toBeVisible();
      await expect.poll(()=>panel.locator('.bou-lead img').first().evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
      await panel.evaluate(el=>el.scrollTop=250);
      await page.locator('#bou-close').click();
      await expect(page).toHaveURL(/#bou-works$/);
      await expect(panel.locator('.bou-project-picker')).toBeVisible();
      await expect.poll(async()=>Math.abs((await panel.evaluate(el=>el.scrollTop))-previousTop)).toBeLessThan(3);
      expect(await page.locator('header .brand').innerHTML()).toBe(header);
    }
    await page.locator('#bou-close').click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#about-page')).toBeVisible();
    await page.locator('#about-page').evaluate(el=>el.scrollTop=400);
    await page.evaluate(()=>location.hash='contact');
    await expect(page.locator('#contact-page')).toBeVisible();
    await page.evaluate(()=>location.hash='about');
    await expect(page.locator('#about-page')).toBeVisible();
    await expect.poll(()=>page.locator('#about-page').evaluate(el=>el.scrollTop)).toBe(0);
    await page.goto('/#bou/temu');
    await expect(page).toHaveURL(/#bou-works\/temu$/);
    await expect(panel.locator('article.bou-project')).toBeVisible();
    await page.locator('header .brand').click();
    await expect(panel).toBeHidden();
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#focus')).toBeHidden();
    expect(errors).toEqual([]);
    await context.close();
  });
}
