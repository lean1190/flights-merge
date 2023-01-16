import { range, isEmpty } from 'lodash';
import { Controller, Get, OnModuleDestroy } from '@nestjs/common';
import { interval, switchMap, startWith, catchError, of, merge, skipWhile, take, Observable, Subscription, shareReplay } from 'rxjs';

import { InMemoryCacheService } from '../cache/in-memory-cache.service';
import { FlightsService } from './flights.service';
import { Flight } from './interfaces/flight.interface';

@Controller('flights')
export class FlightsController implements OnModuleDestroy {

    private readonly flightsCacheKey = 'getFlightsKey';

    private flightsFromCache: Observable<Flight[]>;
    private flightsSubscription: Subscription;

    constructor(
        private flightsService: FlightsService,
        private cacheService: InMemoryCacheService<Flight[]>
    ) {
        const attempts = 10;
        const getFlightsForCache: Observable<Flight[]> = merge(
            ...range(attempts).map(() => this.flightsService.getAll().pipe(catchError(() => of([])))),
        ).pipe(
            skipWhile((flights) => isEmpty(flights)),
            take(1)
        );

        const oneHourInMs = 3600000;
        const fillCache = interval(oneHourInMs).pipe(
            startWith(0),
            switchMap(() => getFlightsForCache),
            switchMap((flights) => this.cacheService.set(this.flightsCacheKey, flights, { ttlSeconds: oneHourInMs / 1000 }))
        );
        this.flightsFromCache = fillCache.pipe(
            switchMap(() => (this.cacheService.get(this.flightsCacheKey) as Observable<Flight[]>)),
            shareReplay(1)
        );

        this.flightsSubscription = this.flightsFromCache.subscribe();
    }

    onModuleDestroy() {
        this.flightsSubscription.unsubscribe();
    }

    @Get()
    public async getFlights() {
        return this.flightsFromCache.pipe(take(1));
    }
}
