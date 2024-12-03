import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const STORAGE_KEYS = {
  SERVER_IP: 'server_ip',
  SERVER_PORT: 'server_port',
};

export default function SettingsScreen() {
  const [serverIP, setServerIP] = useState('');
  const [serverPort, setServerPort] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedIP = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_IP);
      const savedPort = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_PORT);
      
      if (savedIP) setServerIP(savedIP);
      if (savedPort) setServerPort(savedPort);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SERVER_IP, serverIP);
      await AsyncStorage.setItem(STORAGE_KEYS.SERVER_PORT, serverPort);
      router.push('/');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.SERVER_IP, STORAGE_KEYS.SERVER_PORT]);
      setServerIP('');
      setServerPort('');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Settings</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Server IP Address:</Text>
        <TextInput
          style={styles.input}
          value={serverIP}
          onChangeText={setServerIP}
          placeholder="Enter server IP"
          keyboardType="default"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Server Port:</Text>
        <TextInput
          style={styles.input}
          value={serverPort}
          onChangeText={setServerPort}
          placeholder="Enter server port"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={saveSettings}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.resetButton]} 
        onPress={resetSettings}
      >
        <Text style={styles.buttonText}>Reset Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 