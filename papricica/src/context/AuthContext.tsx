import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import * as SecureStore from "expo-secure-store";

import { login as loginRequest } from "../api/auth";
import { logout as logoutRequest } from "../api/auth";
import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {RefreshTokenDto} from "@/types/auth";

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;

    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode; };

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { checkAuthentication(); }, []);

    async function checkAuthentication() {
        try {
            const accessToken = Platform.OS === 'web' ? await AsyncStorage.getItem("accessToken") : await SecureStore.getItemAsync("accessToken");

            setIsAuthenticated(!!accessToken);
        } catch (error) {
            console.error(
                "Failed to check authentication:",
                error
            );

            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    async function login( email: string, password: string) {
        const response = await loginRequest( {email, password} );

        if(Platform.OS === 'web') {

            await AsyncStorage.setItem("accessToken", response.accessToken);
            await AsyncStorage.setItem("refreshToken", response.refreshToken);

        } else {
            await SecureStore.setItemAsync("accessToken", response.accessToken);

            await SecureStore.setItemAsync("refreshToken", response.refreshToken);
        }

        setIsAuthenticated(true);
    }

    async function logout() {

        const refreshToken =Platform.OS === 'web' ? await AsyncStorage.getItem("refreshToken") : await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token found");
        }

        const refreshTokenDto: RefreshTokenDto = {
            refreshToken: refreshToken,
        };

        await logoutRequest(refreshTokenDto);

        if(Platform.OS === 'web') {

            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");

        } else {

            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
        }

        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}