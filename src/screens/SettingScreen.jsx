import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';

export default function SettingScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [posEndpoint, setPosEndpoint] = useState('');
  const handleSwitch = () => {
    setIsEnabled(!isEnabled);
  }
  return (
    // <SafeAreaView>
    <View style={styles.container}>
      <View style={styles.enableSwitch}>
        <Text>Enable POS Sync</Text>
        <Switch
          value={isEnabled}
          onValueChange={handleSwitch}
        />
      </View>
      <View style={styles.posEndpoint}>
      <Text>POS Endpoint</Text>
      <TextInput
        style={styles.inputText}
        value={posEndpoint}
        onChangeText={setPosEndpoint}
        placeholder="Enter POS URL"
      />
      </View>
      <View style={styles.savedEndpoint}>
      <Text>
        Saved Endpoint:
        {/* {savedEndpoint} */}
      </Text>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        //   onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Configuration</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
      >
        <Text>See History</Text>
      </TouchableOpacity> */}
    </View>
    // </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     css                                    */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    gap: 10
  },
  savedEndpoint: {
    marginTop: 10,
    marginBottom: 10,
    gap: 10
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
