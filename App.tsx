import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';

import HomeScreens from './src/screens/HomeScreens.jsx';
import SettingScreen from './src/screens/SettingScreen';
// import HistoryScreen from './src/screens/HistoryScreen';

// ✅ Sentry init
Sentry.init({
  dsn: 'https://b2558375f7f63678ffefd011071cc8e8@o4509576462663680.ingest.us.sentry.io/4509576463777792',
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

const Stack = createNativeStackNavigator();

// ✅ Optional: Set user & custom tags
// Sentry.setUser({
//   id: '123',
//   email: 'user@example.com',
//   username: 'rahul.yadav',
// });

// Sentry.setTag('environment', 'development');
// Sentry.setTag('version', '1.0.0');

// function TestButton() {
//   return (
//     <View style={{ margin: 20 }}>
//       <Button
//         title="Trigger Test Error"
//         color="crimson"
//         onPress={() => {
//           Sentry.captureException(new Error('This is a test error!'));
//         }}
//       />
//       <View style={{ marginTop: 10 }} />
//       <Button
//         title="Open Feedback Widget"
//         onPress={() => {
//           Sentry.showFeedbackWidget();
//         }}
//       />
//     </View>
//   );
// }

// ✅ Wrap your App with Sentry
// export default Sentry.wrap(function App() {
export default function App() {
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
}

// import React from 'react';
// // import { Platform, LogBox, PermissionsAndroid } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreens from './src/screens/HomeScreens';
// import SettingScreen from './src/screens/SettingScreen';
// import HistoryScreen from './src/screens/HistoryScreen';
// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://b2558375f7f63678ffefd011071cc8e8@o4509576462663680.ingest.us.sentry.io/4509576463777792',

//   // Adds more context data to events (IP address, cookies, user, etc.)
//   // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
//   sendDefaultPii: true,

//   // Configure Session Replay
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1,
//   integrations: [
//     Sentry.mobileReplayIntegration(),
//     Sentry.feedbackIntegration(),
//   ],

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // spotlight: __DEV__,
// });

// const Stack = createNativeStackNavigator();

// export default Sentry.wrap(function App() {
//   return (
//     <SafeAreaProvider>
//       <NavigationContainer>
//         <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Home" component={HomeScreens} />
//           <Stack.Screen name="Setting" component={SettingScreen} />
//           <Stack.Screen name="History" component={HistoryScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </SafeAreaProvider>
//   );
// });
