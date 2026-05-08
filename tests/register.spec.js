import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/registerpage.js';
import { LoginPage } from '../pages/loginpage.js';
import { executeSteps } from '../utils/stepExecutor.js';
import { generateStepsFromPrompt } from '../utils/aiGenerator.js';
import {
  randomEmail,
  randomName,
  randomPhone
} from '../utils/dataGenerator.js';
import fs from 'fs';

// ✅ Load test data
const registerDataArray = JSON.parse(
  fs.readFileSync('./testData/registerData.json', 'utf-8')
);

// 🔥 Shared email
let sharedEmail;

// 🔥 Prompt Builder
function buildPrompt(registerData) {
  if (registerData.expected === 'error') {
    return "register with existing email";
  }
  return "register";
}

test.describe('AI Register Flow - Data Driven', () => {

  for (const data of registerDataArray) {

    test(
      `register ${data.expected} test`,
      async ({ page }, testInfo) => {

        const registerPage = new RegisterPage(page, testInfo);
        const loginPage = new LoginPage(page, testInfo);

        // =====================
        // 🔥 Dynamic Data Handling
        // =====================

        if (data.expected === 'success') {

          sharedEmail = randomEmail(); // generate once

          data.emailAddress = sharedEmail;
          data.name = randomName();
          data.firstname = randomName();
          data.mobilenumber = randomPhone();

          console.log("👉 Generated Email:", sharedEmail);
        }

        if (data.expected === 'error') {

          data.emailAddress = sharedEmail; // reuse

          console.log("👉 Reusing Email:", sharedEmail);
        }

        // =====================
        // Step 1: Navigate
        // =====================
        await loginPage.goto();

        await expect(registerPage.loginandsignuplink).toBeVisible();

        // =====================
        // Step 2: Prompt
        // =====================
        const prompt = buildPrompt(data);

        console.log("👉 Final Prompt:", prompt);

        // =====================
        // Step 3: Generate Steps
        // =====================
        const steps = await generateStepsFromPrompt(prompt, data);

        console.log("👉 Steps:", steps);

        // =====================
        // Step 4: Execute
        // =====================
        await executeSteps(steps, registerPage);

        // =====================
        // Error Validation
        // =====================
        if (data.expected === 'error') {

          await expect(registerPage.emailAlreadyExists).toBeVisible();

          await registerPage.takeScreenshot('duplicate_email');

          return;
        }

        // =====================
        // Success Validation
        // =====================
        await expect(registerPage.successfullRegistrationMsg).toBeVisible();

        await registerPage.takeScreenshot('registration_success');

        await registerPage.clickContinue();

        await loginPage.clickLogout();

      }
    );
  }
});