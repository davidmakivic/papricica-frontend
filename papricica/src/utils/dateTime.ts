import { TimeSlot } from "@/components/reservations/ReservationTimePicker";

export function createReservationDateTime(date: Date, time: TimeSlot): string {
    const reservationDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.hour,
        time.minute,
        0,
        0
    );

    return reservationDate.toISOString();
}