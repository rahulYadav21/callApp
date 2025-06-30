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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen({ navigation }) {
  const [posEndpoint, setPosEndpoint] = useState('');
  const [posNumber, setPosNumber] = useState('');

  useEffect(() => {
    // Load saved data on mount
    const loadData = async () => {
      const savedEndpoint = await AsyncStorage.getItem('posEndpoint');
      const savedNumber = await AsyncStorage.getItem('posNumber');

      if (savedEndpoint) setPosEndpoint(savedEndpoint);
      if (savedNumber) setPosNumber(savedNumber);
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!posEndpoint || !posNumber) {
      Alert.alert('Validation Error', 'Both fields are required.');
      return;
    }

    try {
      await AsyncStorage.setItem('posEndpoint', posEndpoint);
      await AsyncStorage.setItem('posNumber', posNumber);

      console.log('Saved:', posEndpoint, posNumber);
      Alert.alert('Success', 'Configuration saved successfully!');
      navigation.navigate('Home');
    } catch (e) {
      console.log('Save error:', e);
      Alert.alert('Error', 'Failed to save configuration.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.posEndpoint}>
        <Text>POS Default Number</Text>
        <TextInput
          style={styles.inputText}
          value={posNumber}
          onChangeText={setPosNumber}
          placeholder="Enter POS Number"
        />
      </View>
      <View style={styles.posEndpoint}>
        <Text>POS Default Endpoint</Text>
        <TextInput
          style={styles.inputText}
          value={posEndpoint}
          onChangeText={setPosEndpoint}
          placeholder="Enter POS URL"
        />
      </View>

      <View style={styles.savedEndpoint}>
        <Text>Saved Number: {posNumber}</Text>
        <Text>Saved Endpoint: {posEndpoint}</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Configuration</Text>
      </TouchableOpacity>
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
  saveButtonText: {
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
});
