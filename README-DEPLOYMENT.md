# Deployment Guide for Local Business Dashboard

## Backend Deployment on Render.com

### Prerequisites
- GitHub account
- Render.com account (free)
- Your code pushed to a GitHub repository

### Step-by-Step Deployment

#### 1. Prepare Your Repository
Make sure your repository contains:
- ✅ `server/server.js` (main backend file)
- ✅ `package.json` with proper scripts
- ✅ `render.yaml` (optional configuration file)

#### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up or log in with GitHub

#### 3. Deploy Web Service
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure deployment settings:

**Basic Settings:**
- **Name:** `local-business-dashboard-api`
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)

**Build & Deploy:**
- **Build Command:** `npm install`
- **Start Command:** `node server/server.js`

**Environment Variables:**
- `NODE_ENV` = `production`

#### 4. Deploy
- Click **"Create Web Service"**
- Render will automatically build and deploy your app
- You'll get a URL like: `https://your-app-name.onrender.com`

### Important Configuration Changes Made

#### ✅ Dynamic Port Configuration
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  // Server starts on Render's assigned port
});
```

#### ✅ Production CORS Setup
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? true : allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

#### ✅ Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

#### ✅ Package.json Scripts
```json
{
  "scripts": {
    "start": "node server/server.js",
    "dev:server": "PORT=3001 node server/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### After Deployment

#### Update Frontend Configuration
Once your backend is deployed, update your frontend to use the new API URL:

1. **For Development:** Keep using `http://localhost:3001`
2. **For Production:** Use your Render URL like `https://your-app-name.onrender.com`

Example frontend configuration:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.onrender.com'
  : 'http://localhost:3001';
```

#### Test Your Deployment
1. Visit your Render URL
2. Test endpoints:
   - `GET /` - Should return API info
   - `GET /health` - Should return health status
   - `POST /business-data` - Test with sample data

### Troubleshooting

#### Common Issues:
1. **Build Fails:** Check your `package.json` dependencies
2. **App Crashes:** Check logs in Render dashboard
3. **CORS Errors:** Verify your frontend URL is allowed
4. **Port Issues:** Ensure you're using `process.env.PORT`

#### Render Free Tier Limitations:
- ⚠️ Apps sleep after 15 minutes of inactivity
- ⚠️ Cold start delay when waking up
- ⚠️ 750 hours/month limit (enough for most projects)

### Next Steps
1. Deploy your backend to Render
2. Update your frontend to use the new API URL
3. Test all functionality
4. Consider upgrading to paid plan for production use

### Support
- Render Documentation: [render.com/docs](https://render.com/docs)
- GitHub Issues: Create issues in your repository
- Community: Render Discord/Forums