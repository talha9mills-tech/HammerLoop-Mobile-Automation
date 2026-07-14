/*************************************************************
 * Flow: CreateJobFlow
 * Purpose: Login as Employer and create a new job.
 *************************************************************/

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    CreateJobPage
} = require('../pages/CreateJobPage');

const trades =
    require('../data/fixtures/trades');

const jobTitles =
    require('../data/fixtures/jobTitles');

const jobDescriptions =
    require('../data/fixtures/jobDescriptions');

const hourlyRates =
    require('../data/fixtures/hourlyRates');

const locations =
    require('../data/fixtures/locations');

const experienceRanges =
    require('../data/fixtures/experienceRanges');

const {
    saveJob
} = require('../utils/jobRegistry');

class CreateJobFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.loginFlow =
            new LoginFlow(driver);

        this.createJobPage =
            new CreateJobPage(driver);
    }

    /* ========================================================= */
    /* Create Employer Job                                       */
    /* ========================================================= */

    async createJob() {

        /* ===================================================== */
        /* STEP 1 - Open Login Screen                            */
        /* ===================================================== */

        await this.welcomePage
            .tapGetStarted();

        /* ===================================================== */
        /* STEP 2 - Login as Employer                            */
        /* ===================================================== */

        await this.loginFlow
            .loginEmployer();

        /* ===================================================== */
        /* STEP 3 - Open Create Job Screen                       */
        /* ===================================================== */

        await this.loginFlow
            .employerDashboardPage
            .tapAddJob();

        /* ===================================================== */
        /* Random Test Data                                      */
        /* ===================================================== */

        const selectedTrade =
            trades[
                Math.floor(Math.random() * trades.length)
            ];

        const selectedJobTitle =
            jobTitles[
                Math.floor(Math.random() * jobTitles.length)
            ];

        const selectedDescription =
            jobDescriptions[
                Math.floor(Math.random() * jobDescriptions.length)
            ];

        const selectedHourlyRate =
            hourlyRates[
                Math.floor(Math.random() * hourlyRates.length)
            ];

        const selectedLocation =
            locations[
                Math.floor(Math.random() * locations.length)
            ];

        const selectedExperience =
            experienceRanges[
                Math.floor(Math.random() * experienceRanges.length)
            ];

        const duration =
            Math.floor(Math.random() * 10) + 1;

        /* ===================================================== */
        /* STEP 4 - Job Details                                  */
        /* ===================================================== */

        await this.createJobPage.openTradesDropdown();

        await this.createJobPage.searchTrade(
            selectedTrade
        );

        await this.createJobPage.selectTrade(
            selectedTrade
        );

        await this.createJobPage.enterJobTitle(
            selectedJobTitle
        );

        await this.createJobPage.enterJobDescription(
            selectedDescription
        );

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 5 - Duration                                     */
        /* ===================================================== */

        await this.createJobPage.selectTodayAsStartDate();

        await this.createJobPage.enterDuration(
            duration
        );

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 6 - Pay Rate                                     */
        /* ===================================================== */

        await this.createJobPage.enterPayRate(
            selectedHourlyRate
        );

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 7 - Union Workers                                */
        /* ===================================================== */

        await this.createJobPage.selectNonUnionWorkers();

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 8 - Location                                     */
        /* ===================================================== */

        await this.createJobPage.searchLocation(
            selectedLocation
        );

        await this.createJobPage.selectFirstLocationSuggestion(
            selectedLocation
        );

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 9 - Certifications                               */
        /* ===================================================== */

        await this.createJobPage.searchCertification(
            selectedTrade
        );

        await this.createJobPage.verifyTradeVisible(
            selectedTrade
        );

        await this.createJobPage.selectFirstCertification();

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 10 - Multiple Tradesmen                          */
        /* ===================================================== */

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 11 - Experience                                  */
        /* ===================================================== */

        await this.createJobPage.openExperienceDropdown();

        await this.createJobPage.selectExperienceRange(
            selectedExperience
        );

        await this.createJobPage.tapNextStep();

        /* ===================================================== */
        /* STEP 12 - Post Job                                    */
        /* ===================================================== */

        await this.createJobPage.tapPostJob();

        await this.createJobPage.verifyJobPostedSuccessfully();

        /* ===================================================== */
        /* STEP 13 - Save Job                                    */
        /* ===================================================== */

        saveJob({

            trade:
                selectedTrade,

            title:
                selectedJobTitle,

            description:
                selectedDescription,

            payRate:
                selectedHourlyRate,

            duration,

            location:
                selectedLocation,

            experience:
                selectedExperience
        });

        console.log(
            'Job information saved successfully.'
        );

        /* ===================================================== */
        /* STEP 14 - Open Created Job                            */
        /* ===================================================== */

        await this.createJobPage.tapViewJob();

        await this.driver.pause(1000);

        console.log(
            'Employer job created successfully.'
        );
    }
}

module.exports = {
    CreateJobFlow
};