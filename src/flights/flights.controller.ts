import { Controller, Get } from '@nestjs/common';

import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {

    constructor(private flightsService: FlightsService) {}

    @Get()
    public getFlights() {
        return this.flightsService.getFlights();
    }
}
