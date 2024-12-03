import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SERVER_IP: 'server_ip',
  SERVER_PORT: 'server_port',
};

export async function getServerURL() {
  try {
    const ip = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_IP);
    const port = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_PORT);
    
    console.log('Server settings:', { ip, port });
    
    if (!ip || !port) {
      throw new Error('Server settings not configured');
    }

    const url = `http://${ip}:${port}`;
    console.log('Constructed URL:', url);
    return url;
  } catch (error) {
    console.error('Error in getServerURL:', error);
    throw error;
  }
} 