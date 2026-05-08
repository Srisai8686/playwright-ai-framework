// utils/helper.js
export async function highlightAndFill(page, locator, value) {
  // Highlight the field
  await locator.evaluate(el => {
    el.style.border = '2px solid red';
    el.style.transition = 'border 0.2s ease-in-out';
  });

  // Small delay for visual clarity
  await page.waitForTimeout(300);

  // Fill the input field
  await locator.fill(value);
}
