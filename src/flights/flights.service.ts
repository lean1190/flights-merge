import { Injectable } from '@nestjs/common';

import { Flight } from './interfaces/flight.interface';

@Injectable()
export class FlightsService {

    public async getFlights(): Promise<Flight[]> {
        return [];
    }
}
