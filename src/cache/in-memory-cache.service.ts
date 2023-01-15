import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { calculateExpirationDate } from './helpers/date';

import { Cache, CacheParams } from './interfaces/cache.interface';

// After I finished implementing this I discovered Nestjs has almost the same implementation
// with the same caching purpose (https://docs.nestjs.com/techniques/caching)
// Since I implemented this already, I decided to still use it.
// In the future I would replace it for the one provided by the framework.
@Injectable()
export class InMemoryCacheService<T> implements Cache<T> {

    private readonly defaultParams: CacheParams = { ttlSeconds: 3600 };
    private cacheStore: {
        [key: string]: {
            value: T;
            expireAt: Date;
        };
    } = {};

    constructor() {}

    public set(
        key: string,
        value: T,
        params?: CacheParams,
    ): Observable<void> {
        const ttlSeconds: number = (params?.ttlSeconds) as number ?? this.defaultParams.ttlSeconds;

        if (ttlSeconds <= 0) {
            return throwError(() => new Error('TTL cannot be 0 or lower'));
        }

        this.cacheStore[key] = {
            value,
            expireAt: calculateExpirationDate(ttlSeconds)
        };

        return of(undefined);
    }

    public get(key: string): Observable<T> | Observable<undefined> {
        const cacheEntry = this.cacheStore[key];

        if (!cacheEntry || cacheEntry.expireAt < new Date()) {
            return of(undefined);
        }

        return of(cacheEntry.value);
    }

    public remove(key: string): Observable<void> {
        if (!this.cacheStore[key]) {
            return of();
        }

        delete this.cacheStore[key];
        return of(undefined);
    }

    public clear(): Observable<void> {
        this.cacheStore = {};
        return of(undefined);
    }
}
