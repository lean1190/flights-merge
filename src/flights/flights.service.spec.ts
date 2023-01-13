import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from './flights.service';

describe('FlightsService', () => {
    let service: FlightsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FlightsService],
        }).compile();

        service = module.get<FlightsService>(FlightsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getFlights', () => {

        it('should get flights from every source', () => {

        });

        it('should merge the flights responses from every source', () => {

        });

        it('should return an error if any of the sources fails', () => {

        });
    });
});
