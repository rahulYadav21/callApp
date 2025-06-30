import { View, Text, StyleSheet, Image, TouchableOpacity, PermissionsAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../utils/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulate delay function
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const veryIntenciveTask = async () => {
  while (BackgroundService.isRunning()) {
    try{
      const posNumber = await AsyncStorage.getItem('posNumber');
      const posEndpoint = await AsyncStorage.getItem('posEndpoint');
      if(!posNumber || !posEndpoint){
        console.log("No posNumber or posEndpoint");
        await sleep(5000);
        return;
      }
      const logData = {
        number: posNumber,
        timeStamp : new Date().toISOString(),
      };

      await fetch(`${posEndpoint}/callLogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      })
      console.log("Call logged", logData);
    }
    catch(e){
      console.log("Error logging call", e);
    }
    await sleep(5000);
  }
  }

  const options = {
  taskName: 'CallLogger',
  taskTitle: 'Listening for Calls',
  taskDesc: 'Running in background...',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
};

export default function HomeScreens({ navigation }) {

  const [isRunning, setIsRunning] = useState(false);
  const [displayEndpoint, setDisplayEndpoint] = useState('');

  useEffect (() => {
    const loadSettings = async () => {
      const savedEndpoint = await AsyncStorage.getItem('posEndpoint');
      if(savedEndpoint) setDisplayEndpoint(savedEndpoint);
    }
    loadSettings();
  }, []);

   const requestCallPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      ]);
  
       const allGranted = Object.values(granted).every((v) => v === 'granted');

    if (!allGranted) {
      Alert.alert('Permission Required', 'Please grant all permissions.');
      return false;
    }

    return true;
    };

    const startServices = async () => {
      const hasPermissions = await requestCallPermissions();

      if(!hasPermissions){
        return;
      }
      const posEndpoint = await AsyncStorage.getItem('posEndpoint');
      const posNumber = await AsyncStorage.getItem('posNumber');
      if(!posEndpoint || !posNumber){
        console.log("No posNumber or posEndpoint");
        return;
      }
      
      if(BackgroundService.isRunning()){
        await BackgroundService.start(veryIntenciveTask, options);
        setIsRunning(true);
      }
    };

    const stopServices = async () => {
      if(BackgroundService.isRunning()){
        await BackgroundService.stop();
        setIsRunning(false);
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
    width: "90%",
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
