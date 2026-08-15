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

        /* ========================================================= */
        /* Applicant Action — Success Toasts                         */
        /* ========================================================= */

        this.acceptSuccessToast =
            driver.$('~Application accepted');

        this.rejectSuccessToast =
            driver.$('~Application rejected');

        this.onHoldSuccessToast =
            driver.$('~Application put on hold');
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

    /**
     * Matches on a CONTAINS basis because the identity node's content-desc
     * varies by avatar type — e.g. "JR\nJulian Rogers" (initials avatar)
     * vs. "Levi Reed" (icon avatar). An exact accessibility-id match would
     * miss the former.
     */
    getApplicant(applicantName, occurrence = 0) {

        return this.driver.$$(
            `android=new UiSelector().descriptionContains("${applicantName}")`
        )[occurrence];
    }

    /**
     * Resolves which row (0-based) an applicant occupies by matching the
     * Y position of their name/avatar node against the Y position of each
     * "accept_application_button" instance — the buttons and the identity
     * node don't share a predictable ancestor depth (it varies by avatar
     * type), but they always render at the same row height.
     *
     * `occurrence` picks which match to use when the same name appears
     * more than once on screen (e.g. across two job rows).
     */
    async getApplicantRowIndex(applicantName, occurrence = 0) {

        const nameElements = await this.driver.$$(
            `android=new UiSelector().descriptionContains("${applicantName}")`
        );

        if (nameElements.length === 0) {
            throw new Error(
                `No applicant row found for "${applicantName}".`
            );
        }

        if (occurrence >= nameElements.length) {
            throw new Error(
                `Requested occurrence ${occurrence} for "${applicantName}", but only ${nameElements.length} match(es) found.`
            );
        }

        const nameLocation =
            await nameElements[occurrence].getLocation();

        const acceptButtons = await this.driver.$$(
            'android=new UiSelector().resourceId("accept_application_button")'
        );

        let bestIndex = 0;
        let bestDiff = Infinity;

        for (let i = 0; i < acceptButtons.length; i++) {

            const loc = await acceptButtons[i].getLocation();
            const diff = Math.abs(loc.y - nameLocation.y);

            if (diff < bestDiff) {
                bestDiff = diff;
                bestIndex = i;
            }
        }

        return bestIndex;
    }

    getActionButtonByRowIndex(resourceId, rowIndex) {

        return this.driver.$(
            `android=new UiSelector().resourceId("${resourceId}").instance(${rowIndex})`
        );
    }

    /* ========================================================= */
    /* Notification Actions                                      */
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

    async verifyApplicant(applicantName, occurrence = 0) {

        const applicant =
            this.getApplicant(applicantName, occurrence);

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

    async tapAccept(applicantName, occurrence = 0) {

        const rowIndex =
            await this.getApplicantRowIndex(applicantName, occurrence);

        const acceptButton =
            this.getActionButtonByRowIndex(
                'accept_application_button',
                rowIndex
            );

        await acceptButton.waitForDisplayed({
            timeout: 15000
        });

        await acceptButton.click();

        await this.acceptSuccessToast.waitForDisplayed({
            timeout: 15000
        });

        if (!await this.acceptSuccessToast.isDisplayed()) {

            throw new Error(
                `Accept success toast ("Application accepted") was not displayed for ${applicantName}.`
            );
        }

        console.log(
            `${applicantName} accepted successfully.`
        );
    }

    async tapReject(applicantName, occurrence = 0) {

        const rowIndex =
            await this.getApplicantRowIndex(applicantName, occurrence);

        const rejectButton =
            this.getActionButtonByRowIndex(
                'reject_application_button',
                rowIndex
            );

        await rejectButton.waitForDisplayed({
            timeout: 15000
        });

        await rejectButton.click();

        await this.rejectSuccessToast.waitForDisplayed({
            timeout: 15000
        });

        if (!await this.rejectSuccessToast.isDisplayed()) {

            throw new Error(
                `Reject success toast ("Application rejected") was not displayed for ${applicantName}.`
            );
        }

        console.log(
            `${applicantName} rejected successfully.`
        );
    }

    async tapOnHold(applicantName, occurrence = 0) {

        const rowIndex =
            await this.getApplicantRowIndex(applicantName, occurrence);

        const onHoldButton =
            this.getActionButtonByRowIndex(
                'on_hold_application_button',
                rowIndex
            );

        await onHoldButton.waitForDisplayed({
            timeout: 15000
        });

        await onHoldButton.click();

        await this.onHoldSuccessToast.waitForDisplayed({
            timeout: 15000
        });

        if (!await this.onHoldSuccessToast.isDisplayed()) {

            throw new Error(
                `On Hold success toast ("Application put on hold") was not displayed for ${applicantName}.`
            );
        }

        console.log(
            `${applicantName} moved to On Hold successfully.`
        );
    }
}

module.exports = {
    EmployerNotificationsPage
};