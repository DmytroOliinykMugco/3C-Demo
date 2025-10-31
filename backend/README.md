# Backend API - Customer Care Center Demo

Express.js backend with mocked Star Wars themed data for demo purposes.

## Getting Started

```bash
npm install
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base
- `GET /` - API information and available endpoints

### Profile
- `GET /api/profile` - Get user profile data
- `PUT /api/profile` - Update user profile data

### Family
- `GET /api/family` - Get family members (nextOfKin, starredMembers, allMembers)

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
