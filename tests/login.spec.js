import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginpage.js';
import { executeSteps } from '../utils/stepExecutor.js';
import { generateStepsFromPrompt } from '../utils/aiGenerator.js';
import fs from 'fs';

// ✅ Load test data
const loginDataArray = JSON.parse(
  fs.readFileSync('./testData/loginData.json', 'utf-8')
);

// 🔥 Prompt Builder
function buildPrompt(loginData) {

  if (!loginData.emailAddress) {
    return "login missing email";
  }

  if (!loginData.password) {
    return "login missing password";
  }

  if (loginData.expected === 'error') {
    return "login with invalid credentials";
  }

  return "login";
}

test.describe.parallel(
  'User Login Flow - AI Driven + Data Driven',
  () => {

    for (const loginData of loginDataArray) {

      test(
        `login test with ${loginData.emailAddress || 'empty_email'}`,
        async ({ page }, testInfo) => {

          const loginPage =
            new LoginPage(page, testInfo);

          // =====================
          // Step 1: Navigate
          // =====================
          await loginPage.goto();

          await expect(
            loginPage.loginandsignuplink
          ).toBeVisible();

          // =====================
          // Step 2: Build prompt
          // =====================
          const prompt =
            buildPrompt(loginData);

          console.log(
            "👉 Final Prompt:",
            prompt
          );

          // =====================
          // Step 3: Generate AI steps
          // =====================
          const steps =
            await generateStepsFromPrompt(
              prompt,
              loginData
            );

          console.log(
            "👉 Generated Steps:",
            steps
          );

          // =====================
          // Step 4: Execute steps
          // =====================
          await executeSteps(
            steps,
            loginPage
          );

          // =====================
          // REQUIRED FIELD CASES
          // =====================
          if (
            !loginData.emailAddress ||
            !loginData.password
          ) {

            await loginPage
              .takeScreenshot(
                'login_required_validation'
              );

            return;
          }

          // =====================
          // INVALID CREDENTIALS
          // =====================
          if (
            loginData.expected === 'error'
          ) {

            const isError =
              await loginPage
                .isLoginErrorVisible();

            expect(isError)
              .toBeTruthy();

            await loginPage
              .takeScreenshot(
                'login_invalid_credentials'
              );

            return;
          }

          // =====================
          // SUCCESS CASE
          // =====================
          await expect(
            loginPage.logoutButton
          ).toBeVisible({
            timeout: 5000
          });

          await loginPage
            .takeScreenshot(
              'login_successful'
            );

          // =====================
          // Logout
          // =====================
          await loginPage
            .clickLogout();

          await expect(
            loginPage.loginandsignuplink
          ).toBeVisible();

          await loginPage
            .takeScreenshot(
              'logout_successful'
            );

        }
      );

    }

  }
);