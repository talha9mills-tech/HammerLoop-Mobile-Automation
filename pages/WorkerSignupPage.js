/*************************************************************
 * Page Object: WorkerSignupPage
 * Purpose: Handle worker account creation form actions
 *************************************************************/
class WorkerSignupPage {

  constructor(driver) {

    this.driver = driver;

    this.fullNameInput =
      driver.$(
        'android=new UiSelector().className("android.widget.EditText").instance(0)'
      );

    this.emailInput =
      driver.$(
        'android=new UiSelector().className("android.widget.EditText").instance(1)'
      );

    this.phoneNumberInput =
      driver.$(
        'android=new UiSelector().className("android.widget.EditText").instance(2)'
      );

    this.passwordInput =
      driver.$(
        'android=new UiSelector().className("android.widget.EditText").instance(3)'
      );

    this.confirmPasswordInput =
      driver.$(
        'android=new UiSelector().className("android.widget.EditText").instance(4)'
      );

    this.termsAndConditionsCheckbox =
      driver.$(
        'android=new UiSelector().className("android.widget.CheckBox").instance(0)'
      );

    this.privacyPolicyCheckbox =
      driver.$(
        'android=new UiSelector().className("android.widget.CheckBox").instance(1)'
      );

    this.createAccountButton =
      driver.$(
        '~Create Account'
      );
  }

  /* ========================================================= */
  /* Enter Worker Full Name                                    */
  /* ========================================================= */
  async enterFullName(
    fullName
  ) {

    await this.fillInput(
      this.fullNameInput,
      fullName
    );
  }

  /* ========================================================= */
  /* Enter Worker Email Address                                */
  /* ========================================================= */
  async enterEmail(
    email
  ) {

    await this.fillInput(
      this.emailInput,
      email
    );
  }

  /* ========================================================= */
  /* Enter Worker Phone Number                                 */
  /* ========================================================= */
  async enterPhoneNumber(
    phoneNumber
  ) {

    await this.fillInput(
      this.phoneNumberInput,
      phoneNumber
    );
  }

  /* ========================================================= */
  /* Enter Worker Password                                     */
  /* ========================================================= */
  async enterPassword(
    password
  ) {

    await this.fillInput(
      this.passwordInput,
      password
    );
  }

  /* ========================================================= */
  /* Confirm Worker Password                                   */
  /* ========================================================= */
  async enterConfirmPassword(
    password
  ) {

    await this.fillInput(
      this.confirmPasswordInput,
      password
    );
  }

  /* ========================================================= */
  /* Accept Terms And Conditions                               */
  /* ========================================================= */
  async acceptTermsAndConditions() {

    await this.scrollCheckboxIntoView(
      0
    );

    await this.clickCheckbox(
      this.termsAndConditionsCheckbox,
      'Terms and Conditions'
    );
  }

  /* ========================================================= */
  /* Accept Privacy Policy                                     */
  /* ========================================================= */
  async acceptPrivacyPolicy() {

    await this.scrollCheckboxIntoView(
      1
    );

    await this.clickCheckbox(
      this.privacyPolicyCheckbox,
      'Privacy Policy'
    );
  }

  /* ========================================================= */
  /* Tap Create Account Button                                 */
  /* ========================================================= */
  async tapCreateAccount() {

    await this.scrollCreateAccountButtonIntoView();

    await this.createAccountButton
      .waitForDisplayed({
        timeout: 15000
      });

    await this.createAccountButton.click();
  }

  /* ========================================================= */
  /* Fill Input Field                                          */
  /* ========================================================= */
  async fillInput(
    input,
    value
  ) {

    await input.waitForDisplayed({
      timeout: 15000
    });

    await input.click();

    await input.setValue(
      value
    );
  }

  /* ========================================================= */
  /* Click Checkbox                                            */
  /* ========================================================= */
  async clickCheckbox(
    checkbox,
    checkboxName
  ) {

    await checkbox.waitForDisplayed({
      timeout: 15000
    });

    await checkbox.click();

    console.log(
      `${checkboxName} checkbox clicked.`
    );
  }

  /* ========================================================= */
  /* Scroll Checkbox Into View                                 */
  /* ========================================================= */
  async scrollCheckboxIntoView(
    instanceNumber
  ) {

    const checkboxSelector =
      'new UiSelector()' +
      '.className("android.widget.CheckBox")' +
      `.instance(${instanceNumber})`;

    const scrollableSelector =
      'new UiScrollable(' +
      'new UiSelector()' +
      '.className("android.widget.ScrollView")' +
      ')' +
      `.scrollIntoView(${checkboxSelector})`;

    const checkbox =
      this.driver.$(
        `android=${scrollableSelector}`
      );

    await checkbox.waitForDisplayed({
      timeout: 15000
    });
  }

  /* ========================================================= */
  /* Scroll Create Account Button Into View                    */
  /* ========================================================= */
  async scrollCreateAccountButtonIntoView() {

    const scrollableSelector =
      'new UiScrollable(' +
      'new UiSelector()' +
      '.className("android.widget.ScrollView")' +
      ')' +
      '.scrollIntoView(' +
      'new UiSelector()' +
      '.description("Create Account")' +
      ')';

    const createAccountButton =
      this.driver.$(
        `android=${scrollableSelector}`
      );

    await createAccountButton.waitForDisplayed({
      timeout: 15000
    });
  }
}

module.exports = {
  WorkerSignupPage
};