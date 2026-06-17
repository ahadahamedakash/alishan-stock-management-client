# Alishan Stock Management System - Architecture & Development Guide

## Project Overview

**Alishan Stock Management System** is a full-stack MERN application for inventory control, invoicing, expense tracking, and financial analytics. The project has been consolidated into a monorepo structure for the 2.0 version, separating frontend and backend into distinct folders.

### Project Structure (Monorepo v2.0)

```
alishan-stock-management-client/
├── frontend/              # React 19 + Vite frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components (ShadCN/Radix UI)
│   │   ├── pages/         # Route-based page components
│   │   ├── redux/         # Redux Toolkit + RTK Query state management
│   │   ├── routes/        # React Router 7 configuration with RBAC
│   │   ├── layouts/       # Dashboard and page layouts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions and API endpoints
│   │   ├── constants/     # App constants and options
│   │   └── contexts/      # React contexts (Sidebar, etc.)
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
└── backend/               # Node.js + Express backend API
    ├── src/
    │   ├── app/
    │   │   ├── modules/   # Feature modules (auth, product, stock, etc.)
    │   │   ├── routes/    # API route definitions
    │   │   ├── middlewares/  # Auth, validation middleware
    │   │   ├── validation/    # Zod schemas
    │   │   ├── config/    # App configuration
    │   │   ├── interfaces/    # TypeScript interfaces
    │   │   └── utils/     # Utility functions
    │   ├── server.ts      # Entry point
    │   └── app.ts         # Express app configuration
    └── package.json       # Backend dependencies
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Framework |
| Redux Toolkit | 2.11.2 | State management |
| React Router | 7.14.0 | Client-side routing |
| Tailwind CSS | 4.2.2 | Styling |
| Radix UI | Latest | Accessible component primitives |
| Recharts | 2.15.4 | Data visualization |
| React Hook Form | 7.72.1 | Form handling |
| Yup | 1.7.1 | Form validation |
| Vite | 6.4.1 | Build tool |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| TypeScript | 5.7.3 | Type-safe JavaScript |
| Express | 4.21.2 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.10.0 | ODM |
| JWT | 9.0.2 | Authentication |
| Zod | 3.24.2 | Schema validation |
| bcrypt | 5.1.1 | Password hashing |

---

## Business Domain & Core Features

### User Roles & Permissions (RBAC)

| Role | Code | Permissions |
|------|------|-------------|
| **Admin** | `admin` | Full system access, user management, employee management, analytics |
| **Stock Manager** | `stock-manager` | Product/stock management, stock history |
| **Accountant** | `accountant` | Invoices, expenses, collections, customer financial tracking |

### Core Modules

#### 1. Authentication & Authorization
- JWT-based auth with access/refresh tokens
- Role-based access control middleware
- Password change functionality
- Token refresh mechanism

#### 2. Product Management
- Product CRUD operations
- Product code generation (automatic)
- Product categorization
- Stock quantity tracking

#### 3. Stock Management
- Add stock entries with date tracking
- Deduct stock via invoice confirmation
- Complete stock history/audit trail
- Stock balance calculations

#### 4. Invoice & Billing
- Invoice creation with customer linkage
- Automatic calculations (total, paid, due)
- PDF generation and printing
- Stock auto-deduction on invoice creation
- Customer financial updates

#### 5. Customer Management
- Customer profile CRUD
- Automatic financial tracking:
  - `totalPurchase` - Sum of all invoice totals
  - `totalPaid` - Sum of all payments
  - `totalDue` - Outstanding balance (`totalPurchase - totalPaid`)
- Collection management against dues

#### 6. Expense & Financial Tracking
- Categorized expense entries
- Salary payment tracking (linked to employees)
- Balance tracking:
  - `totalRevenue` - Sum of invoice payments
  - `totalExpense` - Sum of all expenses
  - `currentBalance` - Net balance (`revenue - expense`)

#### 7. Employee Management (Admin Only)
- Employee profile CRUD
- Role-based employee access
- Salary history tracking

#### 8. Collections
- Collection entry against customer dues
- Automatic customer balance updates
- Collection history

#### 9. Analytics Dashboard (Admin Only)
- Revenue trends (last 15 days)
- Sales analytics
- Expense summaries
- Customer metrics
- Financial reports

---

## API Architecture

### API Versioning
All endpoints follow `/api/v1/` prefix pattern.

### Authentication Flow
```
1. POST /api/v1/auth/login
   → Returns: { accessToken, refreshToken, user }

2. Protected Route Header:
   Authorization: Bearer <accessToken>

3. POST /api/v1/auth/refresh-token
   → Returns new accessToken when expired

4. POST /api/v1/auth/change-password
   → Authenticated user password update
```

### API Endpoints Reference

| Module | Endpoints | Protected |
|--------|-----------|-----------|
| Auth | `/auth/login`, `/auth/refresh-token`, `/auth/change-password` | Partial |
| Users | `/users` (CRUD) | Admin only |
| Products | `/products` (CRUD) | Authenticated |
| Stock | `/stocks` (CRUD) | Admin/Stock Manager |
| Customers | `/customers` (CRUD) | Admin/Accountant |
| Invoices | `/invoices` (CRUD) | Admin/Accountant |
| Collections | `/collections` (CRUD) | Admin/Accountant |
| Employees | `/employees` (CRUD) | Admin only |
| Expenses | `/expenses` (CRUD) | Admin/Accountant |
| Analytics | `/analytics`, `/balances` | Admin only |

---

## Frontend Architecture

### State Management (Redux Toolkit)
- **Slices**: Feature-based state (auth, theme, etc.)
- **RTK Query**: API caching and data fetching
- **Redux Persist**: Persistent auth state across reloads

### Routing Structure (React Router 7)
- **Public Routes**: `/login`, `/unauthorized`
- **Protected Routes**: All dashboard routes
- **Role-Based Routes**: Middleware checks user role

### Component Patterns
```
ui/              # Base components (Button, Input, etc.)
├── form/         # Form components (RHFInput, RHFSelect)
├── dialog/       # Modal dialogs
├── table/        # Data tables
├── analytics/    # Chart components
└── shared/       # Shared components

