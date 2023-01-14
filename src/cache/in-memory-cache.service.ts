import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Cache, CacheParams } from './interfaces/cache.interface';

@Injectable()
export class InMemoryCacheService<T> implements Cache<T> {

    private cacheStore: { [key: string]: T } = {};

    public set(key: string, value: T, params?: CacheParams | undefined): Observable<void> {
        throw new Error('Method not implemented.');
    }

    public get(key: string): Observable<T> {
        throw new Error('Method not implemented.');
    }

    public remove(key: string): Observable<void> {
        throw new Error('Method not implemented.');
    }

    public clear(): Observable<void> {
        throw new Error('Method not implemented.');
    }
}
