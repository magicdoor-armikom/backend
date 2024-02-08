import { Controller, Get } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
    constructor(private readonly sitesService: SitesService) {

    }
    @Get()
    async findAll() {
        return await this.sitesService.getList();
    }
}
