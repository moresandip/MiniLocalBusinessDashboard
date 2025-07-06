import express from 'express';
import cors from 'cors';

const app = express();
// Use dynamic port for deployment (Render will provide PORT environment variable)
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration for production deployment
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://rococo-gelato-acba03.netlify.app', // Your deployed frontend
  // Add your custom domain here when you get one
];

// If in production, allow all origins (you can restrict this later)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? true : allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Health check route (important for Render)
app.get('/health', (req, res) => {
  console.log('Health check accessed');
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    message: 'Local Business Dashboard API is running successfully',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    availableRoutes: [
      'GET /',
      'POST /business-data',
      'GET /regenerate-headline',
      'GET /health',
      'GET /api'
    ]
  });
});

// POST /business-data route with enhanced validation and response
app.post('/business-data', (req, res) => {
  console.log('Business data request received');
  console.log('Request body:', req.body);
  
  const { name, location } = req.body;

  // Validation
  if (!name || !location) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'Both name and location are required',
      received: { name: !!name, location: !!location }
    });
  }

  if (typeof name !== 'string' || typeof location !== 'string') {
    console.log('Validation failed: invalid types');
    return res.status(400).json({
      error: 'Invalid field types',
      details: 'Name and location must be strings'
    });
  }

  const trimmedName = name.trim();
  const trimmedLocation = location.trim();

  if (trimmedName.length === 0 || trimmedLocation.length === 0) {
    console.log('Validation failed: empty strings');
    return res.status(400).json({
      error: 'Empty fields not allowed',
      details: 'Name and location cannot be empty'
    });
  }

  // Generate realistic business data
  const ratings = [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8];
  const reviewCounts = [45, 67, 89, 123, 156, 189, 234, 267, 298, 334];
  
  const rating = ratings[Math.floor(Math.random() * ratings.length)];
  const reviews = reviewCounts[Math.floor(Math.random() * reviewCounts.length)];
  
  const headlines = [
    `Why ${trimmedName} is ${trimmedLocation}'s Best Kept Secret in 2025`,
    `Discover ${trimmedName}: ${trimmedLocation}'s Rising Star Business`,
    `${trimmedName} in ${trimmedLocation}: Where Quality Meets Excellence`,
    `Top-Rated ${trimmedName} Transforms ${trimmedLocation}'s Business Scene`,
    `${trimmedName}: The ${trimmedLocation} Business Everyone's Talking About`,
    `Experience Excellence at ${trimmedName} in ${trimmedLocation}`,
    `${trimmedName} Sets New Standards for ${trimmedLocation} Businesses`
  ];
  
  const headline = headlines[Math.floor(Math.random() * headlines.length)];

  const responseData = {
    rating,
    reviews,
    headline,
    name: trimmedName,
    location: trimmedLocation,
    timestamp: new Date().toISOString(),
    success: true
  };

  console.log('Sending response:', responseData);
  res.json(responseData);
});

// GET /regenerate-headline route with enhanced validation
app.get('/regenerate-headline', (req, res) => {
  console.log('Regenerate headline request received');
  console.log('Query params:', req.query);
  
  const { name, location } = req.query;

  if (!name || !location) {
    console.log('Validation failed: missing query parameters');
    return res.status(400).json({
      error: 'Missing required query parameters',
      details: 'Both name and location are required',
      received: { name: !!name, location: !!location }
    });
  }

  const trimmedName = String(name).trim();
  const trimmedLocation = String(location).trim();

  const headlines = [
    `${trimmedName}: Leading ${trimmedLocation}'s Business Innovation in 2025`,
    `Why ${trimmedName} is ${trimmedLocation}'s Most Trusted Choice`,
    `${trimmedName} Redefines Excellence in ${trimmedLocation}`,
    `Discover What Makes ${trimmedName} ${trimmedLocation}'s Premier Destination`,
    `${trimmedName}: Where ${trimmedLocation} Finds Quality and Service`,
    `Experience the ${trimmedName} Difference in ${trimmedLocation}`,
    `${trimmedName} - ${trimmedLocation}'s Award-Winning Business Solution`,
    `Join Thousands Who Choose ${trimmedName} in ${trimmedLocation}`,
    `${trimmedName}: Elevating ${trimmedLocation}'s Business Standards`
  ];

  const headline = headlines[Math.floor(Math.random() * headlines.length)];

  const responseData = {
    headline,
    timestamp: new Date().toISOString(),
    success: true
  };

  console.log('Sending headline response:', responseData);
  res.json(responseData);
});

// GET /api route
app.get('/api', (req, res) => {
  console.log('API documentation accessed');
  res.json({
    documentation: {
      title: 'Local Business Dashboard API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      endpoints: [
        {
          method: 'GET',
          path: '/',
          description: 'API information and status'
        },
        {
          method: 'GET',
          path: '/health',
          description: 'Health check endpoint for monitoring'
        },
        {
          method: 'POST',
          path: '/business-data',
          description: 'Get business analytics data',
          body: {
            name: 'string (required) - Business name',
            location: 'string (required) - Business location'
          },
          response: {
            rating: 'number - Business rating (1-5)',
            reviews: 'number - Number of reviews',
            headline: 'string - AI-generated SEO headline',
            name: 'string - Business name',
            location: 'string - Business location',
            timestamp: 'string - Response timestamp',
            success: 'boolean - Request success status'
          }
        },
        {
          method: 'GET',
          path: '/regenerate-headline',
          description: 'Generate new SEO headline',
          query: {
            name: 'string (required) - Business name',
            location: 'string (required) - Business location'
          },
          response: {
            headline: 'string - New AI-generated headline',
            timestamp: 'string - Response timestamp',
            success: 'boolean - Request success status'
          }
        }
      ]
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /',
      'POST /business-data',
      'GET /regenerate-headline',
      'GET /health',
      'GET /api'
    ],
    timestamp: new Date().toISOString()
  });
});

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  console.error('Stack:', error.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

// Start the server with enhanced logging
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`🚀 Local Business Dashboard API Server`);
  console.log(`📅 Started: ${new Date().toISOString()}`);
  console.log(`🌐 Server running on: http://0.0.0.0:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Dashboard API ready`);
  console.log(`📖 API documentation: http://0.0.0.0:${PORT}/api`);
  console.log(`💚 Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🔧 CORS enabled for production deployment`);
  console.log(`📝 Request logging enabled`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});