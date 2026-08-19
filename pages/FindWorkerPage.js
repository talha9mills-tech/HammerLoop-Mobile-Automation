/*************************************************************
 * Page Object: Find Worker Page
 * Purpose: Handle worker search, worker selection,
 *          hiring, recommendations, and worker profile
 *          actions.
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

        /* ========================================================= */
        /* Message Me / Chat Button                                    */
        /* ========================================================= */

        this.messageMeButton =
            driver.$(
                'android=new UiSelector().resourceId("chat_button")'
            );
    }

    /* ========================================================= */
    /* Search Worker                                               */
    /* ========================================================= */

    async searchWorker(workerName) {

        await this.inputField
            .waitForDisplayed({
                timeout: 15000
            });

        await this.inputField.click();

        await this.inputField.clearValue();

        await this.inputField.setValue(
            workerName
        );

        // Add a small delay to let search results populate
        await this.driver.pause(2000);

        console.log(
            `Searching for worker: ${workerName}`
        );
    }

    /* ========================================================= */
    /* Get Worker Card                                            */
    /* ========================================================= */

    getWorkerCard(workerName) {

        return this.driver.$(
            `android=new UiSelector().descriptionContains("${workerName}")`
        );
    }

    /* ========================================================= */
    /* Get Hire Me Button for Specific Worker                     */
    /* ========================================================= */

    getHireMeButtonForWorker(workerName) {
        // First find the worker card
        const workerCard = this.getWorkerCard(workerName);
        
        // Then find the Hire Me button within that card
        // Assuming the Hire Me button is a child element of the worker card
        return workerCard.$(
            'android=new UiSelector().description("Hire Me")'
        );
    }

    /* ========================================================= */
    /* Verify Worker Card                                         */
    /* ========================================================= */

    async verifyWorkerCard(workerName) {

        const workerCard =
            this.getWorkerCard(workerName);

        await workerCard
            .waitForDisplayed({
                timeout: 15000
            });

        console.log(
            `${workerName} worker card is visible.`
        );
    }

    /* ========================================================= */
    /* Select Worker Card                                         */
    /* ========================================================= */

    async selectWorker(workerName) {

        const workerCard =
            this.getWorkerCard(workerName);

        await workerCard
            .waitForDisplayed({
                timeout: 15000
            });

        await workerCard.click();

        console.log(
            `${workerName} worker card selected.`
        );
    }

    /* ========================================================= */
    /* Tap Hire Me for Specific Worker                           */
    /* ========================================================= */

    async tapHireMeForWorker(workerName) {
        // Wait for the worker card to be displayed first
        await this.verifyWorkerCard(workerName);
        
        // Get the specific Hire Me button for this worker
        const hireMeButton = this.getHireMeButtonForWorker(workerName);
        
        // Wait for the button to be displayed and clickable
        await hireMeButton.waitForDisplayed({
            timeout: 10000
        });
        
        await hireMeButton.click();

        console.log(
            `Hire Me button clicked for ${workerName}.`
        );
    }

    /* ========================================================= */
    /* Tap Message Me                                            */
    /* ========================================================= */

    async tapMessageMe() {

        await this.messageMeButton
            .waitForDisplayed({
                timeout: 15000
            });

        await this.messageMeButton.click();

        console.log(
            'Message Me button clicked.'
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