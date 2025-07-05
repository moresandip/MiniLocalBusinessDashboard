import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Local Business Dashboard API',
    availableRoutes: [
      'GET /',
      'POST /business-data',
      'GET /regenerate-headline',
      'GET /health',
      'GET /api'
    ]
  });
});

// POST /business-data route
app.post('/business-data', (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      error: 'Missing required fields: name and location'
    });
  }

  // Simulated response
  res.json({
    rating: 4.5,
    reviews: 150,
    headline: `Top-rated ${name} in ${location}`,
    name,
    location
  });
});

// GET /regenerate-headline route
app.get('/regenerate-headline', (req, res) => {
  const { name, location } = req.query;

  if (!name || !location) {
    return res.status(400).json({
      error: 'Missing required query parameters: name and location'
    });
  }

  const headline = `Discover why ${name} in ${location} is loved by customers!`;

  res.json({ headline });
});

// GET /health route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// GET /api route (documented but missing earlier)
app.get('/api', (req, res) => {
  res.json({
    documentation: {
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
    }
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

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API ready at http://localhost:${PORT}`);
  console.log(`📖 API documentation at http://localhost:${PORT}/api`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for frontend development`);
});
