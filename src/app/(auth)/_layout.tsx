import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function NavigationLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                headerTintColor: '#0031F6',
                headerBackTitle: 'Retour',
            }}>
                <Stack.Screen
                    name="login"
                // options={{
                //     title: 'Connexion',
                //     headerShown: true,
                //     headerTitleStyle: {
                //         color: "#0031F6",
                //         fontSize: 17,
                //         fontWeight: '800',
                //         fontFamily: 'Inter-ExtraBold',
                //     },
                // }}
                />
            </Stack>
            <StatusBar style="dark" />
        </ThemeProvider>
    );
}