pages/            # Page components
├── Login.jsx
├── Analytics.jsx
├── product/
│   ├── ProductsPage.jsx
│   └── ProductForm.jsx
└── [similar structure for other modules]
```

### Utility Functions
- `api-endpoints.js` - Centralized API URL configuration
- `role-utils.js` - Role-based permission helpers
- `verifty-token.js` - JWT token validation
- `clean-payload.js` - Request payload sanitization

---

## Backend Architecture

### Module Pattern
Each backend module follows this structure:
```
modules/
├── [module-name]/
│   ├── [module].controller.ts  # Request handlers
│   ├── [module].service.ts     # Business logic
│   ├── [module].route.ts       # Route definitions
│   ├── [module].model.ts       # Mongoose schema
│   └── [module].interface.ts   # TypeScript types
```

### Middleware
- `authMiddleware.ts` - JWT verification and user injection
- `validateRequest.ts` - Zod schema validation

### Validation Strategy
All requests validated using Zod schemas in `validation/` directory.

### Database Models
Key models: User, Product, Stock, Customer, Invoice, Collection, Employee, Expense, Balance

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_PORT=5173
```

### Backend (.env)
```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/alishan-stock-management
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=<access-secret>
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_SECRET=<refresh-secret>
JWT_REFRESH_EXPIRES_IN=10d
SUPER_ADMIN_PASSWORD=<initial-password>
```

---

## Development Workflow

### Running Development Servers
```bash
# Backend (from backend/)
yarn start:dev    # Hot-reload TypeScript server

# Frontend (from frontend/)
yarn dev          # Vite dev server
```

### Building for Production
```bash
# Backend
yarn build        # Compile TypeScript to dist/
yarn start        # Run compiled server

# Frontend
yarn build        # Vite build to dist/
yarn preview      # Preview production build
```

---

## Version 2.0 Goals & Considerations

### Current Status
- Two separate repositories consolidated into monorepo
- Frontend: React 19, modern stack
- Backend: TypeScript, Express, MongoDB
- Role-based access control implemented
- Core business logic complete

### Potential 2.0 Improvements to Consider
1. **API Integration**: Update hardcoded API URLs to environment variables
2. **TypeScript Frontend**: Migrate frontend from JS to TS for type safety
3. **Testing**: Add unit and integration tests
4. **Error Handling**: Centralized error handling and user feedback
5. **Performance**: Implement caching strategies and optimize queries
6. **Security**: Add rate limiting, audit logging, enhanced input validation
7. **Documentation**: API documentation (OpenAPI/Swagger)
8. **DevOps**: CI/CD pipeline, containerization (Docker)

---

## Key Files Reference

### Frontend Key Files
| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component with router setup |
| `src/redux/store.js` | Redux store configuration |
| `src/routes/index.jsx` | Route definitions with RBAC |
| `src/utils/api-endpoints.js` | API base URL configuration |
| `src/utils/role-utils.js` | Role-based permission helpers |

### Backend Key Files
| File | Purpose |
|------|---------|
| `src/server.ts` | Application entry point |
| `src/app.ts` | Express app configuration |
| `src/app/routes/index.ts` | API route aggregation |
| `src/app/middlewares/authMiddleware.ts` | JWT authentication |
| `src/app/config/index.ts` | Environment configuration |

---

## Common Commands Reference

### Frontend
```bash
cd frontend
yarn dev              # Start dev server
yarn build            # Build for production
yarn lint             # Run ESLint
yarn preview          # Preview production build
```

### Backend
```bash
cd backend
yarn start:dev        # Development with hot reload
yarn build            # Compile TypeScript
yarn start            # Production server
yarn prepare          # Pre-deployment build
```

---

## Notes for Claude

### When Working on This Project:
1. **Maintain Role-Based Access**: Always check role permissions when adding new features
2. **Type Safety**: Backend uses TypeScript - maintain type definitions
3. **Validation**: All API requests should be validated with Zod schemas
4. **Database**: All data operations go through Mongoose models
5. **State**: Frontend uses Redux Toolkit for global state
6. **API**: Use RTK Query patterns for API calls in frontend
7. **Components**: Reuse ShadCN/Radix components where possible
8. **Styling**: Use Tailwind CSS v4 utility classes

### File Conventions:
- Frontend components: PascalCase (`.jsx`)
- Backend modules: kebab-case directories (`.ts`)
- Constants: UPPER_SNAKE_CASE
- Utils: camelCase

### Architecture Decisions Made:
- Monorepo structure for unified development
- Module-based backend architecture for scalability
- Feature-based frontend organization
- Centralized API endpoint configuration
- JWT-based stateless authentication
- MongoDB for flexible schema requirements

---

**Last Updated**: 2025-06-17 (v2.0 Planning Phase)
