import * as request from 'supertest';
import { delay, of, throwError } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { FlightsService } from './flights.service';
import { FlightsModule } from './flights.module';

describe('FlightsController', () => {
    const flights = [{}, {}, {}];

    let app: INestApplication;
    let fakeFlightsService: any;

    beforeEach(async () => {
        fakeFlightsService = {
            getAll: jest.fn().mockReturnValueOnce(of(flights)),
        };
        const module: TestingModule = await Test
            .createTestingModule({ imports: [FlightsModule] })
            .overrideProvider(FlightsService).useValue(fakeFlightsService)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => jest.resetModules());

    afterAll(async () => await app.close());

    describe('getFlights', () => {
        it('should return flights information', () => {
            return request(app.getHttpServer())
                .get('/flights')
                .expect(200)
                .expect(flights);
        });

        it('should return a response in 1 second or less (TTFB <= 1) even if the service is delayed', () => {
            fakeFlightsService.getAll = jest
                .fn()
                .mockReturnValueOnce(of(flights).pipe(delay(2000)));

            const startTime = process.hrtime();

            return request(app.getHttpServer())
                .get('/flights')
                .expect(200)
                .expect(() => {
                    const totalTime = process.hrtime(startTime);
                    const totalTimeInSeconds = totalTime[0];

                    expect(totalTimeInSeconds).toBeLessThanOrEqual(1);
                });
        });

        it('should return a 500 UnknownServerError if getting flights fails', () => {
            fakeFlightsService.getAll = jest
                .fn()
                .mockReturnValueOnce(throwError(() => new Error('Something went wrong')));

            return request(app.getHttpServer())
                .get('/flights')
                .expect(500)
                .expect({
                    statusCode: 500,
                    message: 'Internal server error'
                });
        });
    });
});
