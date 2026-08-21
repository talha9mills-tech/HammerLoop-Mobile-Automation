/*************************************************************
 * Page Object: SignUpPage
 * Purpose: Handle Worker and Employer signup form actions.
 *************************************************************/

class SignUpPage {

    constructor(driver) {

        this.driver = driver;

        this.role = 'Worker';

        // NOTE: No longer caching checkbox elements here!
        // Cached elements can become stale when Flutter rebuilds widgets.
        // We'll use getter methods for fresh lookups instead.
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

        return this.driver.$(
            'android=new UiSelector().resourceId("full_name_field")'
        );
    }

    get companyNameInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("company_name_field")'
        );
    }

    get emailInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("email_field")'
        );
    }

    get phoneNumberInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("phone_number_field")'
        );
    }

    get passwordInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("password_field")'
        );
    }

    get confirmPasswordInput() {

        return this.driver.$(
            'android=new UiSelector().resourceId("confirm_password_field")'
        );
    }

    /**
     * Deliberately a fresh lookup on every call, not a cached property.
     * The button can be disposed/recreated by Flutter during the
     * keyboard-hide animation that happens right before we click it —
     * a stale handle keeps its OLD bounds.
     */
    getCreateAccountButton() {

        return this.driver.$(
            'android=new UiSelector().resourceId("create_account_button")'
        );
    }

    /* ========================================================= */
    /* Checkbox Getters - Fresh Lookups Each Time               */
    /* ========================================================= */

    getTermsCheckbox() {

        return this.driver.$(
            'android=new UiSelector().resourceId("terms_checkbox")'
        );
    }

    getSmsConsentCheckbox() {

        return this.driver.$(
            'android=new UiSelector().resourceId("sms_consent_checkbox")'
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

    async acceptTerms() {

        console.log('Accepting Terms...');
        
        // Get fresh checkbox
        const checkbox = this.getTermsCheckbox();
        
        // Check if already displayed
        if (await checkbox.isDisplayed()) {
            console.log('Terms checkbox is already displayed!');
            await this.clickCheckboxWithDebug(checkbox, 'Terms');
            return;
        }
        
        // If not displayed, scroll and click
        const scrolledCheckbox = await this.scrollCheckboxIntoView('terms_checkbox');
        await this.clickCheckboxWithDebug(scrolledCheckbox, 'Terms');
    }

    /* ========================================================= */
    /* SMS Consent                                               */
    /* ========================================================= */

    async acceptSmsConsent() {

        console.log('Accepting SMS Consent...');
        
        // Get fresh checkbox
        const checkbox = this.getSmsConsentCheckbox();
        
        // Check if already displayed
        if (await checkbox.isDisplayed()) {
            console.log('SMS Consent checkbox is already displayed!');
            await this.clickCheckboxWithDebug(checkbox, 'SMS Consent');
            return;
        }
        
        // If not displayed, scroll and click
        const scrolledCheckbox = await this.scrollCheckboxIntoView('sms_consent_checkbox');
        await this.clickCheckboxWithDebug(scrolledCheckbox, 'SMS Consent');
    }

    /* ========================================================= */
    /* Create Account - FIXED: No keyboard hide!                */
    /* ========================================================= */

    async tapCreateAccount() {

        console.log('Attempting to click Create Account button...');

        // IMPORTANT FIX: Do NOT hide keyboard here!
        // The keyboard hide action is causing navigation away from the form.
        // The keyboard should already be hidden after filling the last field.
        // If keyboard is still showing, the user can tap the button which will
        // automatically dismiss the keyboard and submit the form.

        // Get fresh button
        const button = this.getCreateAccountButton();

        // Wait for button with retry
        let found = false;
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                await button.waitForDisplayed({
                    timeout: 3000,
                    interval: 500
                });
                found = true;
                console.log(`Create Account button found on attempt ${attempt + 1}`);
                break;
            } catch (error) {
                console.log(`Create Account button not found, attempt ${attempt + 1}/5`);
                await this.driver.pause(500);
            }
        }

        if (!found) {
            // Check if we're still on the signup screen
            const isSignupScreen = await this.driver.$(
                'android=new UiSelector().textContains("Create Account")'
            ).isDisplayed();
            
            if (!isSignupScreen) {
                throw new Error('Navigated away from signup screen before clicking Create Account');
            }
            
            throw new Error('Create Account button not found after multiple attempts');
        }

        // Check if button is enabled
        const isEnabled = await button.isEnabled();
        console.log(`Create Account button enabled: ${isEnabled}`);

        if (!isEnabled) {
            throw new Error('Create Account button is displayed but disabled.');
        }

        // Click the button
        await button.click();
        console.log('Create Account button clicked successfully.');
    }

    /* ========================================================= */
    /* Helpers                                                   */
    /* ========================================================= */

    async fillInput(input, value) {

        try {

            await input.waitForDisplayed({
                timeout: 3000
            });

        } catch {

            /* Field is likely below the keyboard.
            Hide the keyboard and try again. */

            try {

                await this.driver.hideKeyboard();

            } catch {

                // Keyboard was already hidden.
            }

            await input.waitForDisplayed({
                timeout: 15000
            });
        }

        try {

            await input.scrollIntoView();

        } catch {

            // Ignore if the driver doesn't support it.
        }

        await input.click();

        await input.clearValue();

        await input.setValue(String(value));
    }

    /* ========================================================= */
    /* Click Checkbox with Debug                                 */
    /* ========================================================= */

    async clickCheckboxWithDebug(checkbox, checkboxName) {

        console.log(`Attempting to click ${checkboxName} checkbox...`);

        // Wait for it to be displayed
        await checkbox.waitForDisplayed({
            timeout: 15000
        });

        // Get state before click
        const beforeChecked = await checkbox.getAttribute('checked');
        console.log(`${checkboxName} checked state BEFORE click: ${beforeChecked}`);

        // Perform click
        await checkbox.click();
        console.log(`${checkboxName} checkbox clicked.`);

        // Wait a moment for state to update
        await this.driver.pause(500);

        // Get state after click
        const afterChecked = await checkbox.getAttribute('checked');
        console.log(`${checkboxName} checked state AFTER click: ${afterChecked}`);

        if (beforeChecked === afterChecked) {
            console.warn(`WARNING: ${checkboxName} checkbox state did NOT change!`);
            console.warn(`Before: ${beforeChecked}, After: ${afterChecked}`);
            
            // Try alternative click method - click by coordinates
            console.log(`Attempting alternative click by coordinates for ${checkboxName}...`);
            const location = await checkbox.getLocation();
            const size = await checkbox.getSize();
            const x = location.x + (size.width / 2);
            const y = location.y + (size.height / 2);
            
            await this.driver.touchAction({
                action: 'tap',
                x: x,
                y: y
            });
            
            await this.driver.pause(500);
            const afterCoordClick = await checkbox.getAttribute('checked');
            console.log(`${checkboxName} checked state AFTER coordinate click: ${afterCoordClick}`);
        }
    }

    /* ========================================================= */
    /* Scroll Checkbox Into View                                 */
    /* ========================================================= */

    async scrollCheckboxIntoView(resourceId) {

        console.log(`Scrolling to checkbox with resourceId: ${resourceId}`);

        const checkboxSelector =
            `new UiSelector().resourceId("${resourceId}")`;

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

        console.log(`Successfully scrolled to checkbox: ${resourceId}`);
        
        return checkbox;
    }

    /* ========================================================= */
    /* Backward Compatibility - Deprecated Methods              */
    /* ========================================================= */

    async acceptTermsAndConditions() {
        console.warn('acceptTermsAndConditions() is deprecated. Use acceptTerms() instead.');
        await this.acceptTerms();
    }

    async acceptPrivacyPolicy() {
        console.warn('acceptPrivacyPolicy() is deprecated. Use acceptSmsConsent() instead.');
        await this.acceptSmsConsent();
    }
}

module.exports = {
    SignUpPage
};