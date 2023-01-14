export function calculateExpirationDate(ttlSeconds: number): Date {
    return new Date(Date.now() + ttlSeconds * 1000);
}
