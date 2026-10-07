import {getReservations, cancelReservation, deleteReservation} from "@/api/reservation";
import {useEffect, useState} from "react";
import {ReservationDeleteRequest, ReservationDto, ReservationStatus} from "@/types/reservation";
import {Modal, Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import Ionicons from "@expo/vector-icons/MaterialIcons";

export default function myReservationsScreen(){

    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [reservationToCancel, setReservationToCancel] = useState<ReservationDto | null>(null);
    const [reservationToDelete, setReservationToDelete] = useState<ReservationDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cancelled, setIsCancelled] = useState(false);
    const [deleted, setIsDeleted] = useState(false);

    useEffect(() => {loadReservations()}, [])

    async function loadReservations() {
        try {
            setIsLoading(true);
            setError(null);

            const reservations = await getReservations();

            setReservations(reservations);
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCancellation(reservation: ReservationDeleteRequest){
        try {
            setError(null);
            await cancelReservation(reservation);
            setReservationToCancel(null);
            await loadReservations();
            setIsCancelled(true);
        } catch(error) {
            console.error(error);
            setError("Something went wrong with your cancellation.")
            setIsCancelled(false);
        }
    }

    async function handleDeletion(reservation: ReservationDeleteRequest){
        try {
            setError(null);
            await deleteReservation(reservation);
            setReservationToDelete(null);
            await loadReservations();
            setIsDeleted(true);
        } catch (error) {
            console.error(error);
            setError("Something went wrong during your deletion process.")
            setIsDeleted(false);
        }
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading your reservations.</Text>
            </View>
        );
    }

    if (reservations.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No upcoming reservations. Time to make some!</Text>
            </View>
        );
    }

    return (
        <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        >
            {reservations.map((reservation) => (
                <View
                    key={`${reservation.tableId}-${reservation.startDate}`}
                    style={[
                        styles.card,
                        reservation.status === ReservationStatus.CANCELLED &&
                        styles.cancelledCard
                    ]}
                >
                    <Text style={styles.title}>
                        Table {reservation.tableId}
                    </Text>

                    <View style={styles.details}>
                        <Text style={styles.detailText}>
                            Guests: {reservation.partySize}
                        </Text>

                        <Text style={styles.detailText}>
                            Date:{" "}
                            {new Date(
                                reservation.startDate
                            ).toLocaleDateString("en-GB")}
                        </Text>

                        <Text style={styles.detailText}>
                            Start:{" "}
                            {new Date(
                                reservation.startDate
                            ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>

                        <Text style={styles.detailText}>
                            End:{" "}
                            {new Date(
                                reservation.endDate
                            ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>

                    {reservation.status === ReservationStatus.CANCELLED && (
                        <Text style={styles.cancelledText}>
                            Cancelled
                        </Text>
                    )}

                    <View style={styles.cardFooter}>
                        {reservation.status === ReservationStatus.CANCELLED ? (
                            <Pressable
                                onPress={() => {
                                    setReservationToDelete(reservation);
                                }}
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && styles.iconButtonPressed,
                                ]}
                            >
                                <Ionicons
                                    name="delete"
                                    size={24}
                                    color="red"
                                />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={() => {
                                    setReservationToCancel(reservation);
                                }}
                                style={({ pressed }) => [
                                    styles.iconButton,
                                    pressed && styles.iconButtonPressed,
                                ]}
                            >
                                <Ionicons
                                    name="cancel"
                                    size={24}
                                    color="black"
                                />
                            </Pressable>
                        )}
                    </View>
                </View>
            ))}

            <Modal
                visible={reservationToCancel !== null}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setReservationToCancel(null)
                }>
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Are you sure you want to cancel your Reservation?
                        </Text>

                        <Pressable onPress={() => handleCancellation(
                            {tableId: reservationToCancel!.tableId,
                             startDate: reservationToCancel!.startDate})}>
                            <Text>Confirm</Text>
                        </Pressable>

                        <Pressable onPress={() => setReservationToCancel(null)}>
                            <Text>Abort</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={cancelled}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setIsCancelled(false)
                }>
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Your Cancellation has been successful!
                        </Text>

                        <Pressable onPress={() => setIsCancelled(false)}>
                            <Text>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>



            <Modal
                visible={reservationToDelete !== null}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setReservationToDelete(null)
                }>
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Are you sure you want to delete your Reservation?
                        </Text>

                        <Pressable onPress={() => handleDeletion(
                            {tableId: reservationToDelete!.tableId,
                                startDate: reservationToDelete!.startDate})}>
                            <Text>Confirm</Text>
                        </Pressable>

                        <Pressable onPress={() => setReservationToDelete(null)}>
                            <Text>Abort</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={deleted}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setIsDeleted(false)
                }>
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Your Reservation has been deleted.
                        </Text>

                        <Pressable onPress={() => setIsDeleted(false)}>
                            <Text>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },

    container: {
        padding: 24,
        gap: 16,
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },

    card: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 14,
        padding: 18,

        gap: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,

        elevation: 3,
    },

    details: {
        gap: 6,
    },

    detailText: {
        fontSize: 16,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 8,
    },

    iconButton: {
        padding: 8,
        borderRadius: 8,
    },

    iconButtonPressed: {
        opacity: 0.5,
    },

    cancelledCard: {
        opacity: 0.55,
        backgroundColor: "#eeeeee",
    },

    cancelledText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666666",
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
});