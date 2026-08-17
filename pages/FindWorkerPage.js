/*************************************************************
 * Page Object: Find Worker Page
 * Purpose: Handle searching workers and managing
 *          worker recommendations.
 *************************************************************/

class FindWorkerPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Search Input                                               */
        /* ========================================================= */

        this.inputField =
            driver.$(
                'android=new UiSelector().className("android.widget.EditText")'
            );

        /* ========================================================= */
        /* Worker Card                                                 */
        /* ========================================================= */

        this.workerCard =
            driver.$(
                'android=new UiSelector().descriptionContains("Worker")'
            );

        /* ========================================================= */
        /* Hire Me Button                                              */
        /* ========================================================= */

        this.hireMeButton =
            driver.$(
                'android=new UiSelector().description("Hire Me").instance(0)'
            );

        /* ========================================================= */
        /* Recommend Button                                            */
        /* ========================================================= */

        this.recommendButton =
            driver.$(
                'android=new UiSelector().resourceId("recommend_button")'
            );

        /* ========================================================= */
        /* Recommendation Submitted Message                            */
        /* ========================================================= */

        this.recommendationSubmittedMessage =
            driver.$(
                '~Recommendation Submitted'
            );

        /* ========================================================= */
        /* Recommendation Removed Message                              */
        /* ========================================================= */

        this.recommendationRemovedMessage =
            driver.$(
                '~Recommendation Removed'
            );
    }

    /* ========================================================= */
    /* Search Worker                                               */
    /* ========================================================= */

    async searchWorker(workerName) {

        await this.inputField.waitForDisplayed({
            timeout: 15000
        });

        await this.inputField.click();

        await this.inputField.clearValue();

        await this.inputField.setValue(
            workerName
        );
    }

    /* ========================================================= */
    /* Verify Worker Card                                         */
    /* ========================================================= */

    async verifyWorkerCard(workerName) {

        const workerCard =
            this.driver.$(
                `android=new UiSelector().descriptionContains("${workerName}")`
            );

        await workerCard.waitForDisplayed({
            timeout: 15000
        });

        console.log(
            `${workerName} worker card is visible.`
        );
    }

    /* ========================================================= */
    /* Tap Hire Me                                                */
    /* ========================================================= */

    async tapHireMe() {

        await this.hireMeButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.hireMeButton.click();

        console.log(
            'Hire Me button clicked.'
        );
    }

    /* ========================================================= */
    /* Tap Recommend                                              */
    /* ========================================================= */

    async tapRecommend() {

        await this.recommendButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.recommendButton.click();

        console.log(
            'Recommend button clicked.'
        );
    }

    /* ========================================================= */
    /* Verify Recommendation Submitted                            */
    /* ========================================================= */

    async verifyRecommendationSubmitted() {

        await this.recommendationSubmittedMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Recommendation Submitted message is visible.'
        );
    }

    /* ========================================================= */
    /* Verify Recommendation Removed                             */
    /* ========================================================= */

    async verifyRecommendationRemoved() {

        await this.recommendationRemovedMessage
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            'Recommendation Removed message is visible.'
        );
    }
}

module.exports = {
    FindWorkerPage
};