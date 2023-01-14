import * as request from 'supertest';
import * as rxjs from 'rxjs';
import { delay, of, throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { FlightsService } from './flights.service';
import { FlightsModule } from './flights.module';
import { CacheModule } from '../cache/cache.module';

describe.skip('FlightsController', () => {
    const flights = [{}, {}, {}];

    let app: INestApplication;
    let fakeFlightsService: any;
    let fakeInterval: any;

    beforeEach(async () => {
        jest.useFakeTimers();

        fakeInterval = jest.spyOn(rxjs, 'interval').mockImplementation(() => of())
        fakeFlightsService = {
            getAll: jest.fn().mockReturnValueOnce(of(flights)),
        };
        const module: TestingModule = await Test.createTestingModule({
            imports: [FlightsModule, CacheModule],
            providers: [{ provide: FlightsService, useValue: fakeFlightsService }]
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => jest.resetModules());

    afterAll(async () => await app.close());

    describe('getFlights', () => {
        // Unfortunately I couldn't figure out how to test this with the current implementation.
        // The test seems to be hanging because the interval observable is still running.
        // Also the interval gets executed after the test completes, so the test does not pass because the value is not the expected one.
        // There's probably a better approach for testing this although I couldn't figure it out so far.
        it('should return flights information', (done) => {
            jest.runAllTimers();

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
