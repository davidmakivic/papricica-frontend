import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert, Pressable, Modal, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { forgotPassword } from "@/api/users";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resetIsLoading, setResetIsLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const { login } = useAuth();

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert(
                "Missing information",
                "Please enter your email and password."
            );
            return;
        }

        try {
            setIsLoading(true);

            await login(email, password);

            router.replace("/(app)");
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Login failed",
                "Your email or password may be incorrect."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleForgotPassword(email: string){
        if(!resetEmail){
            Alert.alert(
                "Missing information!",
                "Please enter your email and password");
            return;
        }

        try {
            setResetIsLoading(true);

            await forgotPassword(email);

            setIsRequested(false);
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Login failed",
                "Your email or password may be incorrect."
            );
        } finally {
            setResetIsLoading(false);
            setResetEmail("");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Papricica
            </Text>

            <Text style={styles.subtitle}>
                Sign in to your account
            </Text>

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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={isLoading ? "Logging in..." : "Login"}
                onPress={handleLogin}
                disabled={isLoading}
            />

            <Pressable
                onPress={() => {setIsRequested(true);}}
                disabled={isRequested}
                style={({ pressed }) => [
                    styles.Button,
                    pressed && styles.ButtonPressed,
                ]}>
                <Text style={{color: "blue"}}> Forgot password? </Text>
            </Pressable>

            <Modal
                visible={isRequested || resetIsLoading}
                transparent
                animationType="fade"
                onRequestClose={() =>{
                    if(!resetIsLoading) {
                        setIsRequested(false);
                    }
                }}>
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>

                        {resetIsLoading ? (
                            <>
                                <Text style={styles.modalTitle}>
                                    Sending email...
                                </Text>

                                <ActivityIndicator size="large" />
                            </>
                         ) : (
                            <>
                                <Text style={styles.modalTitle}>
                                    Please provide your email and we will send you a password reset link.
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={resetEmail}
                                    onChangeText={setResetEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />

                                <Pressable onPress={() => {handleForgotPassword(resetEmail);}}>
                                    <Text>Send Email</Text>
                                </Pressable>

                                <Pressable onPress={() => {setIsRequested(false);}}>
                                    <Text>Cancel</Text>
                                </Pressable>
                            </>)}
                    </View>
                </View>
            </Modal>

            <View style={styles.registerContainer}>
                <Text>Don't have an account?</Text>

                <Button
                    title="Create account"
                    onPress={() => {
                        router.push("/register");
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
    },

    subtitle: {
        fontSize: 18,
    },

    input: {
        borderWidth: 1,
        borderColor: "#cccccc",
        padding: 12,
        borderRadius: 8,
    },

    registerContainer: {
        marginTop: 24,
        gap: 8,
    },
    Button: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "white",
        width: 150,
    },

    ButtonPressed: {
        opacity: 0.5,
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