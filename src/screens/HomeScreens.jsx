import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fonts } from '../utils/fonts';
// import { Ionicons } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreens({ navigation }) {
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
            http://192.168.43.150/system-monitor/status/uptime
          </Text>
          <Ionicons name="copy-outline" style={styles.copyIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.controlEndCallButton}
          //   onPress={handleEndCall}
        >
          <Ionicons
            name="call"
            style={[styles.controlIcon, styles.endCallIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlCallButton}
          //   onPress={handleMakeCall}
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
