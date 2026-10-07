import { useEffect, useState } from "react";
import {
    ActivityIndicator, Modal, Pressable,
    StyleSheet,
    Text, TextInput,
    View,
} from "react-native";

import { getCurrentUser, changePassword as change} from "@/api/users";
import { UserDetails } from "@/types/auth";

export default function PersonalDataScreen() {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [changePassword, setChangePassword] = useState(false);
    const [loadingChange, setLoadingChange] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                setIsLoading(true);
                setError(null);

                const userData = await getCurrentUser();

                setUser(userData);
            } catch (error) {
                console.error(error);
                setError("Could not load user data.");
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, []);

    async function handlePasswordChange(){

        try{
            setChangePassword(false);
            setLoadingChange(true);
            await change({ oldPassword, newPassword });
            setFinished(true);
            setLoadingChange(false);
        } catch (error) {
            console.error(error);
            setError("Could not change password.")
        }

    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No user data available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Personal Data
            </Text>

            <View style={styles.card}>
                <Text>
                    First name: {user.firstName}
                </Text>

                <Text>
                    Last name: {user.lastName}
                </Text>

                <Text>
                    Email: {user.email}
                </Text>

                <Text>
                    Phone: {user.phoneNumber}
                </Text>

                <Text>
                    MyPapricica Points: {user.points}
                </Text>

                <Pressable
                    onPress={() => setChangePassword(true)}
                    disabled={changePassword}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}>
                    <Text style={{color: "white"}}> Change password </Text>
                </Pressable>

                <Modal
                    visible={changePassword}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setChangePassword(false)}>

                    <View style={styles.modalBackground}>
                        <View style = {styles.modal}>
                            <Text style={styles.modalTitle}>
                                Please provide your current password and the new password you would like to have.
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Current password"
                                value={oldPassword}
                                onChangeText={setOldPassword}
                                secureTextEntry
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="New password"
                                value={newPassword}
                               onChangeText={setNewPassword}
                                secureTextEntry
                            />

                            <Pressable onPress={() => {handlePasswordChange();}}>
                                <Text>Change password</Text>
                            </Pressable>

                            <Pressable onPress={() => {setChangePassword(false);}}>
                                <Text>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={loadingChange || finished}
                    transparent
                    animationType="fade"
                    onRequestClose={() => {
                        if (!loadingChange) {
                            setFinished(false);
                        }
                    }}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modal}>

                            {loadingChange ? (
                                <>
                                    <Text style={styles.modalTitle}>
                                        Changing your password...
                                    </Text>

                                    <ActivityIndicator size="large" />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalTitle}>
                                        Your password has been changed!
                                    </Text>

                                    <Pressable
                                        onPress={() =>
                                            setFinished(false)
                                        }
                                    >
                                        <Text>Close</Text>
                                    </Pressable>
                                </>
                            )}

                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
    },

    card: {
        gap: 12,
    },

    button: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "blue"
    },

    buttonPressed: {
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

    input: {
        borderWidth: 1,
        borderColor: "#cccccc",
        padding: 12,
        borderRadius: 8,
    },
});