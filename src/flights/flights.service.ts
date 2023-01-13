import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, combineLatest, firstValueFrom, map } from 'rxjs';

import { Flight } from './interfaces/flight.interface';
import { flightsSourceUrl1, flightsSourceUrl2 } from './constants';

@Injectable()
export class FlightsService {
    constructor(private readonly httpService: HttpService) {}

    public async getFlights(): Promise<Flight[]> {
        return firstValueFrom(
            combineLatest([
                this.httpService.get<ResponseGetFlights>(flightsSourceUrl1),
                this.httpService.get<ResponseGetFlights>(flightsSourceUrl2),
            ]).pipe(
                map(([flightsFromSource1, flightsFromSource2]) => this.mapResponseToFlights([
                    ...flightsFromSource1.data.flights,
                    ...flightsFromSource2.data.flights,
                ])),
                map((allFlights) => this.filterUniqueFlights(allFlights)),
                catchError((error) => {
                    throw 'Something went wrong';
                })
            ),
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
        return [];
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
