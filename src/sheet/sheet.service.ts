import { Injectable } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

@Injectable()
export class SheetService {

  auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
    keyFile: 'credentials.json',
  });

  service = google.sheets({ version: 'v4', auth: this.auth });

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
