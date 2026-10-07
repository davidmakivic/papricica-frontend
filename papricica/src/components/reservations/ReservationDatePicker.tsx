import { useState } from "react";
import {
    Button,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
};

export default function ReservationDatePicker({selectedDate, onDateChange}: Props) {
    const [showPicker, setShowPicker] = useState(false);

    function handleChange(event: any, date?: Date) {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (date) {
            onDateChange(date);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                Choose a date
            </Text>

            <Button
                title={selectedDate.toLocaleDateString("en-GB")}
                onPress={() => setShowPicker(true)}
            />

            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    minimumDate={new Date()}
                    onValueChange={handleChange}
                />
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
});