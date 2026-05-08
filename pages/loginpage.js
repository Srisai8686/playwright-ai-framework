import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   */
  constructor(page, testInfo) {
    super(page, testInfo, 'login'); // BasePage handles folder, stepCount, screenshots

    // Locators
    this.loginandsignuplink = page.locator('//ul[@class="nav navbar-nav"]/li[4]');
    this.emaillogin = page.locator("//form[@action='/login']/input[@name='email']");
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.locator("//button[contains(text(),'Login')]");
    this.logoutButton = page.locator('//ul[@class="nav navbar-nav"]/li[4]');
    this.loginError = page.locator("//p[contains(text(),'Your email or password is incorrect!')]");
  }

  // Navigate to homepage
  async goto() {
    await this.page.goto("https://automationexercise.com/");
  }

  // Fill login credentials
  async login(emailAddress, password) {
    if (typeof emailAddress !== 'string' || typeof password !== 'string') {
      throw new Error(`Invalid credentials: email=${emailAddress}, password=${password}`);
    }

    await this.clickWithScreenshot(this.loginandsignuplink, 'login_link_clicked');
    await this.highlightAndFillField(this.emaillogin, emailAddress, 'login_email');
    await this.highlightAndFillField(this.password, password, 'login_password');
  }

  // Click login button and validate errors
  async clickLogin() {
    await this.clickWithScreenshot(this.loginButton, 'login_button_clicked');
    //await this.validateLoginError();
  }

  // Click logout
  async clickLogout() {
    await this.clickWithScreenshot(this.logoutButton, 'logout_button_clicked');
  }

  // Validate login error and fail test if necessary
  async isLoginErrorVisible() {
    if (await this.loginError.isVisible()) {
      await this.takeScreenshot('login_error_message');
      return true;
    }
    return false;
  }
}
