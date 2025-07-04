# GrowthProAI - Mini Local Business Dashboard

A full-stack application that simulates how small businesses can view their SEO content and Google Business data. Built with React, TypeScript, Tailwind CSS, and Express.js.

## 🚀 Features

- **Interactive Business Form**: Input business name and location with real-time validation
- **Simulated Google Business Data**: Display ratings, reviews, and AI-generated SEO headlines
- **Headline Regeneration**: Get fresh AI-style headlines with a single click
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: Comprehensive error management with user feedback
- **State Management**: React Context for scalable state handling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Context** for state management
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **JSON** for data exchange (no database required)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Clone the repository
```bash
git clone <repository-url>
cd local-business-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the backend server
```bash
npm run dev:server
```
The backend will run on `http://localhost:3001`

### 4. Start the frontend development server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

## 🌐 API Endpoints

### POST `/business-data`
Accepts business information and returns simulated Google Business data.

**Request:**
```json
{
  "name": "Cake & Co",
  "location": "Mumbai"
}
```

**Response:**
```json
{
  "rating": 4.3,
  "reviews": 127,
  "headline": "Why Cake & Co is Mumbai's Sweetest Spot in 2025",
  "name": "Cake & Co",
  "location": "Mumbai"
}
```

### GET `/regenerate-headline`
Generates a new AI-style headline for the business.

**Query Parameters:**
- `name`: Business name
- `location`: Business location

**Response:**
```json
{
  "headline": "Discover Cake & Co: Mumbai's Rising Star Business"
}
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional design with subtle animations
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Loading States**: Smooth transitions and loading indicators
- **Form Validation**: Real-time input validation with error messages
- **Accessibility**: Keyboard navigation and screen reader support
- **Glass-morphism**: Modern background blur effects
- **Micro-interactions**: Hover effects and smooth transitions

## 🔧 Development Scripts

```bash
# Start frontend development server
npm run dev

# Start backend server
npm run dev:server

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌟 Bonus Features Implemented

- ✅ **Loading Spinners**: Visual feedback during API calls
- ✅ **React Context**: Centralized state management
- ✅ **Form Validation**: Client-side validation with error messages
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Animations**: Smooth transitions and micro-interactions
- ✅ **Production Ready**: Clean code structure and best practices

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Future Enhancements

- Deploy to Vercel (Frontend) and Render (Backend)
- Add more business metrics and insights
- Implement user authentication
- Add business comparison features
- Include real Google Business API integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the GrowthProAI Full Stack Intern Assignment