import { BasePage } from './BasePage.js';

export class ViewCartPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo, 'viewcart');

    // All cart product rows
    this.cartRows = this.page.locator("//tr[contains(@id,'product')]");
    // Cart total (usually bottom of table or summary)
    this.cartTotal = this.page.locator("//td[@colspan='4' and text()='Total']/following-sibling::td");
  }

  /**
   * Extracts all products in cart with description, price, quantity, total
   */
  async getAllCartProducts() {
    const productCount = await this.cartRows.count();
    const products = [];

    for (let i = 0; i < productCount; i++) {
      const row = this.cartRows.nth(i);
      const description = (await row.locator('td:nth-child(2)').innerText()).trim();
      const price = (await row.locator('td:nth-child(3) p').innerText()).trim();
      const quantity = (await row.locator('td:nth-child(4) button').innerText()).trim();
      const total = (await row.locator('td:nth-child(5) p').innerText()).trim();
      products.push({ description, price, quantity, total });
    }

    return products;
  }

  /**
   * Verify a specific product with expected price, qty, total
   */
  async verifyProductInCart(productName, expectedData = {}) {
    const allProducts = await this.getAllCartProducts();
    const target = allProducts.find(p => p.description.includes(productName));

    if (!target) throw new Error(`❌ Product "${productName}" not found in cart.`);

    console.log(`✅ Found "${productName}" in cart ->`, target);

    if (expectedData.price && target.price !== expectedData.price)
      throw new Error(`❌ Price mismatch for ${productName}. Expected: ${expectedData.price}, Found: ${target.price}`);

    if (expectedData.quantity && target.quantity !== expectedData.quantity)
      throw new Error(`❌ Quantity mismatch for ${productName}. Expected: ${expectedData.quantity}, Found: ${target.quantity}`);

    if (expectedData.total && target.total !== expectedData.total)
      throw new Error(`❌ Total mismatch for ${productName}. Expected: ${expectedData.total}, Found: ${target.total}`);

    await this.takeScreenshot(`verified_${productName}_cart`);
    console.log(`✅ Verified "${productName}" successfully in cart.`);
  }

  /**
   * Remove a specific product from the cart dynamically
   */
  async removeProductFromCart(productName) {
    const row = this.page.locator(`//tr[contains(@id,'product')]//td[2][contains(.,'${productName}')]/..`);
    const deleteBtn = row.locator(".cart_delete a");

    if (!(await deleteBtn.isVisible())) {
      throw new Error(`❌ Delete button not visible for "${productName}"`);
    }

    await this.clickWithScreenshot(deleteBtn, `removed_${productName}_from_cart`);
    console.log(`🗑️ Removed "${productName}" from cart`);
  }

  /**
   * Get the total amount shown in cart summary (bottom)
   */
  async getCartTotal() {
    const totalText = await this.cartTotal.innerText();
    const total = totalText.replace(/[^\d]/g, ''); // remove Rs. or $ symbols
    console.log(`🧾 Cart total: ${total}`);
    return total;
  }

  /**
 * Verify that the sum of individual product totals equals the final cart total.
 */
async verifyCartTotalSum() {
  const products = await this.getAllCartProducts();

  if (products.length === 0) {
    throw new Error('❌ No products found in the cart.');
  }

  // Extract numeric values and sum them up
  const sumOfProducts = products.reduce((sum, p) => {
    const numericTotal = parseFloat(p.total.replace(/[^\d.]/g, ''));
    return sum + numericTotal;
  }, 0);

  // Fetch displayed cart total
  const displayedTotalText = await this.getCartTotal();
  const displayedTotal = parseFloat(displayedTotalText.replace(/[^\d.]/g, ''));

  console.log(`🧮 Calculated total from products: ${sumOfProducts}`);
  console.log(`💰 Displayed total on page: ${displayedTotal}`);

  // Compare both
  if (sumOfProducts !== displayedTotal) {
    throw new Error(`❌ Cart total mismatch! Expected: ${sumOfProducts}, Found: ${displayedTotal}`);
  }

  await this.takeScreenshot('verified_cart_total');
  console.log('✅ Verified cart total matches sum of all product totals.');
}

}
