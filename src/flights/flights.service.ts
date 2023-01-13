import { uniqBy, flatMap } from 'lodash';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, combineLatest, map } from 'rxjs';

import { Flight } from './interfaces/flight.interface';
import { flightSources } from './constants';
import { getFlightIdentifier } from './helpers/identifier';

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) {}

    public getFlights() {
        return combineLatest(flightSources.map((source) => this.httpService.get<ResponseGetFlights>(source))).pipe(
            map((responses) => this.mapResponseToFlights(flatMap(responses, (response) => response.data.flights))),
            map((allFlights) => this.filterUniqueFlights(allFlights)),
            catchError((error) => {
                throw new Error('Something went wrong');
            })
        );
    }

    private mapResponseToFlights(responseFlights: ResponseFlight[]): Flight[] {
        return responseFlights.map((responseFlight) => ({
            price: responseFlight.price,
            slices: responseFlight.slices.map((slice) => ({
                originName: slice.origin_name,
                destinationName: slice.destination_name,
                departureDateTimeUtc: slice.departure_date_time_utc,
                arrivalDateTimeUtc: slice.arrival_date_time_utc,
                flightNumber: slice.flight_number,
                duration: slice.duration
            }))
        }));
    }

    private filterUniqueFlights(flights: Flight[]): Flight[] {
        return uniqBy(flights, getFlightIdentifier);
    }
}

interface ResponseGetFlights {
    flights: ResponseFlight[];
}

interface ResponseFlight {
    price: number;
    slices: ResponseSlice[];
}

interface ResponseSlice {
    origin_name: string;
    destination_name: string;
    departure_date_time_utc: string;
    arrival_date_time_utc: string;
    flight_number: string;
    duration: number;
}
