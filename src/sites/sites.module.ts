import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { SheetModule } from '../sheet/sheet.module';

@Module({
  imports: [SheetModule],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
