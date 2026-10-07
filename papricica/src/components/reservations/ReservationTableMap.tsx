import { useState } from "react";
import {
    Button,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {TableDto,TableStatus} from "@/types/table";
import {AvailabilityDto, ReservationDto} from "@/types/reservation";
import { createReservation } from "@/api/reservation";

type DisplayTable = {
    tableId: number;
    partySize: number;
    status: TableStatus;
};

type Props = {
    tables: TableDto[];
    availability: AvailabilityDto;
    startDate: string;
    onReservationCreated: (startDate: string) => Promise<AvailabilityDto>;
    onAvailabilityUpdate: (availability: AvailabilityDto) => void;
};

export default function RestaurantTableMap({tables, availability, startDate, onReservationCreated, onAvailabilityUpdate}: Props) {
    const [selectedTable, setSelectedTable] = useState<DisplayTable | null>(null);

    const [partySize, setPartySize] = useState(1);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [reservationResult, setReservationResult] = useState<ReservationDto | null>(null);

    const [reservationError, setReservationError] = useState<string | null>(null);

    const [showResultModal, setShowResultModal] = useState(false);

    const displayTables: DisplayTable[] =
        tables.map((table) => {
            const availabilityInfo =
                availability.tables.find((availableTable) => availableTable.tableId === table.tableId);

            return {
                tableId: table.tableId,
                partySize: table.partySize,
                status:
                    availabilityInfo?.status ??
                    TableStatus.RESERVED,
            };
        });

    function handleTablePress(table: DisplayTable) {
        if (table.status === TableStatus.RESERVED) {
            return;
        }

        setSelectedTable(table);
        setPartySize(1);

        setReservationResult(null);
        setReservationError(null);
    }

    async function handleReservation() {
        if (!selectedTable) {
            return;
        }

        try {
            setIsSubmitting(true);

            setReservationResult(null);
            setReservationError(null);

            const reservation = await createReservation({
                tableId: selectedTable.tableId,
                partySize,
                startDate,
            });

            setReservationResult(reservation);

            // Close reservation creation modal
            setSelectedTable(null);

            // Open result modal
            setShowResultModal(true);

        } catch (error) {
            console.error(error);

            setReservationError(
                "Sorry, something went wrong with your reservation."
            );

            // You can also close the first modal on failure
            setSelectedTable(null);

            setShowResultModal(true);

        } finally {
            setIsSubmitting(false);

            const newAvailability =
                await onReservationCreated(startDate);

            onAvailabilityUpdate(newAvailability);
        }
    }

    return (
        <>
            <View style={styles.restaurant}>
                <Text style={styles.restaurantTitle}>
                    Restaurant
                </Text>

                <View style={styles.row}>
                    <TableButton
                        table={displayTables[0]}
                        onPress={handleTablePress}
                    />

                    <TableButton
                        table={displayTables[1]}
                        onPress={handleTablePress}
                    />
                </View>

                <View style={styles.row}>
                    <TableButton
                        table={displayTables[2]}
                        onPress={handleTablePress}
                    />

                    <TableButton
                        table={displayTables[3]}
                        onPress={handleTablePress}
                    />
                </View>

                <View style={styles.row}>
                    <TableButton
                        table={displayTables[4]}
                        onPress={handleTablePress}
                    />

                    <TableButton
                        table={displayTables[5]}
                        onPress={handleTablePress}
                    />
                </View>

                <View style={styles.row}>
                    <TableButton
                        table={displayTables[6]}
                        onPress={handleTablePress}
                    />

                    <TableButton
                        table={displayTables[7]}
                        onPress={handleTablePress}
                    />
                </View>

                <View style={styles.row}>
                    <TableButton
                        table={displayTables[8]}
                        onPress={handleTablePress}
                    />

                    <TableButton
                        table={displayTables[9]}
                        onPress={handleTablePress}
                    />
                </View>
            </View>

            <Modal
                visible={selectedTable !== null}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setSelectedTable(null)
                }
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                        {selectedTable && (
                            <>
                                <Text style={styles.modalTitle}>
                                    Make Reservation
                                </Text>

                                <Text>
                                    Table: {selectedTable.tableId}
                                </Text>

                                <Text>
                                    Start:{" "}
                                    {new Date(
                                        startDate
                                    ).toLocaleString("en-GB")}
                                </Text>

                                <Text>
                                    Maximum guests:{" "}
                                    {selectedTable.partySize}
                                </Text>

                                <Text style={styles.partyTitle}>
                                    Party size
                                </Text>

                                <View style={styles.partyControls}>
                                    <Button
                                        title="-"
                                        onPress={() =>
                                            setPartySize((current) =>
                                                Math.max(1, current - 1)
                                            )
                                        }
                                    />

                                    <Text style={styles.partySize}>
                                        {partySize}
                                    </Text>

                                    <Button
                                        title="+"
                                        onPress={() =>
                                            setPartySize((current) =>
                                                Math.min(
                                                    selectedTable.partySize,
                                                    current + 1
                                                )
                                            )
                                        }
                                    />
                                </View>

                                <Button
                                    title={
                                        isSubmitting
                                            ? "Making reservation..."
                                            : "Make Reservation"
                                    }
                                    disabled={isSubmitting}
                                    onPress={handleReservation}
                                />

                                <Button
                                    title="Cancel"
                                    onPress={() =>
                                        setSelectedTable(null)
                                    }
                                />
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showResultModal}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setShowResultModal(false)
                }
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>

                        {reservationResult ? (
                            <>
                                <Text style={styles.modalTitle}>
                                    Your reservation has been successful!
                                </Text>

                                <Text>
                                    Table: {reservationResult.tableId}
                                </Text>

                                <Text>
                                    Guests: {reservationResult.partySize}
                                </Text>

                                <Text>
                                    Date:{" "}
                                    {new Date(
                                        reservationResult.startDate
                                    ).toLocaleDateString("en-GB")}
                                </Text>

                                <Text>
                                    Start time:{" "}
                                    {new Date(
                                        reservationResult.startDate
                                    ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>

                                <Text>
                                    End time:{" "}
                                    {new Date(
                                        reservationResult.endDate
                                    ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Text>

                                <Button
                                    title="Close"
                                    onPress={() =>
                                        setShowResultModal(false)
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalTitle}>
                                    Reservation failed
                                </Text>

                                <Text>
                                    {reservationError}
                                </Text>

                                <Button
                                    title="Close"
                                    onPress={() =>
                                        setShowResultModal(false)
                                    }
                                />
                            </>
                        )}

                    </View>
                </View>
            </Modal>
        </>
    );
}

type TableButtonProps = {
    table?: DisplayTable;
    onPress: (table: DisplayTable) => void;
};


function TableButton({table, onPress}: TableButtonProps) {
    if (!table) {
        return <View style={styles.emptyTable} />;
    }

    const isReserved =
        table.status === TableStatus.RESERVED;

    return (
        <Pressable
            disabled={isReserved}
            onPress={() => onPress(table)}
            style={[
                styles.table,
                isReserved && styles.reservedTable,
            ]}
        >
            <Text>
                Table {table.tableId}
            </Text>

            <Text>
                {table.partySize} seats
            </Text>

            <Text>
                {table.status}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    restaurant: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        gap: 24,
    },

    restaurantTitle: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    table: {
        borderWidth: 2,
        borderRadius: 8,
        padding: 12,
        width: 120,
        alignItems: "center",
        gap: 4,
    },

    reservedTable: {
        opacity: 0.35,
    },

    emptyTable: {
        width: 120,
    },

    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        padding: 24,
    },

    modal: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 24,
        gap: 16,
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
    },

    partyTitle: {
        marginTop: 8,
        fontWeight: "600",
    },

    partyControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
    },

    partySize: {
        fontSize: 24,
        fontWeight: "bold",
    },
});