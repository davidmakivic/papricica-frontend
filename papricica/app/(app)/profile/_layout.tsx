import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Profile",
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="personal-data"
                options={{
                    title: "Personal Data",
                }}
            />

            <Stack.Screen
                name="my-reservations"
                options={{
                    title: "My Reservations"
                }}
            />

            <Stack.Screen
                name="redeem-gift"
                options={{
                    title: "MyPapricica Points"
                }}
            />
        </Stack>
    );
}