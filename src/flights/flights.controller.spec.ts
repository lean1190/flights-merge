import * as request from 'supertest';
import * as rxjs from 'rxjs';
import { delay, of, throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { FlightsService } from './flights.service';
import { FlightsModule } from './flights.module';
import { CacheModule } from '../cache/cache.module';

describe('FlightsController', () => {
    const flights = [{}, {}, {}];

    let app: INestApplication;
    let fakeFlightsService: any;
    let fakeInterval: any;

    beforeEach(async () => {
        jest.useFakeTimers();

        fakeInterval = jest.spyOn(rxjs, 'interval').mockImplementation(() => of())
        fakeFlightsService = {
            getAll: jest.fn().mockReturnValue(of(flights)),
        };
        const module: TestingModule = await Test.createTestingModule({
            imports: [FlightsModule, CacheModule]
        })
        .overrideProvider(FlightsService).useValue(fakeFlightsService)
        .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => jest.resetModules());

    afterAll(async () => await app.close());

    describe('getFlights', () => {
        it('should return flights information', (done) => {
            request(app.getHttpServer())
                .get('/flights')
                .expect(200)
                .expect(flights)
                .end(done);
        });

        it('should return a response in 1 second or less (TTFB <= 1) even if the service is delayed', (done) => {
            fakeFlightsService.getAll = jest
                .fn()
                .mockReturnValueOnce(of(flights).pipe(delay(2000)))
                .mockReturnValueOnce(throwError(() => new Error('Getting flights failed')))
                .mockReturnValueOnce(of(flights));

            const startTime = process.hrtime();

            request(app.getHttpServer())
                .get('/flights')
                .expect(200)
                .expect(() => {
                    const totalTime = process.hrtime(startTime);
                    const totalTimeInSeconds = totalTime[0];

                    expect(totalTimeInSeconds).toBeLessThanOrEqual(1);
                })
                .end(done);
        });
    });
});
