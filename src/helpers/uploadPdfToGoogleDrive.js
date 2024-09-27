/* 
This module uploads the pdf file to Google Drive and generates a URL for the file.
*/

import {google} from 'googleapis';
import fs from 'fs';

const CLIENT_ID = process.env.NEXT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_APP_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = process.env.NEXT_APP_GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});


// uploadFile function uploads a file to Google Drive
export async function uploadFile(filePath, fileName) {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName, 
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath),
      },
    });

    // console.log(response.data);
    return response.data.id;
  } catch (error) {
    console.log(error.message);
  }
}


export async function generatePublicUrl(id) {
  try {
    const fileId = id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    /* 
    webViewLink: View the file in browser
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink',
    });

    // console.log(result.data);
    return result.data.webViewLink;
  } catch (error) {
    console.log(error.message);
  }
}
