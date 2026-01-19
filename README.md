# 🥾 TrailWatch - Hiking Trail Traffic Application

A full-stack web application for real-time hiking trail traffic monitoring. Built with React frontend and Node.js/Express backend, using PostgreSQL for data persistence.

## 📸 Features

- **Real-time Traffic Updates**: View current congestion levels for popular hiking trails
- **Trail Details**: Comprehensive trail information including difficulty, distance, elevation, and estimated time
- **Traffic Refresh**: Simulate real-time traffic updates
- **Responsive Design**: Beautiful nature-themed UI that works on all devices

## 🏗️ Architecture

```
hiking-app/
├── backend/                 # Express.js API server
│   └── src/
│       ├── config/          # Database configuration
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Error handling, validation
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic layer
│       ├── app.js           # Express app setup
│       └── server.js        # Server entry point
├── frontend/                # React application
│   └── src/
│       ├── api/             # API client
│       ├── components/      # Reusable UI components
│       ├── hooks/           # Custom React hooks
│       └── pages/           # Page components
└── database/                # SQL schema and seed files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb trailsdb
```

2. Run the schema and seed files:
```bash
psql -d trailsdb -f database/schema.sql
psql -d trailsdb -f database/seed.sql
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start the server:
```bash
npm run dev    # Development with hot reload
npm start      # Production
```

Server runs at `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

App runs at `http://localhost:3000`

## 📡 API Endpoints

### Trails

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trails` | Get all trails (with optional filters) |
| GET | `/api/trails/:id` | Get trail by ID |
| POST | `/api/trails` | Create new trail |
| PUT | `/api/trails/:id` | Update trail |
| DELETE | `/api/trails/:id` | Delete trail |

### Traffic

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic` | Get all traffic reports |
| GET | `/api/traffic/stats` | Get traffic statistics |
| GET | `/api/traffic/refresh` | Refresh all traffic data |
| GET | `/api/traffic/:trailId` | Get traffic for specific trail |
| PUT | `/api/traffic/:trailId` | Update traffic for trail |

### Query Parameters

**GET /api/trails**
- `difficulty`: Filter by difficulty (easy, moderate, hard, expert)
- `maxLength`: Filter by maximum length in km
- `location`: Filter by location (partial match)

## 🎨 Traffic Levels

| Level | Label | Color | Description |
|-------|-------|-------|-------------|
| 1 | Very Low | Green | Trail is nearly empty |
| 2 | Low | Light Green | Light traffic |
| 3 | Moderate | Yellow | Expect other hikers |
| 4 | High | Orange | Consider off-peak hours |
| 5 | Very High | Red | Expect delays |

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **express-validator** - Input validation
- **helmet** - Security headers
- **morgan** - Request logging
- **cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **CSS Variables** - Theming

## 📁 Environment Variables

### Backend (.env)
```
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trailsdb
DB_USER=postgres
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:4000/api
```

## 🧪 Development

### Code Structure Guidelines

- **Services**: Contains business logic and database queries
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and middleware
- **Middleware**: Validation, error handling, etc.

### Error Handling

The API uses consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "details": []  // Optional validation errors
}
```

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
