/*************************************************************
 * Page Object: EmployerNotificationsPage
 * Purpose: Handle Employer notification actions.
 *************************************************************/

class EmployerNotificationsPage {

    constructor(driver) {

        this.driver = driver;

        /* ========================================================= */
        /* Notification Elements                                     */
        /* ========================================================= */

        this.notificationBellButton =
            driver.$(
                'android=new UiSelector().className("android.widget.Button").instance(0)'
            );
    }

    /* ========================================================= */
    /* Dynamic Getters                                            */
    /* ========================================================= */

    getJobApplicationNotification(jobTitle) {

        return this.driver.$(

            `android=new UiSelector().descriptionContains("Levi Reed applied for ${jobTitle}")`

        );
    }

    getJobTitle(jobTitle) {

        return this.driver.$(

            `~${jobTitle}`

        );
    }

    getApplicant(applicantName) {

        return this.driver.$(

            `~${applicantName}`

        );
    }

    getApplicantActionButton(
        applicantName,
        actionIndex
    ) {

        return this.driver.$(

            `//android.view.View[@content-desc="${applicantName}"]/android.view.View[${actionIndex}]`

        );
    }

    /* ========================================================= */
    /* Notification Actions                                       */
    /* ========================================================= */

    async tapNotificationBell() {

        await this.notificationBellButton.waitForDisplayed({
            timeout: 15000
        });

        await this.notificationBellButton.click();
    }

    async openJobApplicationNotification(jobTitle) {

        const notification =
            this.getJobApplicationNotification(jobTitle);

        await notification.waitForDisplayed({
            timeout: 15000
        });

        await notification.click();
    }

    /* ========================================================= */
    /* Verification                                               */
    /* ========================================================= */

    async verifyJobTitle(jobTitle) {

        const title =
            this.getJobTitle(jobTitle);

        await title.waitForDisplayed({
            timeout: 15000
        });

        if (!await title.isDisplayed()) {

            throw new Error(
                `Job title "${jobTitle}" was not displayed.`
            );
        }

        console.log(
            `Verified job title: ${jobTitle}`
        );
    }

    async verifyApplicant(applicantName) {

        const applicant =
            this.getApplicant(applicantName);

        await applicant.waitForDisplayed({
            timeout: 15000
        });

        if (!await applicant.isDisplayed()) {

            throw new Error(
                `Applicant "${applicantName}" was not displayed.`
            );
        }

        console.log(
            `Verified applicant: ${applicantName}`
        );
    }

    /* ========================================================= */
    /* Applicant Actions                                          */
    /* ========================================================= */

    async tapAccept(applicantName) {

        const acceptButton =
            this.getApplicantActionButton(
                applicantName,
                1
            );

        await acceptButton.waitForDisplayed({
            timeout: 15000
        });

        await acceptButton.click();

        console.log(
            `${applicantName} accepted successfully.`
        );
    }

    async tapReject(applicantName) {

        const rejectButton =
            this.getApplicantActionButton(
                applicantName,
                2
            );

        await rejectButton.waitForDisplayed({
            timeout: 15000
        });

        await rejectButton.click();

        console.log(
            `${applicantName} rejected successfully.`
        );
    }

    async tapOnHold(applicantName) {

        const onHoldButton =
            this.getApplicantActionButton(
                applicantName,
                3
            );

        await onHoldButton.waitForDisplayed({
            timeout: 15000
        });

        await onHoldButton.click();

        console.log(
            `${applicantName} moved to On Hold successfully.`
        );
    }
}

module.exports = {
    EmployerNotificationsPage
};