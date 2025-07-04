import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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
  "Exclusive: Why {name} Dominates {location}'s Scene"
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

// POST /business-data endpoint
app.post('/business-data', (req, res) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ 
        error: 'Business name and location are required' 
      });
    }

    // Simulate processing delay
    setTimeout(() => {
      const businessData = {
        rating: generateRating(),
        reviews: generateReviews(),
        headline: createHeadline(name, location),
        name,
        location
      };

      res.json(businessData);
    }, 1000); // 1 second delay to show loading state

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /regenerate-headline endpoint
app.get('/regenerate-headline', (req, res) => {
  try {
    const { name, location } = req.query;
    
    if (!name || !location) {
      return res.status(400).json({ 
        error: 'Business name and location are required' 
      });
    }

    // Simulate processing delay
    setTimeout(() => {
      const newHeadline = createHeadline(name, location);
      res.json({ headline: newHeadline });
    }, 800); // Slightly faster for regeneration

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API ready at http://localhost:${PORT}`);
});