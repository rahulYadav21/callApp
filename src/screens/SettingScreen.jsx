import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen({ navigation }) {
  const [posEndpoint, setPosEndpoint] = useState('');
  // const [posNumber, setPosNumber] = useState('');


  /* -------------------------------------------------------------------------- */
  /*                          Load saved data on mount                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      const savedEndpoint = await AsyncStorage.getItem('posEndpoint');
      // const savedNumber = await AsyncStorage.getItem('posNumber');

      if (savedEndpoint) setPosEndpoint(savedEndpoint);
      // if (savedNumber) setPosNumber(savedNumber);
    };
    loadData();
  }, []);

  const testConnection = async()=>{
    if(!posEndpoint){
      console.log('No endpoint found');
      Alert.alert('Validation Error', 'Please enter a valid endpoint.');
      return;
    }

    try{
      const resp = await axios.get(`${posEndpoint}/callLogs`);
      Alert.alert('Success', 'Connection successful.');
      console.log('Connection successful:', resp.status);
    }catch(e){
      Alert.alert('Error', 'Failed to test connection.');
      console.log('Error testing connection:', e);
    }
  }

  const handleSave = async () => {
    if (!posEndpoint) {
      Alert.alert('Validation Error', 'Both fields are required.');
      return;
    }
    if(!posEndpoint.startsWith('http://') && !posEndpoint.startsWith('https://')) {
      Alert.alert('Validation Error', 'Please enter a valid endpoint.');
      return;
    }

    try {
      await AsyncStorage.setItem('posEndpoint', posEndpoint);
      // await AsyncStorage.setItem('posNumber', posNumber);

      console.log('Saved:', posEndpoint);
      Alert.alert('Success', 'Configuration saved successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }
      ]);
      navigation.navigate('Home');
    } catch (e) {
      console.log('Save error:', e);
      Alert.alert('Error', 'Failed to save configuration.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.posEndpoint}>
        <Text>POS Default Endpoint</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter POS URL (e.g., http://192.168.1.100:3000)"
          value={posEndpoint}
          onChangeText={setPosEndpoint}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='off'
          placeholderTextColor={'gray'}
        />
      </View>

      <View style={styles.savedEndpoint}>
        {/* <Text>Saved Number: {posNumber}</Text> */}
        <Text>Saved Endpoint: {posEndpoint || 'Not set yet'}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        {/* Test connection button */}
        <TouchableOpacity style={[styles.testButton]} onPress={testConnection}>
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>

        {/* Save configuration button */}
        <TouchableOpacity style={[styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Configuration</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Instructions</Text>
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>
            1. Enter the server URL above{'\n'}
            2. Test the connection{'\n'}
            3. Save configuration{'\n'}
            4. Go back to home and start the service
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     css                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 40,
    paddingHorizontal: 20,
    // paddingVertical: 10,
    backgroundColor: '#e8f4fc',
  },
  firstSection: {
    flexGrow: 1,
  },
  secondSection: {
    flexGrow: 1,
    gap: 10,
  },
  text: {
    fontSize: 16,
    paddingBottom: 5,
    paddingStart: 2,
    fontWeight: 'bold',
  },
  inputText: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  enableSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  saveButtonContainer: {
    // alignItems: "flex-end",
    // marginBottom: 40,
  },
  posEndpoint: {
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  savedEndpoint: {
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#0c3c5f',
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  testButton: {
    backgroundColor: '#0c3c5f',
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  historyButton: {
    color: '#1A1A1A',
    fontSize: 16,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  instructionBox: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  instructionText: {
    fontSize: 14,
    // color: '#1e40af',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});
