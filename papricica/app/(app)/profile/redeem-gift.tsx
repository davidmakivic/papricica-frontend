import {useState} from "react";
import {View, Text, Pressable, StyleSheet, Modal, ActivityIndicator} from "react-native";
import {getRedeemMeal} from "@/api/users";

export default function RedeemGiftScreen(){
    const [redeemed, setRedeemStatus] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleRedemption(amount: number){
        console.count("handleRedemption called");

        if(isLoading) {
            return;
        }

        try{
            setIsLoading(true);
            setError(null);
            await getRedeemMeal(amount);
            setRedeemStatus(true);
        } catch (error){
            console.error(error);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{error}</Text>
            </View>
        );
    }

    return(
        <View>
            <Text>
                Welcome to our MyPapricica point system! For every successfully completed reservation you will get awarded 100 points.
                With these points you can redeem one of our gift options down below. Once you redeem them you will get sent a QR-code
                to your email address. Show this QR-code to one of our waiters and they will take care of it!
            </Text>

            <View
                style={styles.card}
            >
                <Text style={styles.title}>
                    Free Drink
                </Text>

                <View style={styles.details}>
                    <Text style={styles.detailText}>
                        Get a free 0.5l drink during your next visit at Papricica!
                    </Text>

                    <Text style={styles.detailText}>
                        Cost: 350 myPapricica-points
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <Pressable
                        onPress={() => {handleRedemption(350);}}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={{color: "white"}}>Redeem free drink!</Text>
                    </Pressable>
                </View>
            </View>

            <View
                style={styles.card}
            >
                <Text style={styles.title}>
                    Free Pizza
                </Text>

                <View style={styles.details}>
                    <Text style={styles.detailText}>
                        Get a free medium size pizza of your choice during your next visit at Papricica!
                    </Text>

                    <Text style={styles.detailText}>
                        Cost: 1500 myPapricica-points
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <Pressable
                        onPress={() => {handleRedemption(1500);}}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={{color: "white"}}>Redeem free pizza!</Text>
                    </Pressable>
                </View>
            </View>

            <View
                style={styles.card}
            >
                <Text style={styles.title}>
                    Free Dessert
                </Text>

                <View style={styles.details}>
                    <Text style={styles.detailText}>
                        Get a free dessert during your next visit at Papricica!
                    </Text>

                    <Text style={styles.detailText}>
                        Cost: 1000 myPapricica-points
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <Pressable
                        onPress={() => {handleRedemption(1000);}}
                        disabled={isLoading}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={{color: "white"}}>Redeem free dessert!</Text>
                    </Pressable>
                </View>
            </View>

            <Modal
                visible={isLoading || redeemed}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    if (!isLoading) {
                        setRedeemStatus(false);
                    }
                }}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modal}>

                        {isLoading ? (
                            <>
                                <Text style={styles.modalTitle}>
                                    Redeeming your reward...
                                </Text>

                                <ActivityIndicator size="large" />
                            </>
                        ) : (
                            <>
                                <Text style={styles.modalTitle}>
                                    Your redemption was successful!
                                </Text>

                                <Text>
                                    Check your email for the confirmation
                                    email with your QR code. It may take a
                                    couple of minutes to arrive.
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        setRedeemStatus(false)
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
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },

    button: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "blue"
    },

    buttonPressed: {
        opacity: 0.5,
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