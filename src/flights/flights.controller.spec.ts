import * as request from 'supertest';
import { of, throwError } from 'rxjs';
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
            getFlights: jest.fn().mockReturnValueOnce(of(flights)),
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

        it('should return a response in 1 second or less (TTFB <= 1)', () => {});

        it('should return a 500 UnknownServerError if getting flights fails', () => {
            fakeFlightsService.getFlights = jest
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
