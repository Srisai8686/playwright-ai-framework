import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo, 'checkout');

    // Locators
    this.checkoutHeader = page.locator("//h2[contains(text(),'Address Details')]");
    this.deliveryAddress = page.locator("//ul[@id='address_delivery']");
    this.billingAddress = page.locator("//ul[@id='address_invoice']");
    this.commentTextArea = page.locator("textarea[name='message']");
    this.placeOrderButton = page.locator("//a[contains(text(),'Place Order')]");
    this.cartTotal = page.locator("//td[@class='cart_total_price']");
  }

  /** 
   * Verify the checkout page is displayed correctly 
   */
  async verifyCheckoutPage() {
    await this.validateElementVisible(this.checkoutHeader, 'checkout_header');
    await this.takeScreenshot('checkout_page_loaded');
  }

  /**
   * Get delivery and billing addresses text
   */
  async getAddressDetails() {
    const delivery = await this.deliveryAddress.innerText();
    const billing = await this.billingAddress.innerText();
    await this.takeScreenshot('address_details');
    return { delivery, billing };
  }

  /**
   * Add order comments
   */
  async addOrderComment(comment) {
    await this.highlightAndFillField(this.commentTextArea, comment, 'order_comment');
  }

  /**
   * Place the order
   */
  async clickPlaceOrder() {
    await this.clickWithScreenshot(this.placeOrderButton, 'place_order_clicked');
  }

  /**
   * Get total price from checkout page
   */
  async getCheckoutTotal() {
    const totals = await this.cartTotal.allInnerTexts();
    const numericTotals = totals.map(text => parseFloat(text.replace(/[^0-9.]/g, '')));
    const sum = numericTotals.reduce((acc, val) => acc + val, 0);
    return sum;
  }
}
