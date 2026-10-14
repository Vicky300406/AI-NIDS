import time
import random
import datetime
import threading
import asyncio
from typing import List, Dict, Any, Set
import psutil
from fastapi import WebSocket

SEVERITY_MAP = {
    "DoS": "Critical",
    "DDoS": "Critical",
    "Brute Force": "High",
    "Botnet": "High",
    "Port Scan": "Medium",
    "Probe": "Medium",
    "Web Attack": "Medium",
    "R2L": "Low",
    "U2R": "Low",
}

SEV_NUM = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1}

ATTACK_TYPES = ["DoS", "DDoS", "Port Scan", "Brute Force", "Botnet", "Web Attack", "R2L", "U2R", "Probe"]
PROTOCOLS = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS"]

class StateManager:
    def __init__(self):
        self.lock = threading.Lock()
        self.is_running = True
        self.start_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.total_traffic = 24890
        self.total_attacks = 3412
        self.total_normal = 21478
        self.alerts: List[Dict[str, Any]] = []
        self.traffic_history: List[Dict[str, Any]] = []
        self.next_alert_id = 1
        
        # Speed measurement
        self._prev_io = {}
        self._speed_cache = {}
        self._global_speed = {"upload": 0.0, "download": 0.0}

        # WebSocket subscribers
        self.active_websockets: Set[WebSocket] = set()

        # Seed initial data
        self._seed_initial_state()

    def _seed_initial_state(self):
        # Seed 15 realistic historical alerts
        for _ in range(15):
            self.create_alert()

        # Seed 20 historical traffic ticks
        now = datetime.datetime.now()
        for i in range(20, 0, -1):
            t = now - datetime.timedelta(seconds=i * 5)
            norm = random.randint(60, 150)
            atk = random.randint(5, 30)
            self.traffic_history.append({
                "ts": t.strftime("%H:%M:%S"),
                "normal": norm,
                "attack": atk,
                "total": norm + atk,
            })

    def create_alert(
        self,
        src_ip: str = None,
        dst_ip: str = None,
        src_port: int = None,
        dst_port: int = None,
        attack_type: str = None,
        protocol: str = None,
        confidence: float = None,
    ) -> Dict[str, Any]:
        with self.lock:
            aid = self.next_alert_id
            self.next_alert_id += 1

            if not attack_type:
                attack_type = random.choice(ATTACK_TYPES)
            severity = SEVERITY_MAP.get(attack_type, "Medium")

            def rnd_ip():
                return f"{random.randint(10, 192)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

            alert = {
                "id": aid,
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "src_ip": src_ip or rnd_ip(),
                "dst_ip": dst_ip or rnd_ip(),
                "src_port": src_port or random.randint(1024, 65535),
                "dst_port": dst_port or random.choice([80, 443, 22, 21, 3389, 8080, 53]),
                "protocol": protocol or random.choice(PROTOCOLS),
                "attack_type": attack_type,
                "severity": severity,
                "sev_num": SEV_NUM.get(severity, 2),
                "confidence": round(confidence or random.uniform(0.85, 0.99), 4),
                "status": "Open",
            }
            self.alerts.insert(0, alert)
            if len(self.alerts) > 500:
                self.alerts = self.alerts[:500]
            return alert

    def update_alert_status(self, alert_id: int, new_status: str) -> bool:
        with self.lock:
            for a in self.alerts:
                if a["id"] == alert_id:
                    a["status"] = new_status
                    return True
        return False

    def get_alerts(self, severity: str = None, attack_type: str = None, status: str = None, limit: int = 100):
        with self.lock:
            filtered = self.alerts
            if severity and severity.lower() != "all":
                filtered = [a for a in filtered if a["severity"].lower() == severity.lower()]
            if attack_type and attack_type.lower() != "all":
                filtered = [a for a in filtered if a["attack_type"].lower() == attack_type.lower()]
            if status and status.lower() != "all":
                filtered = [a for a in filtered if a["status"].lower() == status.lower()]
            return filtered[:limit]

    def record_traffic_tick(self, normal: int, attack: int, attacks_by_type: dict = None):
        with self.lock:
            self.total_traffic += (normal + attack)
            self.total_normal += normal
            self.total_attacks += attack
            
            tick = {
                "ts": datetime.datetime.now().strftime("%H:%M:%S"),
                "normal": normal,
                "attack": attack,
                "total": normal + attack,
            }
            self.traffic_history.append(tick)
            if len(self.traffic_history) > 60:
                self.traffic_history = self.traffic_history[-60:]
            return tick

    def get_stats(self) -> Dict[str, Any]:
        with self.lock:
            det_rate = round(self.total_attacks / max(self.total_traffic, 1) * 100, 2)
            
            # Severity counts
            sev_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
            atk_counts = {}
            for a in self.alerts:
                s = a.get("severity", "Low")
                sev_counts[s] = sev_counts.get(s, 0) + 1
                at = a.get("attack_type", "Unknown")
                atk_counts[at] = atk_counts.get(at, 0) + 1

            # System resource metrics
            cpu_percent = psutil.cpu_percent(interval=None)
            mem = psutil.virtual_memory()

            return {
                "total_traffic": self.total_traffic,
                "total_attacks": self.total_attacks,
                "total_normal": self.total_normal,
                "detection_rate": det_rate,
                "is_running": self.is_running,
                "start_time": self.start_time,
                "severity_counts": sev_counts,
                "attack_type_counts": atk_counts,
                "total_alerts": len(self.alerts),
                "system": {
                    "cpu_usage_pct": cpu_percent,
                    "ram_usage_pct": mem.percent,
                    "ram_used_gb": round(mem.used / (1024**3), 2),
                    "ram_total_gb": round(mem.total / (1024**3), 2),
                }
            }

    def get_devices(self) -> List[Dict[str, Any]]:
        results = []
        try:
            stats = psutil.net_if_stats()
            addrs = psutil.net_if_addrs()
            io_all = psutil.net_io_counters(pernic=True)

            for iface, stat in stats.items():
                ipv4 = "—"
                ipv6 = "—"
                mac = "—"
                for addr in addrs.get(iface, []):
                    fam = str(addr.family)
                    if "AF_INET" in fam or fam == "2":
                        if not addr.address.startswith("169.254."):
                            ipv4 = addr.address
                    elif "AF_INET6" in fam or fam == "23":
                        ipv6 = addr.address[:22]
                    elif "LINK" in fam or "PACKET" in fam or fam == "-1":
                        mac = addr.address

                io = io_all.get(iface)
                name_l = iface.lower()
                if any(k in name_l for k in ("wi-fi", "wifi", "wlan")):
                    kind = "Wi-Fi"
                elif any(k in name_l for k in ("ethernet", "eth")):
                    kind = "Ethernet"
                elif "vpn" in name_l:
                    kind = "VPN"
                elif any(k in name_l for k in ("vmware", "virtual", "docker", "veth")):
                    kind = "Virtual"
                elif "loopback" in name_l or ipv4.startswith("127."):
                    kind = "Loopback"
                else:
                    kind = "LAN"

                results.append({
                    "interface": iface,
                    "type": kind,
                    "ipv4": ipv4,
                    "ipv6": ipv6,
                    "mac": mac,
                    "status": "Up" if stat.isup else "Down",
                    "speed_mbps": stat.speed,
                    "bytes_sent": io.bytes_sent if io else 0,
                    "bytes_recv": io.bytes_recv if io else 0,
                    "packets_sent": io.packets_sent if io else 0,
                    "packets_recv": io.packets_recv if io else 0,
                    "errors_in": io.errin if io else 0,
                    "errors_out": io.errout if io else 0,
                })
        except Exception:
            pass
        return results

    # WebSocket connection management
    async def connect_ws(self, websocket: WebSocket):
        await websocket.accept()
        self.active_websockets.add(websocket)

    def disconnect_ws(self, websocket: WebSocket):
        self.active_websockets.discard(websocket)

    async def broadcast(self, message: dict):
        dead_sockets = set()
        for ws in list(self.active_websockets):
            try:
                await ws.send_json(message)
            except Exception:
                dead_sockets.add(ws)
        self.active_websockets -= dead_sockets

state_manager = StateManager()
