import { Observable } from 'rxjs';

export interface Cache<T> {
    set(key: string, value: T, params?: CacheParams): Observable<void>;
    get(key: string): Observable<T> | Observable<undefined>;
    remove(key: string): Observable<void>;
    clear(): Observable<void>;
}

export interface CacheParams {
    ttlSeconds?: number;
}
