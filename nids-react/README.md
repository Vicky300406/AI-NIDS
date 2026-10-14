# AI-Powered Network Intrusion Detection System (NIDS)
## React + TypeScript Frontend

A modern, real-time network intrusion detection system with a visually appealing dark-themed UI.

## 🚀 Features

- **Real-time Network Monitoring** - Live traffic visualization and threat detection
- **ML-Powered Analytics** - Machine learning models for intrusion detection
- **Interactive Dashboard** - Comprehensive security metrics and charts
- **Alert Management** - Real-time threat notifications
- **Network Detection** - Upload PCAP files for analysis
- **Dark Cyber Theme** - Modern, professional UI with smooth animations

## 📋 Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org/))
- **Python** 3.10+ (for backend API)
- **npm** (comes with Node.js)

## 🛠️ Installation

### Quick Setup (Windows)

1. **Install Frontend Dependencies**
   ```bash
   # Double-click INSTALL.bat
   # OR run manually:
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd ../sentinelx/backend
   pip install -r requirements.txt
   ```

### Manual Setup

```bash
# Clone/Download the repository
cd nids-react

# Install dependencies
npm install

# Create environment file (if not exists)
echo VITE_API_URL=http://localhost:8001 > .env
```

## 🎯 Running the Application

### Option 1: Using Batch Scripts (Windows)

**Frontend:**
```bash
# Double-click START_DEV.bat
```

**Backend:**
```bash
cd ../sentinelx/backend
python -m uvicorn app.main:app --reload --port 8001
```

### Option 2: Manual Commands

**Terminal 1 - Frontend:**
```bash
cd nids-react
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd sentinelx/backend
python -m uvicorn app.main:app --reload --port 8001
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

## 🔐 Default Credentials

```
Username: admin
Password: Admin@1234
```

## 📁 Project Structure

```
nids-react/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Layout.tsx   # Main layout with sidebar
│   ├── pages/           # Application pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LiveMonitor.tsx
│   │   ├── Alerts.tsx
│   │   ├── NetworkDetection.tsx
│   │   └── MLAnalytics.tsx
│   ├── services/        # API integration
│   │   └── api.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── .env                 # Environment configuration
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── INSTALL.bat          # Installation script
└── START_DEV.bat        # Development server launcher
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Python web framework
- **SQLite** - Database
- **JWT** - Authentication
- **WebSockets** - Real-time updates
- **scikit-learn** - ML models
- **XGBoost** - ML classifier

## 🔧 Development

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📊 Features Breakdown

### 1. Dashboard
- Real-time traffic statistics
- Threat detection charts
- System health metrics
- Recent alerts summary

### 2. Live Monitor
- Live network traffic stream
- Real-time packet analysis
- Visual threat indicators
- WebSocket-powered updates

### 3. Alerts
- Threat notification center
- Alert severity levels
- Filtering and search
- Detailed alert information

### 4. Network Detection
- PCAP file upload
- Batch traffic analysis
- ML-powered classification
- Detailed results view

### 5. ML Analytics
- Model performance metrics
- Feature importance analysis
- Confusion matrix
- Historical trends

## 🐛 Troubleshooting

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Issues
- Check if backend is running on port 8001
- Verify `.env` file has correct API URL
- Check CORS settings in backend

### Port Already in Use
```bash
# Change port in package.json
"dev": "vite --port 3001"
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is for educational and demonstration purposes.

## 🔗 Related Projects

- **Backend API**: `../sentinelx/backend/`
- **Legacy Streamlit App**: `../sentinelx/backend/legacy_streamlit/`

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check browser console for errors

## 🎉 Quick Start Guide

1. **Install** - Run `INSTALL.bat`
2. **Start Backend** - `cd ../sentinelx/backend && python -m uvicorn app.main:app --reload --port 8001`
3. **Start Frontend** - Run `START_DEV.bat`
4. **Login** - Visit http://localhost:3000 and use admin/Admin@1234
5. **Explore** - Navigate through different sections

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
