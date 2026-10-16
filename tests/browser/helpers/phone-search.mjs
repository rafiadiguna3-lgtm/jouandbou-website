import {expect} from '@playwright/test';
export async function revealPhoneSearch(page){
 for(let i=0;i<5;i++)await page.locator('#map-zoom-in').click();
 await expect(page.locator('#search-toggle')).toBeVisible();
}
