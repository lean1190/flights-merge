import { Test, TestingModule } from '@nestjs/testing';

import { takeValues } from '../helpers/observable';
import { InMemoryCacheService } from './in-memory-cache.service';

describe('InMemoryCacheService', () => {

    const cacheKey = 'aKey';
    const cacheValue = 'thisIsAValue';

    let service: InMemoryCacheService<string>;

    beforeEach(async () => {
        const now = new Date('2023-01-14T15:00:00');
        jest.useFakeTimers({ now });

        const module: TestingModule = await Test.createTestingModule({
            providers: [InMemoryCacheService],
        }).compile();

        service = module.get<InMemoryCacheService<string>>(InMemoryCacheService);
    });

    describe('set', () => {

        it('should set a value in the cache with default TTL', async () => {
            await takeValues(service.set(cacheKey, cacheValue));

            expect(service['cacheStore'][cacheKey]).toStrictEqual({
                value: cacheValue,
                expireAt: new Date('2023-01-14T16:00:00'),
            });
        });

        it('should set a value in the cache with explicit TTL', async () => {
            await takeValues(service.set(cacheKey, cacheValue, { ttlSeconds: 7200 }));

            expect(service['cacheStore'][cacheKey]).toStrictEqual({
                value: cacheValue,
                expireAt: new Date('2023-01-14T17:00:00'),
            });
        });

        it('should return an error if the TTL is invalid', async () => {
            const expectedError = new Error('TTL cannot be 0 or lower');
            try {
                await takeValues(service.set(cacheKey, cacheValue, { ttlSeconds: -1 }));
            } catch (error) {
                expect(error).toStrictEqual(expectedError);
            }
        });
    });

    describe('get', () => {

        it('should return a value from the cache if the entry is not expired', async () => {
            await takeValues(service.set(cacheKey, cacheValue));
            const [value] = await takeValues(service.get(cacheKey));

            expect(value).toBe(cacheValue);
        });

        it('should return undefined if the entry is expired', async () => {
            await takeValues(service.set(cacheKey, cacheValue, { ttlSeconds: 5 }));
            jest.advanceTimersByTime(10000);
            const [value] = await takeValues(service.get(cacheKey));

            expect(value).toStrictEqual(undefined);
        });

        it('should return undefined if the key does not exist', async () => {
            const [value] = await takeValues(service.get(cacheKey));

            expect(value).toStrictEqual(undefined);
        });
    });

    describe('remove', () => {

        it('should remove an entry from the cache', async () => {
            await takeValues(service.set(cacheKey, cacheValue, { ttlSeconds: 5 }));
            await takeValues(service.remove(cacheKey));

            const [value] = await takeValues(service.get(cacheKey));

            expect(value).toStrictEqual(undefined);
        });

        it('should not return an error if the key does not exist', async () => {
            await takeValues(service.remove(cacheKey));
            const [value] = await takeValues(service.get(cacheKey));

            expect(value).toStrictEqual(undefined);
        });
    });

    describe('clear', () => {

        it('should remove every entry from the cache', async () => {
            await takeValues(service.set(cacheKey, cacheValue, { ttlSeconds: 5 }));
            await takeValues(service.set('anotherKey', 'anotherValue'));
            await takeValues(service.clear());

            const [value1] = await takeValues(service.get(cacheKey));
            const [value2] = await takeValues(service.get('anotherKey'));

            expect(value1).toStrictEqual(undefined);
            expect(value2).toStrictEqual(undefined);
        });
    });
});
