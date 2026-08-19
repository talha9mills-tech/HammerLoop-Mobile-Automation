/*************************************************************
 * Flow: Employer Worker Chat Flow
 * Purpose: Login as employer, find a worker, hire the
 *          worker, open the chat, send a unique message,
 *          and verify that the message was sent successfully.
 *************************************************************/

const {
    WelcomePage
} = require('../pages/WelcomePage');

const {
    LoginFlow
} = require('./LoginFlow');

const {
    FindWorkerPage
} = require('../pages/FindWorkerPage');

const {
    ChatPage
} = require('../pages/ChatPage');


class EmployerWorkerChatFlow {

    constructor(driver) {

        this.driver = driver;

        this.welcomePage =
            new WelcomePage(driver);

        this.loginFlow =
            new LoginFlow(driver);

        this.findWorkerPage =
            new FindWorkerPage(driver);

        this.chatPage =
            new ChatPage(driver);
    }


    /* ========================================================= */
    /* Complete Employer Worker Chat Flow                        */
    /* ========================================================= */

    async sendEmployerChatMessage() {

        console.log(
            'Starting employer worker chat flow...'
        );


        /* ========================================================= */
        /* Worker To Search For                                      */
        /* ========================================================= */

        const workerName =
            'Levi Reed';


        /* ========================================================= */
        /* Generate Unique Employer Message                          */
        /* ========================================================= */

        const messageTimestamp =
            Date.now();

        const employerMessage =
            `Hi ${workerName} ${messageTimestamp}-1`;

        console.log(
            `Employer message: ${employerMessage}`
        );


        /* ========================================================= */
        /* Get Started                                               */
        /* ========================================================= */

        console.log(
            'Opening HammerLoop...'
        );

        await this.welcomePage
            .tapGetStarted();


        /* ========================================================= */
        /* Login as Employer                                         */
        /* ========================================================= */

        console.log(
            'Logging in as employer...'
        );

        await this.loginFlow
            .loginEmployer();


        /* ========================================================= */
        /* Search Worker                                             */
        /* ========================================================= */

        console.log(
            `Searching for ${workerName}...`
        );

        await this.findWorkerPage
            .searchWorker(
                workerName
            );


        /* ========================================================= */
        /* Verify Worker Card                                        */
        /* ========================================================= */

        await this.findWorkerPage
            .verifyWorkerCard(
                workerName
            );


        /* ========================================================= */
        /* Hire Worker                                               */
        /* ========================================================= */

        console.log(
            `Hiring ${workerName}...`
        );

        await this.findWorkerPage
            .tapHireMeForWorker(
                workerName
            );


        /* ========================================================= */
        /* Open Worker Chat                                          */
        /* ========================================================= */

        console.log(
            'Opening worker chat...'
        );

        await this.findWorkerPage
            .tapMessageMe();


        /* ========================================================= */
        /* Send Employer Message                                     */
        /* ========================================================= */

        console.log(
            `Sending employer message: "${employerMessage}"`
        );

        await this.chatPage
            .sendMessage(
                employerMessage
            );


        /* ========================================================= */
        /* Verify Sent Message                                       */
        /* ========================================================= */

        console.log(
            `Verifying sent message: "${employerMessage}"`
        );

        await this.chatPage
            .verifyMessage(
                employerMessage
            );


        /* ========================================================= */
        /* Flow Completed                                            */
        /* ========================================================= */

        console.log(
            'Employer message was sent and verified successfully.'
        );

        console.log(
            'Employer worker chat flow completed.'
        );
    }
}


module.exports = {
    EmployerWorkerChatFlow
};