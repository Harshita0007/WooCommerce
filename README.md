# WooCommerce Product Segmentation System

A full-stack microservices application that integrates with WooCommerce's REST API to manage products and create custom segments using a text-based rule editor.

##  Features

- ✅ WooCommerce REST API integration
- ✅ SQLite database for local storage
- ✅ Microservices architecture (3 services)
- ✅ Text-based segment rule editor with 7 operators
- ✅ Real-time product filtering
- ✅ Automated cron-based synchronization
- ✅ Swagger API documentation
- ✅ Responsive React frontend with Tailwind CSS
- ✅ Input validation and error handling
- ✅ Unit tests

##  Architecture
```
Frontend (React + Vite) - Port 3000
           |
           ├─── Product Service - Port 3001
           ├─── Segment Service - Port 3002
           └─── Cron Service (Background)
                      |
                SQLite Database
```

## Tech Stack

**Backend:** Node.js, Express, SQLite, Sequelize  
**Frontend:** React 18, Vite, Tailwind CSS  
**API Docs:** Swagger/OpenAPI  
**Testing:** Jest, Supertest

##  Installation & Setup

### Prerequisites
- Node.js 18+
- Git

### Quick Start

**1. Clone Repository**
```bash
git clone https://github.com/yourusername/woocommerce-segmentation.git
cd woocommerce-segmentation
```

**2. Setup Product Service**
```bash
cd backend/services/product-service
npm install
echo "NODE_ENV=development\nPORT=3001" > .env
npm start
```

**3. Setup Segment Service** (New Terminal)
```bash
cd backend/services/segment-service
npm install
echo "NODE_ENV=development\nPORT=3002" > .env
npm start
```

**4. Setup Cron Service** (New Terminal)
```bash
cd backend/cron-service
npm install
npm start
```

**5. Setup Frontend** (New Terminal)
```bash
cd frontend
npm install
echo "VITE_PRODUCT_SERVICE_URL=http://localhost:3001\nVITE_SEGMENT_SERVICE_URL=http://localhost:3002" > .env
npm run dev
```

**6. Sync Products**
```bash
curl -X POST http://localhost:3001/api/products/sync
```

**7. Open Browser**
```
http://localhost:3000
```

##  Product Ingestion Logic

### How It Works
1. **Manual Trigger**: `POST /api/products/sync`
2. **Automated**: Cron service runs every 1 hour
3. **Process**:
   - Connects to WooCommerce demo store
   - Fetches products with pagination
   - Transforms data to local schema
   - Upserts to SQLite database

### Data Transformation

| WooCommerce | Local DB | Notes |
|-------------|----------|-------|
| `id` | `id` | Primary key |
| `name` | `title` | Product name |
| `price` | `price` | Decimal |
| `stock_status` | `stock_status` | instock/outofstock |
| `stock_quantity` | `stock_quantity` | Can be null |
| `categories[0].name` | `category` | First category |
| `tags[].name` | `tags` | JSON array |
| `on_sale` | `on_sale` | Boolean |
| `date_created` | `created_at` | ISO timestamp |

##  Segment Rules

### Supported Operators
- `=` Equal to
- `!=` Not equal to
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal
- `<=` Less than or equal
- `contains` String contains

### Sample Input

**Example 1: Premium in-stock products**
```
price > 1000
stock_status = instock
on_sale = true
```

**Example 2: Low stock alert**
```
stock_quantity < 10
stock_status = instock
```

**Example 3: Category filter**
```
category = Electronics
price >= 500
```

**Example 4: Search by title**
```
title contains phone
```

## 📚 API Documentation

### Endpoints

**Product Service (Port 3001)**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/sync` - Sync from WooCommerce
- `GET /api-docs` - Swagger documentation

**Segment Service (Port 3002)**
- `POST /api/segments/evaluate` - Evaluate rules
- `GET /api-docs` - Swagger documentation

### Example Request
```bash
curl -X POST http://localhost:3002/api/segments/evaluate \
  -H "Content-Type: application/json" \
  -d '{"rules": "price > 100\nstock_status = instock"}'
```

##  Testing
```bash
cd backend/services/product-service
npm test
```

**Results:** 2/2 tests passing ✅

##  Environment Variables

**Product Service (.env)**
```bash
NODE_ENV=development
PORT=3001
```

**Segment Service (.env)**
```bash
NODE_ENV=development
PORT=3002
```

**Cron Service (.env)**
```bash
PRODUCT_SERVICE_URL=http://localhost:3001
SYNC_INTERVAL=3600000
```

**Frontend (.env)**
```bash
VITE_PRODUCT_SERVICE_URL=http://localhost:3001
VITE_SEGMENT_SERVICE_URL=http://localhost:3002
```

##  AI Usage Notes

This project was developed with assistance from **Claude AI (Anthropic)**.

### AI Generated
- Project structure and folder organization
- Express server boilerplate
- Sequelize model definitions
- React component scaffolding
- Swagger documentation setup
- Jest test configuration

### Developer Modifications
- **Database Adaptation**: Modified from PostgreSQL to SQLite for simplicity
- **Business Logic**: Custom segment evaluator with 7 operators
- **Error Handling**: Comprehensive try-catch blocks throughout
- **UI Enhancements**: Example loader, JSON viewer, responsive design
- **API Integration**: WooCommerce pagination and error handling
- **Testing**: Custom test cases for business requirements

### Development Process
1. Used AI for initial structure generation
2. Reviewed and understood all generated code
3. Tested each service individually
4. Modified for SQLite compatibility
5. Enhanced error handling and validation
6. Added custom features beyond requirements
7. Performed end-to-end testing

##  Project Structure
```
woocommerce-segmentation/
├── backend/
│   ├── services/
│   │   ├── product-service/     # WooCommerce API integration
│   │   ├── segment-service/     # Rule evaluation engine
│   │   └── cron-service/        # Automated sync
├── frontend/                     # React application
└── README.md
```

##  Troubleshooting

**Database Issues**
```bash
cd backend/services/product-service
del database.sqlite
npm start
```

**Port Conflicts**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Sync Fails**
- Check internet connection
- Verify WooCommerce API is accessible
- Check console logs for errors

##  WooCommerce Test Store

- **URL**: https://wp-multisite.convertcart.com
- **API Docs**: https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Credentials**: Demo keys included in code (safe for testing)




