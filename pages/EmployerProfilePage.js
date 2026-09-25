/*************************************************************
 * Page Object: EmployerProfilePage
 * Purpose: Handle Employer Profile Completion screen.
 *************************************************************/

class EmployerProfilePage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Complete Employer Card Banner                            */
        /* ========================================================= */

        // Matched on a contains() of the stable leading text instead of
        // the full banner copy (including the embedded \n) - a small
        // wording/formatting change to the second sentence no longer
        // breaks this locator.
        this.completeEmployerCardBanner =
            this.driver.$(
                '//android.view.View[contains(@content-desc, "Complete your Employer Card")]'
            );

        /* ========================================================= */
        /* Trades / Company Location / About Your Company            */
        /* ========================================================= */

        // Same lesson learned on the Worker Profile screen: this Flutter
        // screen lazily renders only the currently VISIBLE EditTexts
        // into the accessibility tree, so a fixed instance() index (or a
        // fixed total EditText count) drifts with scroll position and
        // can silently fill the wrong field.
        //
        // Each field is instead located relative to its own on-screen
        // label via XPath following::, with the label scrolled into
        // view first. Confirmed against the Appium Inspector tree:
        //  - "Trades You Hire For"  -> immediately followed by the trade EditText
        //  - "Company Location"     -> immediately followed by the location EditText
        //  - "About Your Company"   -> followed (after one description View)
        //                              by the About Your Company EditText
        this.fieldAnchors = {
            trade: 'Trades You Hire For',
            location: 'Company Location',
            aboutCompany: 'About Your Company'
        };

        /* ========================================================= */
        /* Save & Continue                                           */
        /* ========================================================= */

        this.saveAndContinueButton =
            this.driver.$(
                '~Save & Continue'
            );

        /* ========================================================= */
        /* Add Job Button                                            */
        /* ========================================================= */

        this.addJobButton =
            this.driver.$(
                '~Add Job'
            );
    }

    /* ========================================================= */
    /* Field / Keyboard Helpers                                   */
    /* ========================================================= */

    /**
     * Resolves a field's EditText relative to its own label, instead of
     * a fixed instance index. Scrolls the label into view first (best
     * effort - ignored if it's already visible or the container isn't
     * scrollable in that state), then walks forward in document order
     * to the next EditText. Since the label and its input are rendered
     * together (they scroll in/out as a pair), this stays correct
     * regardless of which other fields are currently mounted.
     */
    async getFieldInput(fieldName) {

        const anchorText = this.fieldAnchors[fieldName];

        if (!anchorText) {
            throw new Error(`No label anchor configured for field "${fieldName}".`);
        }

        try {
            const scrollTarget = this.driver.$(
                'android=new UiScrollable(new UiSelector().scrollable(true))' +
                `.scrollIntoView(new UiSelector().descriptionContains("${anchorText}"))`
            );

            await scrollTarget.waitForExist({ timeout: 5000 });
        } catch (scrollError) {
            // Not scrollable right now, or already visible - continue.
        }

        const input = this.driver.$(
            `//*[contains(@content-desc, "${anchorText}")]/following::android.widget.EditText[1]`
        );

        try {
            await input.waitForExist({ timeout: 10000 });
        } catch (existError) {
            throw new Error(
                `Could not find an EditText after the "${anchorText}" label for field ` +
                `"${fieldName}". Check that fieldAnchors["${fieldName}"] matches the actual ` +
                `label text/content-desc on this screen (verify with Appium Inspector).`
            );
        }

        return input;
    }

    /**
     * Guarded keyboard hide.
     *
     * IMPORTANT: this deliberately does NOT call driver.hideKeyboard() or
     * 'mobile: hideKeyboard'. On the equivalent Worker Profile screen,
     * 'mobile: hideKeyboard' was confirmed (via logs) to fall back to a
     * system BACK press, which popped the whole "Complete ... Card"
     * route and dropped the user onto the Dashboard - losing all
     * entered profile data. Same risk applies here.
     *
     * Instead, we tap a known non-interactive label already on screen
     * ("About Your Company") to shift focus off the EditText. A normal
     * tap-elsewhere-on-screen closes the soft keyboard without ever
     * touching the back stack.
     */
    async hideKeyboardIfVisible() {

        try {

            if (await this.driver.isKeyboardShown()) {

                const neutralLabel =
                    this.driver.$(
                        'android=new UiSelector().descriptionContains("About Your Company")'
                    );

                if (await neutralLabel.isExisting()) {

                    await neutralLabel.click();

                } else {

                    // Label not on screen right now - fall back to the
                    // keyboard-specific hide as a last resort, accepting
                    // the small risk noted above rather than getting stuck.
                    try {
                        await this.driver.execute('mobile: hideKeyboard');
                    } catch (mobileHideError) {
                        await this.driver.hideKeyboard();
                    }
                }

                await this.driver.pause(300);
            }

        } catch (kbError) {
            // isKeyboardShown()/tap/hideKeyboard() not supported or failed - ignore.
        }
    }

    /* ========================================================= */
    /* Open Employer Card                                         */
    /* ========================================================= */

    async tapCompleteEmployerCard() {

        await this.completeEmployerCardBanner.waitForDisplayed({
            timeout: 15000
        });

        await this.completeEmployerCardBanner.click();
    }

    /* ========================================================= */
    /* Search Trade                                               */
    /* ========================================================= */

    async searchTrade(trade) {

        const tradeSearchInput =
            await this.getFieldInput('trade');

        await tradeSearchInput.waitForDisplayed({
            timeout: 10000
        });

        await tradeSearchInput.click();

        await tradeSearchInput.clearValue();

        await tradeSearchInput.setValue(
            trade
        );

        // Poll for the value to actually land instead of a fixed sleep -
        // fails fast if it never lands, doesn't waste time once it has.
        await this.driver.waitUntil(
            async () => {
                const current = await tradeSearchInput.getText();
                return current && current.length > 0;
            },
            {
                timeout: 5000,
                interval: 200,
                timeoutMsg: `Trade search field never reflected the typed value: "${trade}"`
            }
        );
    }

    /* ========================================================= */
    /* Select Trade                                               */
    /* ========================================================= */

    async selectTrade(trade) {

        const tradeOption =
            this.driver.$(
                `~${trade}`
            );

        await tradeOption.waitForDisplayed({
            timeout: 10000
        });

        await tradeOption.click();

        // Confirm the selection actually registered, instead of assuming
        // the click landed.
        const selectedTrade =
            this.driver.$(
                `//android.view.View[@content-desc="${trade}"]`
            );

        await selectedTrade.waitForDisplayed({
            timeout: 10000
        });
    }

    /* ========================================================= */
    /* Search Location                                            */
    /* ========================================================= */

    async searchLocation(location) {

        const locationSearchInput =
            await this.getFieldInput('location');

        await locationSearchInput.waitForDisplayed({
            timeout: 10000
        });

        await locationSearchInput.click();

        await locationSearchInput.clearValue();

        await locationSearchInput.setValue(
            location
        );

        await this.driver.waitUntil(
            async () => {
                const current = await locationSearchInput.getText();
                return current && current.length > 0;
            },
            {
                timeout: 5000,
                interval: 200,
                timeoutMsg: `Location search field never reflected the typed value: "${location}"`
            }
        );
    }

    /* ========================================================= */
    /* Select First Location Suggestion                           */
    /* ========================================================= */

    async selectFirstLocationSuggestion(location) {

        const suggestion =
            this.driver.$(
                `android=new UiSelector().descriptionContains("${location}")`
            );

        await suggestion.waitForExist({
            timeout: 15000
        });

        await suggestion.waitForDisplayed({
            timeout: 15000
        });

        await suggestion.click();
    }

    /* ========================================================= */
    /* Enter About Your Company                                  */
    /* ========================================================= */

    async enterAboutYourCompany(description) {

        const aboutYourCompanyInput =
            await this.getFieldInput('aboutCompany');

        await aboutYourCompanyInput.waitForDisplayed({
            timeout: 15000
        });

        await aboutYourCompanyInput.click();

        await aboutYourCompanyInput.clearValue();

        await aboutYourCompanyInput.setValue(
            description
        );

        // Poll instead of a fixed sleep.
        await this.driver.waitUntil(
            async () => {
                const current = await aboutYourCompanyInput.getText();
                return current && current.length > 0;
            },
            {
                timeout: 5000,
                interval: 200,
                timeoutMsg: 'About Your Company field never reflected the typed value'
            }
        );

        console.log(
            `Entered About Your Company: ${description.substring(0, 50)}...`
        );
    }

    /* ========================================================= */
    /* Save Employer Profile                                      */
    /* ========================================================= */

    async tapSaveAndContinue() {

        // The last field filled (About Your Company) can leave the
        // keyboard open, which pushes Save & Continue off screen or
        // covers it. Hide it (only if actually shown, via a safe
        // neutral tap - see hideKeyboardIfVisible) before scrolling/tapping.
        await this.hideKeyboardIfVisible();

        // Sanity check: confirm we're still on the Employer Profile
        // screen before scrolling for the button. If a keyboard-dismiss
        // (or anything else) unexpectedly navigated away, fail fast with
        // a clear message instead of a generic "not displayed" timeout.
        const stillOnProfileScreen =
            await this.driver
                .$('android=new UiSelector().descriptionContains("About Your Company")')
                .isExisting();

        if (!stillOnProfileScreen) {
            throw new Error(
                'No longer on the Employer Profile screen before tapping Save & Continue - ' +
                'looks like the screen was navigated away from unexpectedly (e.g. during keyboard dismissal).'
            );
        }

        await this.scrollToSaveAndContinue();

        await this.saveAndContinueButton.waitForDisplayed({
            timeout: 10000
        });

        await this.saveAndContinueButton.click();
    }

    /* ========================================================= */
    /* Scroll To Save & Continue                                  */
    /* ========================================================= */

    async scrollToSaveAndContinue() {

        // scrollable(true) targets whichever scrollable container is
        // actually on screen, instead of assuming it's always an
        // android.widget.ScrollView.
        const scrollableSelector =
            'new UiScrollable(' +
            'new UiSelector()' +
            '.scrollable(true)' +
            ')' +
            '.scrollIntoView(' +
            'new UiSelector()' +
            '.description("Save & Continue")' +
            ')';

        const button =
            this.driver.$(
                `android=${scrollableSelector}`
            );

        await button.waitForDisplayed({
            timeout: 10000
        });
    }

    /* ========================================================= */
    /* Is Employer Card Banner Displayed                          */
    /* ========================================================= */

    async isEmployerCardBannerDisplayed() {

        try {

            return await this.completeEmployerCardBanner.isDisplayed();

        } catch {

            return false;
        }
    }

    /* ========================================================= */
    /* Is Add Job Button Displayed                                */
    /* ========================================================= */

    async isAddJobButtonDisplayed() {

        // Now consistent with isEmployerCardBannerDisplayed() - returns
        // false on timeout/absence instead of throwing, so callers can
        // use both as plain conditional checks.
        try {

            await this.addJobButton.waitForDisplayed({
                timeout: 10000
            });

            return await this.addJobButton.isDisplayed();

        } catch {

            return false;
        }
    }
}

module.exports = {
    EmployerProfilePage
};