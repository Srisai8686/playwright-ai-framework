import { BasePage } from './BasePage.js';
//import { HomePage } from './homePage.js';

export class ProductPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} [testInfo]
   */
   constructor(page, testInfo) {
    super(page, testInfo, 'product-list');

     this.validateProductPage = page.locator("//h2[contains(text(),'All Products')]");

     //category
     this.womenCategory = page.locator("//a[@href='#Women']");
     this.menCategory = page.locator("//a[@href='#Men']");
     this.kidCategory = page.locator("//a[@href='#Kids']");
     this.addedText = page.locator("//h4[contains(text(),'Added!')]");
     this.productAddConfirmation = page.locator("//p[contains(text(),'Your product has been added to cart.')]");
     this.viewCartLink = page.locator("//a[@href='/view_cart']/u");
     this.continueButton = page.locator("//button[contains(text(),'Continue Shopping')]");




   }

   //div[@id='Women']/div/ul/li/a[contains(text(),'Saree')]
   //div[@id='Men']/div/ul/li/a[contains(text(),'Tshirts')]

   async selectSubCategory(mainCategory,subCategory){
    if(typeof mainCategory!=='string'||typeof subCategory!=='string'){
      throw new Error('Both mainCategory and subCategory should be string type');

    }
     //mainCategory dropdown
     const mainCategory = this.page.locator(`//a[@href='#${mainCategory}']`);
     await this.clickWithScreenshot(mainCategoryLocator, `open_${mainCategory}_category`);
 
     //dynamic subCategory
     const subCategory = this.page.locator(`//div[@id='${mainCategory}']//a[contains(text(),'${subCategory}')]`);
     await this.clickWithScreenshot(subCategoryLocator, `subcategory_${subCategory.toLowerCase()}`);


   
    
   }
   async selectMainCategory(category) {
    let categoryLocator;
    switch (category.toLowerCase()) {
      case 'women': categoryLocator = this.womenCategory; break;
      case 'men': categoryLocator = this.menCategory; break;
      case 'kids': categoryLocator = this.kidCategory; break;
      default: throw new Error(`❌ Unknown category: ${category}`);
    }
    await this.clickWithScreenshot(categoryLocator, `main_category_${category.toLowerCase()}`);
  }

    // Get all product names visible on the page
    async getAllProductNames() {
      const productLocators = this.page.locator("//div[@class='productinfo text-center']/p");
      const count = await productLocators.count();
      const names = [];
  
      for (let i = 0; i < count; i++) {
        names.push((await productLocators.nth(i).innerText()).trim());
      }
  
      // Optional screenshot for verification
      await this.takeScreenshot('all_products_list');
      return names;
    }
  
    // Hover over product and add to cart
    async addProductToCart(productName) {
      const productLocators = this.page.locator("//div[@class='product-image-wrapper']");
      const productCount = await productLocators.count();
  
      for (let i = 0; i < productCount; i++) {
        const nameLocator = productLocators.nth(i).locator(".productinfo p");
        const nameText = (await nameLocator.innerText()).trim();
  
        if (nameText === productName) {
          // Hover and click Add to Cart
          await productLocators.nth(i).hover();
          const addToCartBtn = productLocators.nth(i).locator("a[title='Add to cart']");
          await addToCartBtn.click();
  
          await this.takeScreenshot(`add_to_cart_${productName.replace(/\s+/g,'_').toLowerCase()}`);
          return; // exit after adding
        }
      }
  
      throw new Error(`❌ Product not found: ${productName}`);
    }
  
    // Full flow: select subcategory, verify products, add to cart dynamically
    async selectAndAddProduct(mainCategory, subCategory, productName) {
      await this.selectSubCategory(mainCategory, subCategory);
  
      const allProducts = await this.getAllProductNames();
      console.log(allProducts);
  
      if (allProducts.includes(productName)) {
        await this.addProductToCart(productName);
      } else {
        throw new Error(`❌ Product "${productName}" not found in "${subCategory}"`);
      }
    }

    //div[@class="productinfo text-center"]/p[contains(text(),'Blue Top')]/../../following-sibling::div/ul/li/a
    
    async clickViewProduct(productName){
      if (!productName) {
        throw new Error('❌ Product name is required for clicking View Product');
      }
    
      const viewProductLink = this.page.locator(
        `//div[@class='productinfo text-center']/p[contains(text(),'${productName}')]/../../following-sibling::div/ul/li/a`
      );
    
      await this.clickWithScreenshot(
        viewProductLink,
        `clicked_on_viewproduct_${productName.toLowerCase().replace(/\s+/g, '_')}`
      );

    }

  }