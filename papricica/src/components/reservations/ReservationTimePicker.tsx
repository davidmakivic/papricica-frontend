import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {useEffect} from "react";

export type TimeSlot = {
    hour: number;
    minute: number;
    label: string;
};

type Props = {
    selectedDate: Date;
    selectedTime: TimeSlot | null;
    onTimeChange: (time: TimeSlot) => void;
};

function generateTimeSlots(selectedDate: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];

    for (let hour = 8; hour <= 22; hour++) {
        for (const minute of [0, 30]) {
            if (hour === 22 && minute === 30) {
                continue;
            }

            const slotDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                hour,
                minute,
                0,
                0
            );

            if (slotDate <= new Date()) {
                continue;
            }

            slots.push({
                hour,
                minute,
                label:
                    `${hour.toString().padStart(2, "0")}:` +
                    `${minute.toString().padStart(2, "0")}`,
            });
        }
    }

    return slots;
}

export default function ReservationTimePicker({selectedDate, selectedTime, onTimeChange,}: Props) {
    const slots = generateTimeSlots(selectedDate);
    useEffect(() => {
        if (slots.length > 0) {
            onTimeChange(slots[0]);
        }
    }, [selectedDate]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Choose a starting time
            </Text>

            {slots.length === 0 ? (
                <Text>
                    No reservation times are available for today.
                </Text>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={styles.timeRow}>
                        {slots.map((slot) => {
                            const selected =
                                selectedTime?.hour === slot.hour &&
                                selectedTime?.minute === slot.minute;

                            return (
                                <Pressable
                                    key={slot.label}
                                    style={[
                                        styles.timeButton,
                                        selected && styles.selectedTimeButton,
                                    ]}
                                    onPress={() => onTimeChange(slot)}
                                >
                                    <Text>
                                        {slot.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },

    label: {
        fontSize: 18,
        fontWeight: "600",
    },

    timeRow: {
        flexDirection: "row",
        gap: 8,
    },

    timeButton: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    selectedTimeButton: {
        backgroundColor: "#dddddd",
    },
});