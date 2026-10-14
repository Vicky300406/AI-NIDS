import axios from 'axios';
import type { AuthResponse, Alert, TrafficStats, NetworkInterface, SystemStats, TrafficTick, MLModel } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },
  
  register: async (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },
};

export const statsAPI = {
  getTrafficStats: async (): Promise<TrafficStats> => {
    const response = await api.get('/api/stats/traffic');
    return response.data;
  },
  
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await api.get('/api/stats/system');
    return response.data;
  },
};

export const alertsAPI = {
  getAlerts: async (limit = 50): Promise<Alert[]> => {
    const response = await api.get(`/api/alerts?limit=${limit}`);
    return response.data;
  },
  
  getAlertById: async (id: string): Promise<Alert> => {
    const response = await api.get(`/api/alerts/${id}`);
    return response.data;
  },
};

export const devicesAPI = {
  getNetworkInterfaces: async (): Promise<NetworkInterface[]> => {
    const response = await api.get('/api/devices/interfaces');
    return response.data;
  },
};

export const mlAPI = {
  getModels: async (): Promise<MLModel[]> => {
    const response = await api.get('/api/ml/models');
    return response.data;
  },
  
  setActiveModel: async (modelName: string): Promise<void> => {
    await api.post('/api/ml/set-model', { model: modelName });
  },
  
  predict: async (features: Record<string, any>): Promise<any> => {
    const response = await api.post('/api/ml/predict', features);
    return response.data;
  },
};

// Mock data for development
export const mockData = {
  trafficStats: (): TrafficStats => ({
    totalTraffic: 15842,
    totalAttacks: 1247,
    totalNormal: 14595,
    detectionRate: 79.5,
    criticalAlerts: 23,
    highAlerts: 145,
    mediumAlerts: 289,
    lowAlerts: 790,
  }),
  
  alerts: (): Alert[] => [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      srcIp: '192.168.1.105',
      dstIp: '10.0.0.25',
      srcPort: 45231,
      dstPort: 22,
      protocol: 'TCP',
      attackType: 'Port Scan',
      severity: 'High',
      confidence: 0.94,
      description: 'Multiple connection attempts detected',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      srcIp: '172.16.0.88',
      dstIp: '10.0.0.50',
      srcPort: 51024,
      dstPort: 80,
      protocol: 'TCP',
      attackType: 'DDoS',
      severity: 'Critical',
      confidence: 0.98,
      description: 'High volume flood detected',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      srcIp: '10.0.1.44',
      dstIp: '192.168.1.1',
      srcPort: 33891,
      dstPort: 443,
      protocol: 'TCP',
      attackType: 'SQL Injection',
      severity: 'Critical',
      confidence: 0.87,
      description: 'Malicious SQL patterns detected',
    },
  ],
  
  networkInterfaces: (): NetworkInterface[] => [
    {
      name: 'Wi-Fi',
      ipAddress: '192.168.1.105',
      macAddress: '00:1B:44:11:3A:B7',
      type: 'Wireless',
      status: 'active',
      bytesSent: 524288000,
      bytesReceived: 1048576000,
      packetsSent: 145231,
      packetsReceived: 289445,
      speed: 1000,
    },
    {
      name: 'Ethernet',
      ipAddress: '10.0.0.25',
      macAddress: 'A4:83:E7:2F:19:CA',
      type: 'Wired',
      status: 'active',
      bytesSent: 1073741824,
      bytesReceived: 2147483648,
      packetsSent: 523441,
      packetsReceived: 891234,
      speed: 1000,
    },
  ],
  
  mlModels: (): MLModel[] => [
    {
      name: 'XGBoost',
      icon: '⚡',
      testF1: 0.795,
      rocAuc: 0.870,
      speed: 'Fast',
      description: 'Best performance - Production ready',
      color: '#00d4ff',
    },
    {
      name: 'Random Forest',
      icon: '🌲',
      testF1: 0.774,
      rocAuc: 0.856,
      speed: 'Medium',
      description: 'High interpretability',
      color: '#10b981',
    },
    {
      name: 'Decision Tree',
      icon: '🌿',
      testF1: 0.769,
      rocAuc: 0.830,
      speed: 'Fast',
      description: 'Simple and transparent',
      color: '#8b5cf6',
    },
  ],
  
  systemStats: (): SystemStats => ({
    cpuUsage: 45.2,
    memoryUsage: 62.8,
    activeConnections: 127,
    uptime: 86400,
  }),
};

export default api;
