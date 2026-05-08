import { BasePage } from './BasePage.js';

export class RegisterPage extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   */
  constructor(page, testInfo) {
    super(page, testInfo, 'register'); // BasePage handles folder, stepCount, screenshots

    // Locators
    this.loginandsignuplink = page.locator('//ul[@class="nav navbar-nav"]/li[4]');
    this.name = page.getByPlaceholder('Name');
    this.emailAddress = page.locator("//form[@action='/signup']/input[@name='email']");
    this.signupButton = page.locator("//button[@data-qa='signup-button']");
    this.emailAlreadyExists =page.getByText('Email Address already exist!');

    this.Title = page.locator("//input[@id='id_gender1']");
    this.regpassword = page.locator("//input[@id='password']");
    this.daydropdown = page.locator('#days');
    this.monthdropdown = page.locator('#months');
    this.yeardropdown = page.locator('#years');

    this.firstName = page.locator("//input[@id='first_name']");
    this.lastName = page.locator("//input[@id='last_name']");
    this.company = page.locator("//input[@id='company']");
    this.address = page.locator("//input[@id='address1']");
    this.country = page.locator('#country');
    this.state = page.locator("//input[@id='state']");
    this.city = page.locator("//input[@id='city']");
    this.zipcode = page.locator("//input[@id='zipcode']");
    this.mobileNumber = page.locator("//input[@id='mobile_number']");
    this.createButton = page.getByText('Create Account');

    this.successfullRegistrationMsg = page.getByText('Congratulations! Your new account has been successfully created!');
    this.continueButton = page.locator("//a[contains(text(),'Continue')]");
  }

  async clickSignUp(regisCreds) {
    await this.clickWithScreenshot(this.loginandsignuplink, 'signup_link_clicked');
    await this.highlightAndFillField(this.name, regisCreds.name, 'register_name');
    await this.highlightAndFillField(this.emailAddress, regisCreds.emailAddress, 'register_email');
    await this.clickWithScreenshot(this.signupButton, 'signup_button_clicked');
  }

  async enterAccountInfo(regisCreds) {
    await this.Title.check();
    await this.highlightAndFillField(this.regpassword, regisCreds.regpassword, 'register_password');
  }

  async selectDay(regisCreds) {
    await this.daydropdown.selectOption(regisCreds.dayValue);
    await this.takeScreenshot('register_day_selected');
  }

  async selectMonth(regisCreds) {
    await this.monthdropdown.selectOption(regisCreds.monthValue);
    await this.takeScreenshot('register_month_selected');
  }

  async selectYear(regisCreds) {
    await this.yeardropdown.selectOption(regisCreds.yearValue);
    await this.takeScreenshot('register_year_selected');
  }

  async enterAddressInformation(regisCreds) {
    await this.highlightAndFillField(this.firstName, regisCreds.firstname, 'register_firstname');
    await this.highlightAndFillField(this.lastName, regisCreds.lastname, 'register_lastname');
    await this.highlightAndFillField(this.company, regisCreds.company, 'register_company');
    await this.highlightAndFillField(this.address, regisCreds.address, 'register_address');
    await this.country.selectOption(regisCreds.country);
    await this.takeScreenshot('register_country_selected');
    await this.highlightAndFillField(this.state, regisCreds.state, 'register_state');
    await this.highlightAndFillField(this.city, regisCreds.city, 'register_city');
    await this.highlightAndFillField(this.zipcode, regisCreds.zipcode, 'register_zipcode');
    await this.highlightAndFillField(this.mobileNumber, regisCreds.mobilenumber, 'register_mobilenumber');
    await this.clickWithScreenshot(this.createButton, 'create_account_clicked');
  }

  async clickContinue() {
    await this.clickWithScreenshot(this.continueButton, 'continue_clicked');
  }
}
