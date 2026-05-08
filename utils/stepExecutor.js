import { expect } from '@playwright/test';

export async function executeSteps(steps, pageObj) {
  for (const step of steps) {
    switch (step.action) {

      case 'fill':
        await pageObj[step.target].fill(step.value);
        break;

      case 'click':
        await pageObj[step.target].click();
        break;

      case 'select':
        await pageObj[step.target].selectOption(step.value);
        break;
      
      case 'assertVisible':
        if (!pageObj[step.target]) {
          throw new Error(`❌ Locator not found: ${step.target}`);
          }
        await expect(pageObj[step.target]).toBeVisible();
      break;

  case 'assertText':
    if (!pageObj[step.target]) {
    throw new Error(`❌ Locator not found: ${step.target}`);
    }
        await expect(pageObj[step.target]).toHaveText(step.value);
       break;

       case 'assertRequired':

        if (!pageObj[step.target]) {
          throw new Error(`❌ Locator not found: ${step.target}`);
        }
      
        const isRequired =
          await pageObj[step.target]
            .evaluate(el => !el.checkValidity());
      
        expect(isRequired).toBeTruthy();
      
        break;
        case 'assertURL':

  await expect(
    pageObj.page
  ).toHaveURL(
    step.value
  );

  break;


case 'assertEnabled':

  if (!pageObj[step.target]) {
    throw new Error(
      `❌ Locator not found: ${step.target}`
    );
  }

  await expect(
    pageObj[step.target]
  ).toBeEnabled();

  break;


case 'assertCount':

  if (!pageObj[step.target]) {
    throw new Error(
      `❌ Locator not found: ${step.target}`
    );
  }

  await expect(
    pageObj[step.target]
  ).toHaveCount(
    Number(step.value)
  );

  break;

      default:
        throw new Error(`Unknown action: ${step.action}`);
    }
  }
}