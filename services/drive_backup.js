import { google } from 'googleapis';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load credentials
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/google-credentials.json');

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

export const backupDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Starting database backup process...');
    
    // Validate environment variables
    const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;
    if (!DB_USER || !DB_NAME || !DB_HOST) {
      return reject(new Error('Missing database environment variables'));
    }

    const date = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const fileName = `backup-${DB_NAME}-${dateString}.sql`;
    const filePath = path.join(__dirname, `../uploads/${fileName}`);

    // Adjust this dump command if needed (e.g. adding path to mysqldump)
    let dumpCommand = `mysqldump -h ${DB_HOST} -u ${DB_USER}`;
    if (DB_PASSWORD) {
        dumpCommand += ` -p${DB_PASSWORD}`;
    }
    dumpCommand += ` ${DB_NAME} > ${filePath}`;

    console.log('Executing dump command...');
    exec(dumpCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing mysqldump: ${error.message}`);
        return reject(error);
      }

      console.log(`Database backup saved locally to ${filePath}`);

      try {
        console.log('Uploading to Google Drive...');
        const fileMetadata = {
          name: fileName,
          // If you have a specific folder ID, add it here: parents: ['FOLDER_ID']
        };
        const media = {
          mimeType: 'application/sql',
          body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',
        });

        console.log(`Backup uploaded successfully. File ID: ${response.data.id}`);

        // Share the file with the requested email address
        console.log('Sharing file with pusdev001@gmail.com...');
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader', // or 'writer'
                type: 'user',
                emailAddress: 'pusdev001@gmail.com'
            }
        });
        console.log('File shared successfully.');


        // Cleanup local file
        fs.unlinkSync(filePath);
        console.log(`Local backup file ${filePath} deleted.`);
        resolve(response.data.id);
      } catch (uploadError) {
        console.error('Error uploading to Google Drive:', uploadError);
        reject(uploadError);
      }
    });
  });
};
