# Bethany's Pie Shop — Vanilla JS + Express

This is a standalone conversion of a small frontend to vanilla JavaScript (with optional jQuery and Kendo UI via CDN) and a minimal Express backend with a professional folder structure.

## Quick Start

```bash
cd bethanys-vanilla
npm install
npm run dev   # or `npm start`
```

Then open http://localhost:4000

## Project Structure

```
AI-Workshop-VanillaJS/
├── src/                    # Server-side code
│   ├── server.js          # Main server entry point
│   ├── routes/api.js      # API endpoints
│   ├── middleware/        # Security & other middleware
│   ├── data/             # Data models
│   ├── helpers/          # Utility functions
│   └── config/           # Configuration constants & Swagger
├── public/               # Frontend files
├── swagger.yaml          # OpenAPI specification
└── api-docs.html         # Interactive API documentation
```

## API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:4000/api-docs (integrated with Express)
- **OpenAPI Spec**: http://localhost:4000/swagger.yaml

### API Endpoints
- `GET /api/pies` - Get all pies (with optional category filter)
- `GET /api/pies-of-the-month` - Get featured monthly pies
- `GET /api/pies/:id` - Get specific pie by ID

### Example Usage
```bash
# Get all pies
curl http://localhost:4000/api/pies

# Get fruit pies only
curl "http://localhost:4000/api/pies?category=fruit"

# Get monthly featured pies
curl http://localhost:4000/api/pies-of-the-month

# Get specific pie
curl http://localhost:4000/api/pies/f1
```

## Features

- **Category Filtering**: Filter pies by seasonal, fruit, cheesecake, or all
- **Input Validation**: Robust category validation with helpful error messages
- **Security Headers**: Helmet.js for comprehensive security
- **Error Handling**: Unified error response format
- **API Documentation**: Complete OpenAPI 3.0 specification
- **Professional Structure**: Modular, maintainable code organization
