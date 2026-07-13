/*************************************************************
 * Page Object: SignUpPage
 * Purpose: Handle Worker and Employer signup form actions.
 *************************************************************/

class SignUpPage {

    constructor(driver) {

        this.driver = driver;

        this.role = 'Worker';

        this.termsAndConditionsCheckbox =
            driver.$(
                'android=new UiSelector().className("android.widget.CheckBox").instance(0)'
            );

        this.privacyPolicyCheckbox =
            driver.$(
                'android=new UiSelector().className("android.widget.CheckBox").instance(1)'
            );

        this.createAccountButton =
            driver.$('~Create Account');
    }

    /* ========================================================= */
    /* Role                                                      */
    /* ========================================================= */

    setRole(role) {

        this.role = role;
    }

    getInput(index) {

        return this.driver.$(
            `android=new UiSelector().className("android.widget.EditText").instance(${index})`
        );
    }

    get fullNameInput() {

        return this.getInput(0);
    }

    get companyNameInput() {

        return this.getInput(1);
    }

    get emailInput() {

        return this.getInput(
            this.role === 'Employer'
                ? 2
                : 1
        );
    }

    get phoneNumberInput() {

        return this.getInput(
            this.role === 'Employer'
                ? 3
                : 2
        );
    }

    get passwordInput() {

        return this.getInput(
            this.role === 'Employer'
                ? 4
                : 3
        );
    }

    get confirmPasswordInput() {

        return this.getInput(
            this.role === 'Employer'
                ? 5
                : 4
        );
    }

    /* ========================================================= */
    /* Full Name                                                 */
    /* ========================================================= */

    async enterFullName(fullName) {

        await this.fillInput(
            this.fullNameInput,
            fullName
        );
    }

    /* ========================================================= */
    /* Company Name                                              */
    /* ========================================================= */

    async enterCompanyName(companyName) {

        await this.fillInput(
            this.companyNameInput,
            companyName
        );
    }

    /* ========================================================= */
    /* Email                                                     */
    /* ========================================================= */

    async enterEmail(email) {

        await this.fillInput(
            this.emailInput,
            email
        );
    }

    /* ========================================================= */
    /* Phone                                                     */
    /* ========================================================= */

    async enterPhoneNumber(phoneNumber) {

        await this.fillInput(
            this.phoneNumberInput,
            phoneNumber
        );
    }

    /* ========================================================= */
    /* Password                                                  */
    /* ========================================================= */

    async enterPassword(password) {

        await this.fillInput(
            this.passwordInput,
            password
        );
    }

    /* ========================================================= */
    /* Confirm Password                                          */
    /* ========================================================= */

    async enterConfirmPassword(password) {

        await this.fillInput(
            this.confirmPasswordInput,
            password
        );
    }

    /* ========================================================= */
    /* Terms                                                     */
    /* ========================================================= */

    async acceptTermsAndConditions() {

        await this.scrollCheckboxIntoView(0);

        await this.clickCheckbox(
            this.termsAndConditionsCheckbox,
            'Terms and Conditions'
        );
    }

    /* ========================================================= */
    /* Privacy                                                   */
    /* ========================================================= */

    async acceptPrivacyPolicy() {

        await this.scrollCheckboxIntoView(1);

        await this.clickCheckbox(
            this.privacyPolicyCheckbox,
            'Privacy Policy'
        );
    }

    /* ========================================================= */
    /* Create Account                                            */
    /* ========================================================= */

    async tapCreateAccount() {

        await this.scrollCreateAccountButtonIntoView();

        await this.createAccountButton.waitForDisplayed({
            timeout: 15000
        });

        await this.createAccountButton.click();
    }

    /* ========================================================= */
    /* Helpers                                                   */
    /* ========================================================= */

    async fillInput(input, value) {

        await input.waitForDisplayed({
            timeout: 15000
        });

        await input.click();

        await input.clearValue();

        await input.setValue(value);
    }

    async clickCheckbox(checkbox, checkboxName) {

        await checkbox.waitForDisplayed({
            timeout: 15000
        });

        await checkbox.click();

        console.log(
            `${checkboxName} checkbox clicked.`
        );
    }

    async scrollCheckboxIntoView(instanceNumber) {

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

        const button =
            this.driver.$(
                `android=${scrollableSelector}`
            );

        await button.waitForDisplayed({
            timeout: 15000
        });
    }
}

module.exports = {
    SignUpPage
};