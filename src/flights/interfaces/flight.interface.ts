export interface Flight {
    price: number;
    slices: Slice[];
}

interface Slice {
    originName: string;
    destinationName: string;
    departureDateTimeUtc: string;
    arrivalDateTimeUtc: string;
    flightNumber: string;
    duration: number;
}
