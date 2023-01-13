import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { FlightsService } from './flights.service';
import { Flight } from './interfaces/flight.interface';
import { exampleFlights1, exampleFlights2, expectedMergedFlights } from './test-flights';

describe('FlightsService', () => {
    let service: FlightsService;
    let fakeHttpService = {
        get: jest.fn(() => {}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test
            .createTestingModule({ providers: [FlightsService] })
            .overrideProvider(HttpService).useValue(fakeHttpService)
            .compile();

        service = module.get<FlightsService>(FlightsService);
    });

    describe('getFlights', () => {

        it('should get flights from every source', async () => {
            await service.getFlights();
            expect(fakeHttpService.get).toHaveBeenCalledWith(
                'https://coding-challenge.powerus.de/flight/source1',
            );
            expect(fakeHttpService.get).toHaveBeenCalledWith(
                'https://coding-challenge.powerus.de/flight/source1',
            );
        });

        it('should merge the flights and remove duplicates', async () => {
            fakeHttpService.get = jest
                .fn()
                .mockResolvedValueOnce(exampleFlights1)
                .mockResolvedValueOnce(exampleFlights2);

            const flights = await service.getFlights();
            expect(flights).toBe(expectedMergedFlights);
        });

        it('should return an error if any of the sources fails', () => {
            fakeHttpService.get = jest
                .fn()
                .mockResolvedValueOnce({})
                .mockRejectedValueOnce(new Error('Something went wrong'));

            return expect(service.getFlights()).rejects.toThrow('Something went wrong');
        });
    });
});

