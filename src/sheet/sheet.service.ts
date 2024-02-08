import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class SheetService {
  auth: GoogleAuth;
  private service: any;

  constructor() {
    if (fs.existsSync('credentials.json')) {
      this.auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
        keyFile: 'credentials.json',
      });
    } else {
      this.auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
      });
    }

    this.service = google.sheets({ version: 'v4', auth: this.auth });
  }

  async readSheetData(sheetId: string): Promise<any[][]> {
    const res = await this.service.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:Z1000',
    });
    const rows = res.data.values;

    if (rows != null && rows.length > 0) {
      return rows;
    } else {
      console.log('No data found.');
    }
  }
}
