import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Static list of AI-generated SEO headlines
const seoHeadlines = [
  "Why {name} is {location}'s Best Kept Secret in 2025",
  "Discover {name}: {location}'s Rising Star Business",
  "{name} Transforms {location}'s Business Landscape",
  "The Ultimate Guide to {name} in {location}",
  "Why {name} is {location}'s Top Choice This Year",
  "{name}: Where {location} Meets Excellence",
  "Breaking: {name} Revolutionizes {location}'s Market",
  "Inside {name}: {location}'s Premium Business Experience",
  "{name} Sets New Standards in {location}",
  "Exclusive: Why {name} Dominates {location}'s Scene",
  "{name}: {location}'s Hidden Gem Revealed",
  "How {name} is Changing the Game in {location}",
  "{name} - The Future of {location}'s Business Scene",
  "Why Everyone in {location} is Talking About {name}",
  "{name}: Your Next Favorite Spot in {location}"
];

// Helper function to generate a random rating
const generateRating = () => {
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0 range
};

// Helper function to generate random review count
const generateReviews = () => {
  return Math.floor(Math.random() * 500) + 50; // 50-550 range
};

// Helper function to create personalized headline
const createHeadline = (name, location) => {
  const randomIndex = Math.floor(Math.random() * seoHeadlines.length);
  return seoHeadlines[randomIndex]
    .replace(/{name}/g, name)
    .replace(/{location}/g, location);
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'GrowthProAI Business Dashboard API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'POST /business-data': 'Get business analytics data',
      'GET /regenerate-headline': 'Generate new SEO headline',
      'GET /health': 'Health check endpoint'
    },
    timestamp: new Date().toISOString()
  });
});

// POST /business-data endpoint
app.post('/business-data', (req, res) => {
  console.log('Received business-data request:', req.body);
  
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      console.log('Missing required fields:', { name, location });
      return res.status(400).json({ 
        error: 'Business name and location are required',
        received: { name, location }
      });
    }

    // Simulate processing delay
    setTimeout(() => {
      const businessData = {
        rating: generateRating(),
        reviews: generateReviews(),
        headline: createHeadline(name.trim(), location.trim()),
        name: name.trim(),
        location: location.trim()
      };

      console.log('Sending business data:', businessData);
      res.json(businessData);
    }, 1000); // 1 second delay to show loading state

  } catch (error) {
    console.error('Error in /business-data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// GET /regenerate-headline endpoint
app.get('/regenerate-headline', (req, res) => {
  console.log('Received regenerate-headline request:', req.query);
  
  try {
    const { name, location } = req.query;
    
    if (!name || !location) {
      console.log('Missing query parameters:', { name, location });
      return res.status(400).json({ 
        error: 'Business name and location are required',
        received: { name, location }
      });
    }

    // Simulate processing delay
    setTimeout(() => {
      const newHeadline = createHeadline(name.trim(), location.trim());
      console.log('Sending new headline:', newHeadline);
      res.json({ headline: newHeadline });
    }, 800); // Slightly faster for regeneration

  } catch (error) {
    console.error('Error in /regenerate-headline:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    title: 'GrowthProAI Business Dashboard API',
    description: 'API for generating business insights and SEO content',
    version: '1.0.0',
    endpoints: [
      {
        method: 'GET',
        path: '/',
        description: 'API information and status'
      },
      {
        method: 'POST',
        path: '/business-data',
        description: 'Get business analytics data',
        body: {
          name: 'string (required)',
          location: 'string (required)'
        },
        response: {
          rating: 'number',
          reviews: 'number',
          headline: 'string',
          name: 'string',
          location: 'string'
        }
      },
      {
        method: 'GET',
        path: '/regenerate-headline',
        description: 'Generate new SEO headline',
        query: {
          name: 'string (required)',
          location: 'string (required)'
        },
        response: {
          headline: 'string'
        }
      },
      {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint'
      }
    ]
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /',
      'POST /business-data',
      'GET /regenerate-headline',
      'GET /health',
      'GET /api'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API ready at http://localhost:${PORT}`);
  console.log(`📖 API documentation at http://localhost:${PORT}/api`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for frontend development`);
});