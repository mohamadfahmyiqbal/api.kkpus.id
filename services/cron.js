import cron from 'node-cron';
import { backupDatabase } from './drive_backup.js';

export const initCronJobs = () => {
    console.log('Initializing cron jobs...');

    // Schedule backup for the 1st of every month at 00:00
    // cron expression: '0 0 1 * *'
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running scheduled monthly database backup...');
        try {
            await backupDatabase();
            console.log('Scheduled backup completed successfully.');
        } catch (error) {
            console.error('Scheduled backup failed:', error);
        }
    });

    console.log('Cron jobs initialized successfully.');
};
