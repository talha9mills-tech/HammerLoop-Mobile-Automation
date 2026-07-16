/*************************************************************
 * Utility: Job Registry
 * Purpose: Save the latest created job details for reuse
 * in future test scenarios.
 *************************************************************/

const fs = require('fs');
const path = require('path');

const jobsFilePath =
    path.join(
        __dirname,
        '../data/createdJobs.json'
    );

/* ========================================================= */
/* Save Latest Created Job                                   */
/* ========================================================= */

function saveJob(job) {

    const now =
        new Date();

    job.createdDate =
        now.toLocaleDateString(
            'en-CA'
        );

    job.createdTime =
        now.toLocaleTimeString(
            'en-US',
            {
                hour12: false
            }
        );

    try {

        fs.writeFileSync(

            jobsFilePath,

            JSON.stringify(
                job,
                null,
                4
            )

        );

        console.log(
            `Created job saved successfully: ${job.title}`
        );

    } catch (error) {

        console.error(
            'Unable to save created job:',
            error
        );

        throw error;
    }
}

/* ========================================================= */
/* Get Latest Created Job                                    */
/* ========================================================= */

function getLatestCreatedJob() {

    if (!fs.existsSync(jobsFilePath)) {

        throw new Error(
            'createdJobs.json does not exist.'
        );
    }

    return JSON.parse(

        fs.readFileSync(

            jobsFilePath,
            'utf8'

        )

    );
}

module.exports = {
    saveJob,
    getLatestCreatedJob
};