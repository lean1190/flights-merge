import { Flight } from '../interfaces/flight.interface';

export function getFlightIdentifier(flight: Flight): string {
    return flight.slices.reduce(
        (identifier, slice) => (identifier += `${slice.flightNumber}-${slice.departureDateTimeUtc}-${slice.arrivalDateTimeUtc}--`),
        '',
    );
}
