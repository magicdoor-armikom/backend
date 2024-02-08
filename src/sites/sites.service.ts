import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SheetService } from '../sheet/sheet.service';
import { Citizen, Site, SiteList, SiteRow } from './site.model';

@Injectable()
export class SitesService {
  private siteList: SiteList;
  private lastFetchTimestamp: Date;
  sheetService: SheetService;

  constructor(sheetService: SheetService) {
    this.sheetService = sheetService;
    this.siteList = new SiteList();
    // set date min
    this.lastFetchTimestamp = new Date(0);
  }

  @Cron('*/5 * * * *')
  private async fetchList() {
    console.log('Fetching site list');
    // record start time
    const startTime = new Date();
    // get site list from sheets service
    const siteRowsResponse = await this.sheetService.readSheetData(
      '1_nXf_lIkx_gA7cXojMEh7NnSWFhz3bhLSSN3jLMkEP4',
    );

    const siteRows = this.parseSiteListResponse(siteRowsResponse);
    // iterate each site sheet and get site content
    for (const siteRow of siteRows) {
      console.log('Fetching site ' + siteRow.ad);
      const siteResponse = await this.sheetService.readSheetData(siteRow.id);
      const site = this.parseSiteResponse(siteRow, siteResponse);
      this.siteList.addSite(site);
    }

    this.lastFetchTimestamp = new Date();
    // calculate time passed in method
    const timePassed = new Date().getTime() - startTime.getTime();
    console.log('Site list fetched in ' + timePassed + ' ms');
  }

  parseSiteResponse(siteRow: SiteRow, response: any[][]): Site {
    console.log('Parsing site ' + siteRow.ad);
    const site = new Site();
    site.id = siteRow.id;
    site.name = siteRow.ad;
    // Find the positions of "Ad" and "ID" in the first array
    const adIndex = response[0].indexOf('Ad');
    const telefonIndex = response[0].indexOf('Telefon');

    // Skip the first array (header)
    for (let i = 1; i < response.length; i++) {
      const ad = response[i][adIndex];
      const telefon = response[i][telefonIndex];
      site.citizens.push(new Citizen(ad, telefon));
    }
    console.log('Site ' + siteRow.ad + ' parsed');
    return site;
  }

  parseSiteListResponse(response: any[][]): SiteRow[] {
    const sites: SiteRow[] = [];

    // Find the positions of "Ad" and "ID" in the first array
    const adIndex = response[0].indexOf('Ad');
    const idIndex = response[0].indexOf('ID');

    // Skip the first array (header)
    for (let i = 1; i < response.length; i++) {
      const ad = response[i][adIndex];
      const id = response[i][idIndex];
      sites.push(new SiteRow(ad, id));
    }

    return sites;
  }

  async getList(): Promise<SiteList> {
    if (
      this.lastFetchTimestamp.getTime() + 10 * 60 * 1000 <
      new Date().getTime()
    ) {
      await this.fetchList();
    }
    return this.siteList;
  }
}
