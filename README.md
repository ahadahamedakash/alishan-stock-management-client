# Alishan — Stock Management Web Application (Frontend)

Alishan is a modern, role-based stock management web application built with **React 19**, **Redux Toolkit**, **Tailwind CSS**, and **Vite**. This project serves as the frontend of a MERN stack solution, designed to streamline inventory control, invoice processing, expense tracking, and financial analytics in a structured and scalable way.

> ⚠️ This is the **frontend** codebase only. The backend (Express + MongoDB) is maintained separately.

---

## 🚀 Features Overview

### 👤 User Roles

- **Admin**
  - Create, update, and delete users (Admin, Stock Manager, Accountant)
  - Full access to all dashboard features
- **Stock Manager**
  - Manage product stock (add/deduct)
  - View product and stock-related data
- **Accountant**
  - Manage invoices, expenses, collections
  - Cannot access stock or employee management

### 📦 Products & Stock Management

- Add, edit, and delete products
- Add new stock entries by date
- Deduct stock using invoice number (confirmation required)
- View complete stock history

### 🧾 Invoice & Customer Management

- Create invoices with customer selection
- Download and print invoice as PDF format
- Auto-calculates total, due, and paid amounts
- Updates customer profile with:
  - Total Purchase
  - Total Paid
  - Total Due

### 👥 Employee Management

- Create, update, delete employees
- View employee salary history (if salary is issued via expenses)

### 💸 Expense & Cash Flow Tracking

- Categorized expense creation
- Tracks:
  - Total Revenue
  - Total Expense
  - Current Balance
- Salary category links expense to employee
- Full expense history view

### 💰 Collections

- Add collection against customer dues
- View collection history
- Automatically updates customer due and balance

### 📊 Analytics Dashboard

- Last 15 days revenue and sales trends
- Recent expense list
- Summary of:
  - Total Revenue
  - Total Expenses
  - Total Customers

---

## 🛠 Tech Stack

| Tech                  | Description                           |
| --------------------- | ------------------------------------- |
| **React 19**          | UI Framework                          |
| **Redux Toolkit**     | Global state management               |
| **React Router 7**    | Client-side routing                   |
| **Tailwind CSS v4**   | Utility-first CSS framework           |
| **ShadCN + Radix UI** | Accessible and styled components      |
| **React Hook Form**   | Form handling and validation          |
| **Yup**               | Schema-based form validation          |
| **Recharts**          | Visual data representation (charts)   |
| **Redux Persist**     | Persistent Redux state across reloads |
| **JWT Decode**        | Token decoding for auth               |
| **React Hot Toast**   | Notifications                         |
| **Date-fns**          | Date utilities                        |
| **Lodash**            | Utility functions                     |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** (recommended) or **npm**
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
# Clone the frontend repository
git clone https://github.com/ahad1033/alishan-stock-management-client
cd alishan-stock-management-client
```

### 2. Install Dependencies

```bash
# Using Yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Create environment file
touch .env
```

Add the following environment variables to your `.env` file:

```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Production (if needed)
# VITE_API_BASE_URL=https://alishan-stock-management-server.onrender.com/api/v1

# Optional: Custom port for development
VITE_PORT=5173
```

### 4. Update API Configuration

The application currently uses a hardcoded API URL. To use environment variables, you'll need to update the API configuration:

1. Open `src/utils/api-endpoints.js`
2. Replace the hardcoded URL with:

```javascript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://alishan-stock-management-server.onrender.com/api/v1";
```

### 5. Start Development Server

```bash
# Start development server
yarn dev

# Or using npm
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🚀 Available Scripts

```bash
# Development
yarn dev          # Start development server
npm run dev

# Build for production
yarn build        # Build the app for production
npm run build

# Preview production build
yarn preview      # Preview the production build locally
npm run preview

# Linting
yarn lint         # Run ESLint
npm run lint
```

---

## 📁 Project Structure

```
src/
│
├── components/        # Reusable UI components
│   ├── analytics/    # Analytics and chart components
│   ├── auth/         # Authentication components
│   ├── form/         # Form components
│   ├── shared/       # Shared UI components
│   ├── table/        # Table components
│   └── ui/           # Base UI components (ShadCN)
│
├── redux/            # Redux store and slices
│   ├── api/          # RTK Query API configurations
│   └── features/     # Feature-based slices
│
├── pages/            # Route-based pages
│   ├── analytics/    # Analytics dashboard
│   ├── customer/     # Customer management
│   ├── employee/     # Employee management
│   ├── expense/      # Expense tracking
│   ├── invoice/      # Invoice management
│   ├── product/      # Product management
│   ├── stock/        # Stock management
│   └── user/         # User management
│
├── hooks/            # Custom React hooks
├── layouts/          # Dashboard and page layouts
├── routes/           # Route definitions and role-based access
├── utils/            # Utility functions
└── App.jsx           # Main app component
```

---

## 📊 Dashboard Access Control

| Feature / Role   | Admin | Stock Manager | Accountant |
| ---------------- | :---: | :-----------: | :--------: |
| Manage Users     |  ✔️   |      ❌       |     ❌     |
| View Products    |  ✔️   |      ✔️       |     ✔️     |
| Manage Stock     |  ✔️   |      ✔️       |     ❌     |
| Create Invoices  |  ✔️   |      ❌       |     ✔️     |
| Manage Expenses  |  ✔️   |      ❌       |     ✔️     |
| View Collections |  ✔️   |      ❌       |     ✔️     |
| Manage Employees |  ✔️   |      ❌       |     ❌     |
| Access Analytics |  ✔️   |      ❌       |     ❌     |

---

## 🔗 Backend Integration

This frontend application connects to a separate backend API. The backend should provide the following endpoints:

- **Authentication**: `/auth/login`, `/auth/change-password`, `/auth/refresh-token`
- **Users**: `/users/*`
- **Products**: `/products/*`
- **Customers**: `/customers/*`
- **Employees**: `/employees/*`
- **Invoices**: `/invoices/*`
- **Stock**: `/stocks/*`
- **Expenses**: `/expenses/*`
- **Collections**: `/collections/*`
- **Analytics**: `/analytics/*`

### Backend Repository

The backend API is maintained separately. Make sure the backend server is running and accessible at the configured API URL.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
# Build for production
yarn build

# The built files will be in the `dist` directory
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ahad1033/alishan-stock-management-client/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

## 🔄 Updates

- **React 19**: Latest React features and performance improvements
- **Tailwind CSS v4**: Latest styling framework with improved performance
- **Redux Toolkit**: Modern Redux with RTK Query for API management
- **React Router 7**: Latest routing with improved performance

---

**Happy Coding! 🚀**
