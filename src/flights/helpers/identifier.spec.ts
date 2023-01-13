import { Flight } from '../interfaces/flight.interface';
import { getFlightIdentifier } from './identifier';

describe('identifier', () => {

    describe('getFlightIdentifier', () => {

        it('should return a unique identifier for the flight', () => {
            const flight: Flight = {
                price: 123,
                slices: [
                    {
                        originName: 'name1',
                        destinationName: 'somewhere1',
                        departureDateTimeUtc: 'deptime1',
                        arrivalDateTimeUtc: 'arrtime1',
                        flightNumber: 'number1',
                        duration: 10,
                    },
                    {
                        originName: 'name2',
                        destinationName: 'somewhere2',
                        departureDateTimeUtc: 'deptime2',
                        arrivalDateTimeUtc: 'arrtime2',
                        flightNumber: 'number2',
                        duration: 10,
                    },
                ],
            };
            const expectedIdentifier = 'number1-deptime1-arrtime1--number2-deptime2-arrtime2--';

            expect(getFlightIdentifier(flight)).toBe(expectedIdentifier);
        });
    });
});
