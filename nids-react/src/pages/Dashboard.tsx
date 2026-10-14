import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, AlertTriangle, Shield, TrendingUp, 
  Wifi, Cpu, HardDrive, Network 
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockData } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(mockData.trafficStats());
  const [systemStats, setSystemStats] = useState(mockData.systemStats());
  const [recentAlerts, setRecentAlerts] = useState(mockData.alerts().slice(0, 5));

  // Simulated real-time traffic data
  const [trafficData, setTrafficData] = useState([
    { time: '00:00', normal: 45, attack: 5 },
    { time: '00:05', normal: 52, attack: 3 },
    { time: '00:10', normal: 48, attack: 7 },
    { time: '00:15', normal: 61, attack: 4 },
    { time: '00:20', normal: 55, attack: 8 },
    { time: '00:25', normal: 58, attack: 6 },
  ]);

  const attackTypeData = [
    { name: 'DoS', value: 445, color: '#ef4444' },
    { name: 'Probe', value: 312, color: '#f59e0b' },
    { name: 'R2L', value: 278, color: '#8b5cf6' },
    { name: 'U2R', value: 212, color: '#06b6d4' },
  ];

  const severityData = [
    { name: 'Critical', value: stats.criticalAlerts, color: '#ef4444' },
    { name: 'High', value: stats.highAlerts, color: '#f59e0b' },
    { name: 'Medium', value: stats.mediumAlerts, color: '#eab308' },
    { name: 'Low', value: stats.lowAlerts, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-dark-400">Real-time network security monitoring and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Traffic"
          value={stats.totalTraffic.toLocaleString()}
          icon={Activity}
          color="primary"
          trend="+12.5%"
        />
        <MetricCard
          title="Attacks Detected"
          value={stats.totalAttacks.toLocaleString()}
          icon={AlertTriangle}
          color="danger"
          trend="+5.3%"
        />
        <MetricCard
          title="Detection Rate"
          value={`${stats.detectionRate}%`}
          icon={Shield}
          color="success"
          trend="+2.1%"
        />
        <MetricCard
          title="Critical Alerts"
          value={stats.criticalAlerts.toString()}
          icon={TrendingUp}
          color="warning"
          trend="+8.7%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Traffic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            Real-time Traffic
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="normal" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="attack" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attack Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-danger-500" />
            Attack Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attackTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {attackTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alert Severity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Severity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning-500" />
            Alert Severity Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#00d4ff" radius={[8, 8, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-500" />
            System Status
          </h3>
          <div className="space-y-4">
            <SystemMetric
              label="CPU Usage"
              value={systemStats.cpuUsage}
              icon={Cpu}
              color="primary"
            />
            <SystemMetric
              label="Memory Usage"
              value={systemStats.memoryUsage}
              icon={HardDrive}
              color="warning"
            />
            <SystemMetric
              label="Active Connections"
              value={systemStats.activeConnections}
              icon={Network}
              color="success"
              max={500}
            />
            <div className="pt-4 border-t border-dark-700">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">Uptime</span>
                <span className="text-dark-50 font-semibold">
                  {Math.floor(systemStats.uptime / 3600)}h {Math.floor((systemStats.uptime % 3600) / 60)}m
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-dark-700/50 border border-dark-600 hover:border-primary-500/30 transition-all"
            >
              <div className={`p-2 rounded-lg ${getSeverityBg(alert.severity)}`}>
                <AlertTriangle className={`w-5 h-5 ${getSeverityColor(alert.severity)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-dark-50">{alert.attackType}</span>
                  <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-dark-400 truncate">
                  {alert.srcIp} → {alert.dstIp} | {alert.protocol}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-dark-50">
                  {(alert.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-dark-400">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, trend }: any) {
  const colorClasses = {
    primary: 'from-primary-500/20 to-primary-500/5 border-primary-500/30',
    danger: 'from-danger-500/20 to-danger-500/5 border-danger-500/30',
    success: 'from-success-500/20 to-success-500/5 border-success-500/30',
    warning: 'from-warning-500/20 to-warning-500/5 border-warning-500/30',
  };

  const iconColors = {
    primary: 'text-primary-500',
    danger: 'text-danger-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`card-hover bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-dark-700/50`}>
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
        </div>
        <span className="text-xs text-success-500 font-semibold">{trend}</span>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-dark-400 text-sm">{title}</p>
    </motion.div>
  );
}

function SystemMetric({ label, value, icon: Icon, color, max = 100 }: any) {
  const percentage = typeof value === 'number' && max ? (value / max) * 100 : value;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-300">{label}</span>
        </div>
        <span className="text-sm font-semibold text-dark-50">
          {typeof value === 'number' ? value.toFixed(1) : value}{max === 100 ? '%' : ''}
        </span>
      </div>
      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${
            color === 'primary' ? 'from-primary-500 to-primary-600' :
            color === 'warning' ? 'from-warning-500 to-warning-600' :
            'from-success-500 to-success-600'
          }`}
        />
      </div>
    </div>
  );
}

function getSeverityColor(severity: string) {
  const colors = {
    Critical: 'text-danger-500',
    High: 'text-warning-500',
    Medium: 'text-yellow-500',
    Low: 'text-success-500',
  };
  return colors[severity as keyof typeof colors] || 'text-dark-400';
}

function getSeverityBg(severity: string) {
  const bgs = {
    Critical: 'bg-danger-500/20',
    High: 'bg-warning-500/20',
    Medium: 'bg-yellow-500/20',
    Low: 'bg-success-500/20',
  };
  return bgs[severity as keyof typeof bgs] || 'bg-dark-700';
}
