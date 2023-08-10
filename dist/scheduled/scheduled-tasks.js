"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initScheduledJobs = void 0;
const CronJob = require('node-cron');
const initScheduledJobs = () => {
    const systemDisabled = CronJob.schedule('45 11 * * *', () => {
        console.log('Disabling the system');
    }, {
        timezone: 'Asia/Yangon',
    });
    const systemEnabled = CronJob.schedule('45 14 * * *', () => {
        console.log('Enabling the system');
    }, {
        timezone: 'Asia/Yangon',
    });
    systemDisabled.start();
    systemEnabled.start();
};
exports.initScheduledJobs = initScheduledJobs;
//# sourceMappingURL=scheduled-tasks.js.map