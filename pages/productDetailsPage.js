import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class ProductDetailsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   */
  constructor(page, testInfo) {
    super(page, testInfo, 'product-details');

    // Locators
    this.productTitle = page.locator('//div[@class="product-information"]/h2');
    this.price = page.locator('//div[@class="product-information"]/span/span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartBtn = page.locator("//button[contains(text(),'Add to cart')]");
    this.viewCartLink = page.locator("//u[contains(text(),'View Cart')]");
    this.successPopup = page.locator('#cartModal');
  }

  // ✅ Validate product detail page is loaded
  async validateProductDetailsPage(productName) {
    await this.validateElementVisible(this.productTitle, 'product_title');
    const actualTitle = (await this.productTitle.textContent()).trim();
    expect(actualTitle).toContain(productName);
    await this.takeScreenshot(`product_details_loaded_${productName}`);
  }

  // ✅ Change quantity dynamically
  async setQuantity(quantity) {
    await this.highlightAndFillField(this.quantityInput, String(quantity), 'set_quantity');
  }

  // ✅ Add to cart
    async addToCart() {
      await this.clickWithScreenshot(this.addToCartBtn, 'add_to_cart');
      await this.validateElementVisible(this.successPopup, 'success_popup_visible');
    }

  // ✅ Go to cart after adding product
  async goToCart() {
    await this.clickWithScreenshot(this.viewCartLink, 'view_cart');
  }
}
