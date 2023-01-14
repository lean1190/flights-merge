import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';

import { FlightsService } from './flights.service';
import { exampleFlights1, exampleFlights2, expectedMergedFlights } from './test-flights';
import { takeValues } from '../helpers/observable';
import { flightSources } from './constants';

describe('FlightsService', () => {
    let service: FlightsService;
    let fakeHttpService: any;

    beforeEach(async () => {
        fakeHttpService = {
            get: jest
                .fn()
                .mockReturnValueOnce(of({ data: exampleFlights1 }))
                .mockReturnValueOnce(of({ data: exampleFlights2 })),
        };

        const module: TestingModule = await Test
            .createTestingModule({ providers: [FlightsService, HttpService] })
            .overrideProvider(HttpService).useValue(fakeHttpService)
            .compile();

        service = module.get<FlightsService>(FlightsService);
    });

    afterEach(() => jest.resetModules());

    describe('getAll', () => {

        it('should get flights from every source', async () => {
            await takeValues(service.getAll());
            flightSources.forEach((source) => expect(fakeHttpService.get).toHaveBeenCalledWith(source));
        });

        it('should merge the flights and remove duplicates', async () => {
            const [flights] = await takeValues(service.getAll());
            expect(flights).toStrictEqual(expectedMergedFlights);
        });

        it('should return an error if any of the sources fails', async () => {
            const expectedError = new Error('Something went wrong');
            fakeHttpService.get = jest
                .fn()
                .mockReturnValueOnce(of(exampleFlights1))
                .mockReturnValueOnce(throwError(() => expectedError));

            try {
                await takeValues(service.getAll());
            } catch (error) {
                expect(error).toStrictEqual(expectedError);
            }
        });
    });
});

