import {
    View,
    Text,
    StyleSheet,
    Button, Pressable
} from "react-native";
import {router} from "expo-router";
import { useAuth } from "@/context/AuthContext";


export default function ProfileScreen() {
    const { logout } = useAuth();
    async function handleLogout() {

        await logout();

        router.replace("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Profile
            </Text>


            <Pressable onPress={() => router.push("/(app)/profile/personal-data")}
                       style={(pressed) => [styles.btn, pressed && styles.pressed]}>
                <Text style={{color: "white"}}>
                    Personal Data
                </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(app)/profile/my-reservations")}
                       style={(pressed) => [styles.btn, pressed && styles.pressed]}>
                <Text style={{color: "white"}}>
                    Your Reservations
                </Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(app)/profile/redeem-gift")}
                       style={(pressed) => [styles.btn, pressed && styles.pressed]}>
                <Text style={{color: "white"}}>
                    MyPapricica points
                </Text>
            </Pressable>

            <Button
                title="Logout"
                onPress={handleLogout}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
    },

    card: {
        width: 300
    },
    btn: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 5
    },
    pressed: {
        opacity: 0.8
    }
});