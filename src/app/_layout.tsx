
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';




import { useColorScheme } from '@/hooks/use-color-scheme';

import { ActivityIndicator, StyleSheet, View } from 'react-native';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
  return (


    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>


      <StatusBar style="auto" />
    </ThemeProvider>


  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});