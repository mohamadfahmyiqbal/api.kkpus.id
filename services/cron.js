import cron from 'node-cron';
import { backupDatabase } from './drive_backup.js';
import { anonymizeDataForInactiveMembers } from './dataLifecycleCleaner.js';

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

  // Schedule data lifecycle cleaner for Right to be Forgotten compliance
  // Running daily at 02:00 (2 AM) to process inactive members
  cron.schedule('0 2 * * *', async () => {
    console.log('Running Data Lifecycle Cleaner for Right to be Forgotten compliance...');
    try {
      await anonymizeDataForInactiveMembers(false); // false = live mode
      console.log('Data Lifecycle Cleaner completed successfully.');
    } catch (error) {
      console.error('Data Lifecycle Cleaner failed:', error);
    }
  });

  console.log('Cron jobs initialized successfully.');
};