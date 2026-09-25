/*************************************************************
 * Page Object: WorkerProfilePage
 * Purpose: Handle Worker Profile Completion screen.
 *************************************************************/

class WorkerProfilePage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Complete Worker Card Banner                               */
        /* ========================================================= */

        // FIX (#3): matched on a contains() of the stable leading text
        // instead of the full banner copy (including the embedded \n).
        // A small wording/formatting change to the second sentence no
        // longer breaks this locator.
        this.completeWorkerCardBanner =
            this.driver.$(
                '//android.view.View[contains(@content-desc, "Complete your Worker Card")]'
            );

        /* ========================================================= */
        /* Trade / Location / About You / Hourly Rate                */
        /* ========================================================= */

        // FIX (#2), revised: instance-index locators turned out to be
        // unreliable even with a count guard - Appium Inspector showed
        // aboutYouInput and payRateInput BOTH resolving to instance(2),
        // proving this Flutter screen lazily renders only the currently
        // VISIBLE EditTexts into the accessibility tree. The index of a
        // given field therefore shifts with scroll position, so no
        // fixed index (or fixed total count) is ever reliable here.
        //
        // Instead, each field is now located relative to its own
        // on-screen label via XPath following::, and that label is
        // scrolled into view first. This works regardless of which
        // other fields are currently mounted/unmounted.
        //
        // Confirmed against Appium Inspector's App Source tree:
        //  - "Your Trade (select up to 3)" -> immediately followed by the trade EditText
        //  - "Your Location" -> immediately followed by the location EditText
        //  - "About You (Optional)" -> followed (after one description View) by the About You EditText
        //  - "My minimum rate" -> the label directly above the hourly rate EditText
        //    (anchored here instead of the higher-level "Desired Hourly Rate" section
        //    heading, so this stays correct even if another rate row/input is added
        //    under that section later)
        this.fieldAnchors = {
            trade: 'Trade',
            location: 'Location',
            aboutYou: 'About You',
            hourlyRate: 'My minimum rate'
        };

        /* ========================================================= */
        /* Save & Continue                                           */
        /* ========================================================= */

        this.saveAndContinueButton =
            this.driver.$(
                '~Save & Continue'
            );

        /* ========================================================= */
        /* Find Job                                                  */
        /* ========================================================= */

        this.findJobButton =
            this.driver.$(
                '~Find Job'
            );
    }

    /* ========================================================= */
    /* Keyboard / EditText Helpers                                */
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

        // Best-effort scroll - the label may already be on screen, or
        // the scrollable container may not need to move at all.
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
     * 'mobile: hideKeyboard'. Confirmed via logs on this exact screen:
     * 'mobile: hideKeyboard' took ~1.5s (far slower than a normal IME
     * hide) and fell back to a system BACK press, which popped the whole
     * "Complete Worker Card" route and dropped us onto the Worker
     * Dashboard - losing all the entered profile data. Same class of
     * issue as the Create Account button elsewhere in this suite.
     *
     * Instead, we tap a known non-interactive label already on screen
     * ("Desired Hourly Rate") to shift focus off the EditText. A normal
     * tap-elsewhere-on-screen closes the soft keyboard without ever
     * touching the back stack.
     */
    async hideKeyboardIfVisible() {

        try {

            if (await this.driver.isKeyboardShown()) {

                const neutralLabel =
                    this.driver.$(
                        'android=new UiSelector().descriptionContains("Desired Hourly Rate")'
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
    /* Open Worker Card                                           */
    /* ========================================================= */

    async tapCompleteWorkerCard() {

        await this.completeWorkerCardBanner.waitForDisplayed({
            timeout: 15000
        });

        await this.completeWorkerCardBanner.click();
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

        // FIX (#1): poll for the value to actually land instead of a
        // fixed sleep - fails fast if it never lands, doesn't waste
        // time waiting once it has.
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
            timeout: 15000
        });

        await locationSearchInput.click();

        await locationSearchInput.clearValue();

        await locationSearchInput.setValue(
            location
        );

        // FIX (#1): poll instead of a fixed sleep.
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

        // Logging only (#7) - some Flutter EditTexts don't reliably
        // expose their value via getText(), so this is best-effort and
        // wrapped so a logging failure can't fail the test.
        try {
            console.log(
                `Typed location: ${await locationSearchInput.getText()}`
            );
        } catch (logError) {
            // Ignore - purely cosmetic.
        }
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
    /* Enter Hourly Rate                                          */
    /* ========================================================= */

    async enterHourlyRate(rate) {

        const hourlyRateInput =
            await this.getFieldInput('hourlyRate');

        await hourlyRateInput.waitForDisplayed({
            timeout: 15000
        });

        await hourlyRateInput.waitForEnabled({
            timeout: 15000
        });

        await hourlyRateInput.click();

        await hourlyRateInput.clearValue();

        await hourlyRateInput.setValue(
            String(rate)
        );

        // FIX (#1): poll instead of a fixed sleep.
        await this.driver.waitUntil(
            async () => {
                const current = await hourlyRateInput.getText();
                return current && current.length > 0;
            },
            {
                timeout: 5000,
                interval: 200,
                timeoutMsg: `Hourly rate field never reflected the typed value: "${rate}"`
            }
        );
    }

    /* ========================================================= */
    /* Enter About You                                            */
    /* ========================================================= */

    async enterAboutYou(description) {

        const aboutYouInput =
            await this.getFieldInput('aboutYou');

        await aboutYouInput.waitForDisplayed({
            timeout: 15000
        });

        await aboutYouInput.waitForEnabled({
            timeout: 15000
        });

        await aboutYouInput.click();

        await aboutYouInput.clearValue();

        await aboutYouInput.setValue(
            description
        );

        // FIX (#1): poll instead of a fixed sleep.
        await this.driver.waitUntil(
            async () => {
                const current = await aboutYouInput.getText();
                return current && current.length > 0;
            },
            {
                timeout: 5000,
                interval: 200,
                timeoutMsg: 'About You field never reflected the typed value'
            }
        );

        console.log(
            `Entered About You description: ${description.substring(0, 50)}...`
        );
    }

    /* ========================================================= */
    /* Save Worker Profile                                        */
    /* ========================================================= */

    async tapSaveAndContinue() {

        // FIX (#4): the last field filled (About You / Hourly Rate) can
        // leave the keyboard open, which pushes Save & Continue off
        // screen or covers it - same class of issue as the Create
        // Account button. Hide it (only if actually shown) before
        // scrolling/tapping.
        await this.hideKeyboardIfVisible();

        // Sanity check: confirm we're still on the Worker Profile screen
        // before scrolling for the button. If a keyboard-dismiss (or
        // anything else) unexpectedly navigated away, fail fast with a
        // clear message instead of a generic "not displayed" timeout.
        const stillOnProfileScreen =
            await this.driver
                .$('android=new UiSelector().descriptionContains("Desired Hourly Rate")')
                .isExisting();

        if (!stillOnProfileScreen) {
            throw new Error(
                'No longer on the Worker Profile screen before tapping Save & Continue - ' +
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

        // FIX (#5): scrollable(true) targets whichever scrollable
        // container is actually on screen, instead of assuming the
        // scroll container is always an android.widget.ScrollView -
        // safer if the layout uses a nested/different scrollable.
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
    /* Is Worker Card Banner Visible                             */
    /* ========================================================= */

    async isWorkerCardBannerDisplayed() {

        try {

            return await this.completeWorkerCardBanner.isDisplayed();

        } catch {

            return false;
        }
    }

    /* ========================================================= */
    /* Is Find Job Button Visible                                */
    /* ========================================================= */

    async isFindJobButtonDisplayed() {

        // FIX (#6): now consistent with isWorkerCardBannerDisplayed() -
        // returns false on timeout/absence instead of throwing, so
        // callers can use both as plain conditional checks.
        try {

            await this.findJobButton.waitForDisplayed({
                timeout: 10000
            });

            return await this.findJobButton.isDisplayed();

        } catch {

            return false;
        }
    }
}

module.exports = {
    WorkerProfilePage
};