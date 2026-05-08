import { highlightAndFill } from '../utils/helper.js';
import fs from 'fs';
import path from 'path';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   * @param {string} folderPrefix Optional folder prefix like 'login', 'register'
   */
  constructor(page, testInfo, folderPrefix = 'page') {
    this.page = page;
    this.testInfo = testInfo;
    this.stepCount = 1;

    // Screenshot folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.dateFolder = `${folderPrefix}-${timestamp.split('T')[0]}`;
    this.folderPath = path.join('screenshots', this.dateFolder);
    fs.mkdirSync(this.folderPath, { recursive: true });
  }

  // Take screenshot and attach to report
  async takeScreenshot(label) {
    try {
      const step = String(this.stepCount).padStart(2, '0');
      const filename = `${step}_${label}.png`;
      const fullPath = path.join(this.folderPath, filename);

      fs.mkdirSync(this.folderPath, { recursive: true });
      await this.page.screenshot({ path: fullPath });

      if (this.testInfo) {
        await this.testInfo.attach(label, {
          path: fullPath,
          contentType: 'image/png',
        });
      }

      this.stepCount++;
    } catch (err) {
      console.error('Error taking screenshot:', err.message);
    }
  }

  // Highlight and fill a field with retries
  async highlightAndFillField(locator, value, label, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.scrollIntoViewIfNeeded();
        await highlightAndFill(this.page, locator, value);
        await this.takeScreenshot(label);
        return;
      } catch (err) {
        if (attempt === retries) {
          await this.handleError(err, `fill failed: ${label}`);
        }
      }
    }
  }

  // Click with retries + screenshot
  async clickWithScreenshot(locator, label, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        await locator.scrollIntoViewIfNeeded();
        await locator.click();
        await this.takeScreenshot(label);
        return;
      } catch (err) {
        if (attempt === retries) {
          await this.handleError(err, `click failed: ${label}`);
        }
      }
    }
  }

  // Validate element visible
  async validateElementVisible(locator, label) {
    try {
      if (!(await locator.isVisible())) {
        await this.takeScreenshot(`error_${label}`);
        throw new Error(`❌ Element not visible: ${label}`);
      }
    } catch (err) {
      await this.handleError(err, `validation failed: ${label}`);
    }
  }

  // Central error handler
  async handleError(err, message) {
    console.error(`❌ ${message}:`, err.message);
    await this.takeScreenshot(`error_${this.stepCount}`);
    throw new Error(`${message}\nOriginal error: ${err.message}`);
  }
}
