import axios from "axios";
import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers:{
        "Content-Type": "application/json",
    },
})

api.interceptors.request.use(
    async (config) => {

        const accessToken = Platform.OS === "web" ? await AsyncStorage.getItem("accessToken") : await SecureStore.getItemAsync("accessToken");

        if(accessToken){
            config.headers.Authorization = accessToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    });