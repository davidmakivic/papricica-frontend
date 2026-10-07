export enum TableStatus {
    AVAILABLE = "AVAILABLE",
    RESERVED = "RESERVED",
}

export interface TableDto {
    tableId: number;
    partySize: number;
}

export interface TableAvailabilityDto {
    tableId: number;
    partySize: number;
    status: TableStatus;
}