import { test, expect } from '../baseTest';
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

// 🔥 Shared email for duplicate scenario
let sharedEmail;

// 🔥 Prompt Builder
function buildPrompt(registerData) {
  if (registerData.expected === 'error') {
    return "register with existing email";
  }
  return "register";
}

// 🔥 Run sequentially (important for sharedEmail)
test.describe.serial('AI Register Flow - Data Driven', () => {

  for (const data of registerDataArray) {

    test(
      `register ${data.expected} test`,
      async ({ loginPage, registerPage, page }) => {

        // =====================
        // 🔥 Dynamic Data Handling
        // =====================

        if (data.expected === 'success') {
          sharedEmail = randomEmail();

          data.emailAddress = sharedEmail;
          data.name = randomName();
          data.firstname = randomName();
          data.mobilenumber = randomPhone();

          console.log("👉 Generated Email:", sharedEmail);
        }

        if (data.expected === 'error') {
          data.emailAddress = sharedEmail;

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

          await expect(registerPage.emailAlreadyExists).toBeVisible({
            timeout: 10000
          });

          await registerPage.takeScreenshot('duplicate_email');

          return;
        }

        // =====================
        // Success Validation
        // =====================
        await expect(registerPage.successfullRegistrationMsg).toBeVisible();

        await registerPage.takeScreenshot('registration_success');

        // =====================
        // Continue → Wait → Logout
        // =====================
        await registerPage.clickContinue();

        // 🔥 Wait for navigation to complete
        await page.waitForLoadState('load');

        await loginPage.clickLogout();

      }
    );
  }
});