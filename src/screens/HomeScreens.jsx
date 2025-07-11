import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from '../utils/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CallDetection } = NativeModules; // Native module you created

export default function HomeScreens({ navigation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [displayEndpoint, setDisplayEndpoint] = useState('');
  const [listenerActive, setListenerActive] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedEndpoint = await AsyncStorage.getItem('posEndpoint');
      if (savedEndpoint) setDisplayEndpoint(savedEndpoint);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // Clean up listener when component unmounts
    return () => {
      DeviceEventEmitter.removeAllListeners('onCallStateChanged');
    };
  }, []);

  const requestCallPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    ]);

    const allGranted = Object.values(granted).every(v => v === 'granted');

    if (!allGranted) {
      Alert.alert('Permission Required', 'Please grant all permissions.');
      return false;
    }

    return true;
  };

  
  const handleCallEvent = async event => {
    const { state, phoneNumber } = event;
    console.log('📞 Call State Changed:', state, phoneNumber);

    if (state === 'INCOMING_CALL' && phoneNumber) {
      const posEndpoint = await AsyncStorage.getItem('posEndpoint');
      if (!posEndpoint) return;

      const logData = {
        number: phoneNumber,
        // timeStamp: new Date().toISOString(),
        timeStamp: new Date().toLocaleString('en-GB'),
        state: 'INCOMING_CALL',
      };
      console.log('📩 Logged call:', logData);

      try {
        await fetch(`${posEndpoint}/callLogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logData),
        });
        console.log('📩 Logged call:', logData);
      } catch (e) {
        console.log('❌ Failed to log call:', e);
      }
    }
  };
  const startServices = async () => {
    const hasPermissions = await requestCallPermissions();
    if (!hasPermissions) return;

    const posEndpoint = await AsyncStorage.getItem('posEndpoint');

    if (!posEndpoint) {
      Alert.alert(
        'Missing Info',
        'Please set endpoint and number in settings.',
      );
      return;
    } else {
      Alert.alert('Success', 'Services started successfully!');
    }

    try {
       NativeModules.CallDetection.startForegroundService(); // ✅ Start native service
      CallDetection.startListener(); // Native method
      setIsRunning(true);
      setListenerActive(true);
      DeviceEventEmitter.addListener('onCallStateChanged', event => {
        console.log('📞 Raw event:', event);

        const state = event?.state || 'UNKNOWN';
        const phoneNumber = event?.phoneNumber || 'N/A';

        console.log('📞 Parsed:', state, phoneNumber);
        handleCallEvent({ state, phoneNumber });
      });
      console.log('✅ Call listener started');
    } catch (e) {
      console.log('❌ Failed to start listener:', e);
    }
  };

  const stopServices = async () => {
    try {
      NativeModules.CallDetection.stopForegroundService(); // ✅ Stop native service
      CallDetection.stopListener(); // Native method
      setIsRunning(false);
      setListenerActive(false);

      DeviceEventEmitter.removeAllListeners('onCallStateChanged');
      console.log('🛑 Call listener stopped');
    } catch (e) {
      console.log('❌ Failed to stop listener:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Call Id Name</Text>
        <Text style={styles.headerNo}>+91 9876543210</Text>
      </View>

      <View style={styles.middleSection}>
        <Image source={require('../assets/logo.png')} style={styles.avatar} />
        <TouchableOpacity style={styles.urlBox}>
          <Text style={styles.urlText}>
            {displayEndpoint ? displayEndpoint : 'No Endpoint Saved!'}
          </Text>
          <Ionicons name="copy-outline" style={styles.copyIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.controlEndCallButton}
          onPress={stopServices}
        >
          <Ionicons
            name="call"
            style={[styles.controlIcon, styles.endCallIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlCallButton}
          onPress={startServices}
        >
          <Ionicons name="call" style={styles.controlIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlSettingsButton}
          onPress={() => navigation.navigate('Setting')}
        >
          <Ionicons name="settings-outline" style={styles.controlIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
/* -------------------------------------------------------------------------- */
/*                                  style css                                 */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  header: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    fontFamily: fonts.bold,
  },
  headerNo: {
    fontSize: 20,
    color: 'white',
    fontFamily: fonts.semiBold,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
    backgroundColor: '#fff',
  },

  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EBF0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    opacity: 0.8,
    width: 300,
    justifyContent: 'space-between',
  },

  urlText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
    marginRight: 8,
  },

  copyIcon: {
    color: 'black',
    fontSize: 14,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingBottom: 30,
  },

  name: {
    color: 'white',
    fontSize: 36,
    fontWeight: '600',
  },

  phone: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
  },
  controlCallButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#14C92C',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  controlEndCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },

  controlSettingsButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },

  controlIcon: {
    fontSize: 28,
    color: '#fff',
  },

  endCallIcon: {
    transform: [{ rotate: '135deg' }],
  },

  statusBadge: {
    backgroundColor: '#14C92C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
