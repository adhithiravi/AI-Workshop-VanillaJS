# Bethany's Pie Shop — Vanilla JS + Express

This is a standalone conversion of a small frontend to vanilla JavaScript (with optional jQuery and Kendo UI via CDN) and a minimal Express backend.

## Tech Stack

### Frontend
- **Vanilla JavaScript** - Pure JavaScript, no frameworks
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **jQuery** - DOM manipulation and utilities (CDN)
- **Kendo UI** - Enhanced UI components (CDN)
- **Local Storage** - Client-side cart persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Helmet.js** - Security headers middleware
- **Swagger UI** - Interactive API documentation
- **YAML** - OpenAPI specification format

### Development
- **Nodemon** - Development server with auto-restart
- **npm** - Package management
- **Git** - Version control

### Architecture
- **RESTful API** - RESTful endpoints for data access
- **Modular Structure** - Organized server-side code
- **Security First** - Comprehensive security headers
- **API Documentation** - Complete OpenAPI 3.0 specification

Run:

```bash
cd bethanys-vanilla
npm install
npm run dev   # or `npm start`
```

Then open http://localhost:4000

Notes:
- Frontend files are in `public/`.
- API endpoints: `GET /api/pies` and `GET /api/pies/:id`.
