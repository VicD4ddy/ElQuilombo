const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const artifactDir = 'C:\\Users\\Vicdaddy\\.gemini\\antigravity-ide\\brain\\68d5c84b-463a-43af-a5d9-2b1f5cc5ee8d';
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop Test
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const desktopPage = await desktopContext.newPage();
    console.log('Navigating to desktop view...');
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    await desktopPage.screenshot({
      path: path.join(artifactDir, 'desktop_view.png'),
      fullPage: false
    });
    console.log('Desktop screenshot saved.');
    await desktopContext.close();

    // 2. Mobile Test (iPhone 14: 390 x 844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    console.log('Navigating to mobile view (390x844)...');
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
    
    // Check horizontal overflow
    const overflowInfo = await mobilePage.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      const bodyScrollW = document.body.scrollWidth;
      return {
        hasOverflow: scrollW > clientW,
        scrollW,
        clientW,
        bodyScrollW
      };
    });
    console.log('Mobile overflow check:', JSON.stringify(overflowInfo));

    // Mobile Navbar & Hero
    await mobilePage.screenshot({
      path: path.join(artifactDir, 'mobile_view_navbar.png'),
      fullPage: false
    });
    console.log('Mobile navbar screenshot saved.');

    // Scroll down to ticketing section
    const ticketing = mobilePage.locator('#entradas');
    if (await ticketing.count() > 0) {
      await ticketing.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(500);
      await mobilePage.screenshot({
        path: path.join(artifactDir, 'mobile_view_ticketing.png'),
        fullPage: false
      });
      console.log('Mobile ticketing screenshot saved.');
    }

    await mobileContext.close();
    console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
})();
