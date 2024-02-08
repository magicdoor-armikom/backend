
export class Site {
  id: string;
  name: string;
  citizens: Citizen[] = [];
}

export class Citizen {
  name: string;
  phone: string;

  constructor(name: string, phone: string) {
    this.name = name;
    this.phone = phone;
  }
}

export class SiteRow {
  ad: string;
  id: string;

  constructor(ad: string, id: string) {
    this.ad = ad;
    this.id = id;
  }
}

export class SiteList {
  addSite(site: Site) {
    // search sites for site. Replace if exists, add if is new
    let found = false;
    for (let i = 0; i < this.sites.length; i++) {
      if (this.sites[i].id === site.id) {
        this.sites[i] = site;
        found = true;
        break;
      }
    }
    if (!found) {
      this.sites.push(site);
    }
  }

  sites: Site[] = [];
}

// site.service.ts