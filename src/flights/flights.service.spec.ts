import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { FlightsService } from './flights.service';

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

        it('should merge the flights responses from every source', () => {

        });

        it('should remove duplicate flights', () => {

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
