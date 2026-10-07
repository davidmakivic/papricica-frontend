import { useState } from "react";
import {
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { router } from "expo-router";

import { registerUser } from "@/api/auth";
import { Role } from "@/types/user";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    async function handleRegister() {
        if (
            !email ||
            !password ||
            !firstName ||
            !lastName ||
            !phoneNumber
        ) {
            Alert.alert(
                "Missing information",
                "Please fill in all fields."
            );

            return;
        }

        try {
            setIsLoading(true);

            await registerUser({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,

                role: Role.USER,
            });

            Alert.alert(
                "Account created",
                "Your account was created successfully."
            );

            router.replace("/login");
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Registration failed",
                "The account could not be created."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
                Create Account
            </Text>

            <TextInput
                style={styles.input}
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
            />

            <TextInput
                style={styles.input}
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={
                    isLoading
                        ? "Creating account..."
                        : "Create Account"
                }
                onPress={handleRegister}
                disabled={isLoading}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
    },

    input: {
        borderWidth: 1,
        borderColor: "#cccccc",
        padding: 12,
        borderRadius: 8,
    },
});