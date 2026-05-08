import { BasePage } from './BasePage.js';

export class HomePage extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   */
  constructor(page, testInfo) {
    super(page, testInfo, 'home');

    //locators
    this.homePagelink = page.locator("//ul[@class='nav navbar-nav']/li[1]");
    this.productsLink = page.locator("//ul[@class='nav navbar-nav']/li[2]");
    this.cartLink = page.locator("//ul[@class='nav navbar-nav']/li[3]");
    this.deleteAccountLink = page.locator("///ul[@class='nav navbar-nav']/li[5]");

  }

  async clickHomePage(){
    await this.clickWithScreenshot(this.homePagelink, 'homepage_clicked');
  }

  async clickProductsLink(){
    await this.clickWithScreenshot(this.productsLink, 'productslink_clicked');
  }

  async clickCartLink(){
    await this.clickWithScreenshot(this.cartLink, 'cartlink_clicked');
  }

  async clickDeleteAccountLink(){
    await this.clickWithScreenshot(this.deleteAccountLink, 'deleteaccountlink_clicked');
  }
}