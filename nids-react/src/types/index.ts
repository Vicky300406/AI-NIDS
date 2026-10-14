export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'analyst';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: string;
  attackType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  description?: string;
}

export interface TrafficStats {
  totalTraffic: number;
  totalAttacks: number;
  totalNormal: number;
  detectionRate: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
}

export interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  type: string;
  status: 'active' | 'inactive';
  bytesSent: number;
  bytesReceived: number;
  packetsSent: number;
  packetsReceived: number;
  speed: number;
}

export interface MLModel {
  name: string;
  icon: string;
  testF1: number;
  rocAuc: number;
  speed: string;
  description: string;
  color: string;
}

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  uptime: number;
}

export interface TrafficTick {
  timestamp: string;
  normal: number;
  attack: number;
}

export interface AttackTypeCount {
  [key: string]: number;
}
