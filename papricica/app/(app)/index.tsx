import {ActivityIndicator, ScrollView, StyleSheet, Text} from "react-native";

import {useEffect, useState,} from "react";

import ReservationDatePicker from "../../src/components/reservations/ReservationDatePicker";
import ReservationTimePicker, { TimeSlot } from "../../src/components/reservations/ReservationTimePicker";
import RestaurantTableMap from "../../src/components/reservations/ReservationTableMap";

import { getAvailability } from "@/api/reservation";

import { AvailabilityDto } from "@/types/reservation";
import { TableDto } from "@/types/table";

import { createReservationDateTime } from "@/utils/dateTime";

export default function ReservationsScreen() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);

    const [tables, setTables] = useState<TableDto[]>([]);

    const [availability, setAvailability] = useState<AvailabilityDto | null>(null);

    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

    const [availabilityError, setAvailabilityError] = useState<string | null>(null);

    useEffect(() => {

        if (!selectedTime) {
            setAvailability(null);
            return;
        }

        async function loadTablesAndSetAvailability() {
            try {

                setIsLoadingAvailability(true);
                setAvailabilityError(null);

                const startDate = createReservationDateTime(selectedDate, selectedTime!);

                const result = await getAvailability(startDate);
                setTables(result.tables);
                setAvailability(result);
            } catch (error) {
                console.error("Could not load tables:", error);

                setAvailabilityError("Could not load table availability.");

                setAvailability(null);
            } finally {
                setIsLoadingAvailability(false);
            }
        }

        loadTablesAndSetAvailability();
    }, [selectedDate, selectedTime]);

    function handleDateChange(date: Date) {
        setSelectedDate(date);

        setAvailability(null);
    }

    const startDate = selectedTime !== null ? createReservationDateTime(selectedDate, selectedTime) : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                Make a Reservation
            </Text>

            <ReservationDatePicker
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
            />

            <ReservationTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
            />

            {!selectedTime && (
                <Text style={styles.hint}>
                    Choose a date and starting time to see
                    available tables.
                </Text>
            )}

            {isLoadingAvailability && (
                <ActivityIndicator size="large" />
            )}

            {availabilityError && (
                <Text style={styles.error}>
                    {availabilityError}
                </Text>
            )}

            {availability &&
                startDate &&
                tables.length > 0 && (
                    <RestaurantTableMap
                        tables={tables}
                        availability={availability}
                        startDate={startDate}
                        onReservationCreated={getAvailability}
                        onAvailabilityUpdate={setAvailability}
                    />
                )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        gap: 24
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
    },

    hint: {
        textAlign: "center",
    },

    error: {
        textAlign: "center",
    },
});