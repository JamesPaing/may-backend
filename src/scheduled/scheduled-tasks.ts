const CronJob = require('node-cron');

export const initScheduledJobs = () => {
    const systemDisabled = CronJob.schedule(
        '45 11 * * *',
        () => {
            console.log('Disabling the system');
            // Add your custom logic here
        },
        {
            timezone: 'Asia/Yangon',
        }
    );

    const systemEnabled = CronJob.schedule(
        '45 14 * * *',
        () => {
            console.log('Enabling the system');
            // Add your custom logic here
        },
        {
            timezone: 'Asia/Yangon',
        }
    );

    systemDisabled.start();
    systemEnabled.start();
};
