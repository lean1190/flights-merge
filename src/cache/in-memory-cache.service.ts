import { Injectable } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { calculateExpirationDate } from './helpers/date';

import { Cache, CacheParams } from './interfaces/cache.interface';

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

        return of();
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
        return of();
    }

    public clear(): Observable<void> {
        this.cacheStore = {};
        return of();
    }
}
