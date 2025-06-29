import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';

import HomeScreens from './src/screens/HomeScreens.jsx';
import SettingScreen from './src/screens/SettingScreen';

Sentry.init({
  dsn: "https://6a8781b22e3c6fadb93b0b8f42a13922@o4509576462663680.ingest.us.sentry.io/4509581201506304",
  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  enableNative: true,                // Catch native crashes (Android/iOS)
  enableNativeNagger: true,         // Warns if native is misconfigured
  enableAutoSessionTracking: true,  // Tracks sessions automatically
  integrations: [
    Sentry.reactNativeTracingIntegration(),   // Optional, only needed if you're doing performance tracing
    Sentry.mobileReplayIntegration(),         // If using session replay
    Sentry.feedbackIntegration(),             // For feedback widget
  ]
});

const Stack = createNativeStackNavigator();


export default Sentry.wrap(function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Setting"
            component={SettingScreen}
            options={{ headerShown: true, title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});
