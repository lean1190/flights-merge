import { calculateExpirationDate } from './date';

describe('date', () => {

    describe('calculateExpirationDate', () => {

        beforeEach(() => {
            const now = new Date('2023-01-14T15:00:00');
            jest.useFakeTimers({ now });
        });

        it('should return the full expiration date based on the TTL', () => {
            const expectedExpirationDate = new Date('2023-01-14T16:00:00');
            expect(calculateExpirationDate(3600)).toStrictEqual(expectedExpirationDate);
        });
    });
});
