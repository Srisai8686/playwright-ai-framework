import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/loginpage.js';
import { RegisterPage } from './pages/registerpage.js';
import fs from 'fs';
import path from 'path';


// 🔥 Screenshot cleanup

const screenshotFolder = path.join('screenshots');

if (fs.existsSync(screenshotFolder)) {

  fs.rmSync(
    screenshotFolder,
    {
      recursive: true,
      force: true
    }
  );

  console.log(
    "🗑 Old screenshots deleted"
  );

}


// 🔥 Fixtures
export const test = base.extend({

  loginPage: async ({ page }, use, testInfo) => {

    const loginPage =
      new LoginPage(
        page,
        testInfo
      );

    await use(
      loginPage
    );

  },

  registerPage: async ({ page }, use, testInfo) => {

    const registerPage =
      new RegisterPage(
        page,
        testInfo
      );

    await use(
      registerPage
    );

  }

});


export { expect };


// 🔥 Failure screenshot
test.afterEach(
  async ({ page }, testInfo) => {

    if (
      testInfo.status !==
      testInfo.expectedStatus
    ) {

      try {

        if (
          !page.isClosed()
        ) {

          const screenshot =
            await page.screenshot();

          await testInfo.attach(
            'Failure Screenshot',
            {
              body: screenshot,
              contentType:
                'image/png'
            }
          );

        }

      } catch (error) {

        console.log(
          "⚠️ Screenshot skipped:",
          error.message
        );

      }

    }

  }
);
