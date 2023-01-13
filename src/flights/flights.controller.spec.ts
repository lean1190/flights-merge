import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { FlightsService } from './flights.service';
import { FlightsModule } from './flights.module';

describe('FlightsController', () => {
    let app: INestApplication;
    let fakeFlightsService: FlightsService = {
        getFlights: async () => []
    };

    beforeEach(async () => {
        const module: TestingModule = await Test
            .createTestingModule({ imports: [FlightsModule] })
            .overrideProvider(FlightsService).useValue(fakeFlightsService)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => await app.close());

    describe('getFlights', () => {
        it('should return flights information', () => {
            return request(app.getHttpServer())
                .get('/flights')
                .expect(200)
                .expect([]);
        });

        it('should return a response in 1 second or less (TTFB <= 1)', () => {});

        it('should return a 500 UnknownServerError if getting flights fails', () => {
            return request(app.getHttpServer())
                .get('/flights')
                .expect(500)
                .expect({
                    error: 'UnknownServerError',
                    description: 'Something went wrong. Please try again.',
                });
        });
    });
});
