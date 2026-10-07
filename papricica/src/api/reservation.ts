import { api } from "./client";

import {
    AvailabilityDto,
    CreateReservationRequest, ReservationDeleteRequest,
    ReservationDto,
} from "@/types/reservation";

export async function getAvailability(start: string): Promise<AvailabilityDto> {
    const response = await api.get<AvailabilityDto>(
        "/api/v1/availability",
        {
            params: {
                start,
            },
        }
    );

    return response.data;
}

export async function createReservation(reservation: CreateReservationRequest): Promise<ReservationDto> {
    const response = await api.post<ReservationDto>(
        "/api/v1/reservations",
        reservation
    );

    return response.data;
}

export async function getReservations(): Promise<ReservationDto[]> {
    const response = await api.get<ReservationDto[]>(
        "/api/v1/reservations"
    )

    return response.data;
}

export async function cancelReservation(reservation: ReservationDeleteRequest){
    await api.patch<void>(
        "api/v1/reservations",
        reservation
    );
}

export async function deleteReservation(reservation: ReservationDeleteRequest){
    await api.delete<void>(
        "api/v1/reservations",
        { data: reservation }
    );
}