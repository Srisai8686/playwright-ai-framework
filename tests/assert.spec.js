import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage.js';
import { executeSteps } from '../utils/stepExecutor.js';

test(
  'Framework assertions validation',
  async ({ page }, testInfo) => {

    const loginPage =
      new LoginPage(
        page,
        testInfo
      );

    // Navigate
    await loginPage.goto();

    // Dynamic steps
    const steps = [

      {
        action: 'assertURL',
        value:
          'https://automationexercise.com/'
      },

      {
        action: 'click',
        target:
          'loginandsignuplink'
      },

      {
        action: 'assertEnabled',
        target:
          'loginButton'
      }

    ];

    console.log(
      "👉 Assertion Steps:",
      steps
    );

    await executeSteps(
      steps,
      loginPage
    );

  }
);