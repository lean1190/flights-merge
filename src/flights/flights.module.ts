import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { CacheModule } from '../cache/cache.module';

@Module({
    imports: [HttpModule, CacheModule],
    controllers: [FlightsController],
    providers: [FlightsService]
})
export class FlightsModule {}
