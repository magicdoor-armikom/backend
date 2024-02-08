import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SheetModule } from './sheet/sheet.module';
import { SitesModule } from './sites/sites.module';

@Module({
  imports: [SheetModule, SitesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
