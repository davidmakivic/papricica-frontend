import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function MenuScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Menu
            </Text>

            <Text>
                Restaurant menu will go here.
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
});