import { BasePage } from './BasePage.js';

export class ViewCartPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo, 'viewcart');

    this.paymentHeader = this.page.locator("//h2[contains(text(),'Payment')]");
    this.nameOncard = this.page.locator("//input[@data-qa='name-on-card']");
    this.cardNumber = this.page.locator("//input[@data-qa='card-number']");
    this.cvv = this.page.locator("//input[@data-qa='cvc']");
    this.expiryMonth = this.page.locator();
    this.expiryYear =this.page.locator();


  }
}
