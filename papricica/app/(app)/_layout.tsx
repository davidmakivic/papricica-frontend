import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AppLayout() {
    return (
        <Tabs
          screenOptions={{
              headerShown: false,
          }}
        >
          <Tabs.Screen
            name="menu"
            options={{
              title: "Menu",
              tabBarIcon: ({ color, size }) => (
                    <Ionicons
                        name="restaurant-outline"
                        size={size}
                        color={color}
                    />
                ),
            }}
          />

           <Tabs.Screen
             name="index"
             options={{
               title: "Reserve",
               tabBarIcon: ({ color, size }) => (
                   <Ionicons
                         name="calendar-outline"
                         size={size}
                         color={color}
                   />
               ),
             }}
           />

           <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons
                          name="person-outline"
                          size={size}
                          color={color}
                    />
                ),
              }}
           />

        </Tabs>
    );
}