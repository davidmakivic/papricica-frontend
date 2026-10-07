import { TableAvailabilityDto } from "./table";

export interface AvailabilityDto {
    startDate: string;
    endDate: string;
    tables: TableAvailabilityDto[];
}

export interface CreateReservationRequest {
    tableId: number;
    partySize: number;
    startDate: string;
}

export interface ReservationDto {
    tableId: number;
    partySize: number;
    status: ReservationStatus;
    startDate: string;
    endDate: string;
}

export interface ReservationDeleteRequest {
    tableId: number;
    startDate: string;
}

export enum ReservationStatus {
    RESERVED = "RESERVED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    NO_SHOW = "NO_SHOW"
}